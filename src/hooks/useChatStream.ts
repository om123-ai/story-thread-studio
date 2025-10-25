import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChatStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async ({
    conversationId,
    message,
    characterId,
    onChunk,
    onComplete,
    onError,
  }: {
    conversationId: string;
    message: string;
    characterId: string;
    onChunk: (text: string) => void;
    onComplete: () => void;
    onError: (error: string) => void;
  }) => {
    setIsStreaming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            conversationId,
            message,
            characterId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }

      onComplete();
    } catch (error: any) {
      console.error('Chat stream error:', error);
      onError(error.message || 'An error occurred');
    } finally {
      setIsStreaming(false);
    }
  };

  return { sendMessage, isStreaming };
};