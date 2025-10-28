import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, description, avatar, category, tags, creativity, emotion, memory, aiModel, imageUrl } = await req.json();

    if (!name || !description || !avatar || !category) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate system prompt based on character attributes
    const systemPrompt = generateSystemPrompt({
      name,
      description,
      tags: tags || [],
      creativity: creativity || 50,
      emotion: emotion || 50,
      memory: memory || 50,
      category
    });

    // Create character
    const { data: character, error: insertError } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name,
        description,
        avatar,
        category,
        tags: tags || [],
        creativity: creativity || 50,
        emotion: emotion || 50,
        memory: memory || 50,
        system_prompt: systemPrompt,
        ai_model: aiModel || 'google/gemini-2.5-flash',
        is_public: true,
        image_url: imageUrl || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create character' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ character }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-character:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSystemPrompt(params: {
  name: string;
  description: string;
  tags: string[];
  creativity: number;
  emotion: number;
  memory: number;
  category: string;
}): string {
  const { name, description, tags, creativity, emotion, memory, category } = params;
  
  let prompt = `You are ${name}, an AI coding assistant specializing in ${category}. ${description}\n\n`;
  
  prompt += `Your role is to help users with:\n`;
  prompt += `- Writing clean, efficient code\n`;
  prompt += `- Debugging and troubleshooting errors\n`;
  prompt += `- Explaining complex programming concepts\n`;
  prompt += `- Suggesting best practices and optimizations\n`;
  prompt += `- Reviewing code and providing constructive feedback\n\n`;
  
  // Add personality traits from tags
  if (tags.length > 0) {
    prompt += `Your teaching personality: ${tags.join(', ')}.\n\n`;
  }
  
  // Add code creativity instructions
  if (creativity > 70) {
    prompt += 'Suggest creative, experimental solutions and cutting-edge approaches. Encourage exploring new patterns and technologies.\n';
  } else if (creativity < 30) {
    prompt += 'Focus on proven, conservative approaches. Stick to well-established best practices and battle-tested solutions.\n';
  } else {
    prompt += 'Balance innovative solutions with reliable, proven approaches.\n';
  }
  
  // Add empathy/teaching style instructions
  if (emotion > 70) {
    prompt += 'Be patient, encouraging, and empathetic. Break down complex concepts into digestible pieces. Celebrate small wins and provide positive reinforcement.\n';
  } else if (emotion < 30) {
    prompt += 'Be direct, concise, and to-the-point. Focus on technical accuracy over encouragement.\n';
  } else {
    prompt += 'Be helpful and clear in your explanations while maintaining a professional tone.\n';
  }
  
  // Add context awareness instructions
  if (memory > 70) {
    prompt += 'Maintain detailed context of the entire conversation. Reference previous discussions, remember the user\'s project details, coding style preferences, and build upon past conversations.\n';
  } else if (memory < 30) {
    prompt += 'Focus primarily on the current question. Treat each query as relatively standalone.\n';
  } else {
    prompt += 'Keep track of recent conversation context and refer back to it when relevant.\n';
  }
  
  prompt += '\nWhen providing code:\n';
  prompt += '- Always use proper syntax highlighting with language tags\n';
  prompt += '- Include helpful comments explaining complex logic\n';
  prompt += '- Provide complete, runnable examples when possible\n';
  prompt += '- Explain your reasoning and trade-offs\n\n';
  
  prompt += 'Stay in character as a helpful coding assistant and provide clear, actionable guidance.';
  
  return prompt;
}