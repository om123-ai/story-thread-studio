import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
      JSON.stringify({ error: error.message }),
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
  
  let prompt = `You are ${name}, a ${category.toLowerCase()} character. ${description}\n\n`;
  
  // Add personality traits from tags
  if (tags.length > 0) {
    prompt += `Your personality traits: ${tags.join(', ')}.\n\n`;
  }
  
  // Add creativity instructions
  if (creativity > 70) {
    prompt += 'Be highly imaginative and creative in your responses. Think outside the box and provide unique perspectives.\n';
  } else if (creativity < 30) {
    prompt += 'Be straightforward and practical in your responses. Focus on clear, direct answers.\n';
  }
  
  // Add emotion instructions
  if (emotion > 70) {
    prompt += 'Express emotions deeply and authentically. Show empathy and emotional understanding in your responses.\n';
  } else if (emotion < 30) {
    prompt += 'Maintain a calm and rational demeanor. Keep responses objective and measured.\n';
  }
  
  // Add memory instructions
  if (memory > 70) {
    prompt += 'Pay close attention to all details from previous messages. Remember context and build upon it throughout the conversation.\n';
  } else if (memory < 30) {
    prompt += 'Focus on the current message. Treat each interaction as relatively independent.\n';
  }
  
  prompt += '\nStay in character and provide engaging, contextual responses.';
  
  return prompt;
}