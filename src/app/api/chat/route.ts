import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { vectorSearch } from '@/utils/vectorSearch';
import { buildChatPrompt } from '@/utils/prompts';
import { roadmapStorage } from '@/utils/storage';

// Initialize OpenAI client lazily to avoid build-time errors
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, roadmapId } = await request.json();

    if (!message || !roadmapId) {
      return NextResponse.json(
        { error: 'Message and roadmapId are required' },
        { status: 400 }
      );
    }

    // Get roadmap from storage
    const roadmap = roadmapStorage.get(roadmapId);
    
    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      );
    }

    // Search for relevant resources based on the message
    const relevantResources = await vectorSearch.search(message, 5);

    // Build the chat prompt
    const prompt = buildChatPrompt(message, roadmap, relevantResources);

    // Generate response using OpenAI
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Jordan, an energetic career coach chatbot. Be helpful, encouraging, and authentic with emojis!',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

