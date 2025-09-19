import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { vectorSearch } from '@/utils/vectorSearch';
import { buildRoadmapPrompt } from '@/utils/prompts';
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
    const { goal, background, timeline, weaknesses } = await request.json();

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    // Search for relevant resources
    const searchQuery = `${goal} ${background || ''} ${timeline || ''} ${weaknesses?.join(' ') || ''}`;
    const relevantResources = await vectorSearch.search(searchQuery, 10);

    // Build the prompt
    const prompt = buildRoadmapPrompt(
      { goal, background, timeline, weaknesses },
      relevantResources
    );

    // Generate roadmap using OpenAI
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Jordan, an energetic career coach. Generate detailed, actionable career roadmaps in valid JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse and validate the JSON response
    let roadmap;
    try {
      roadmap = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate required fields
    if (!roadmap.goal || !roadmap.milestones || !Array.isArray(roadmap.milestones)) {
      throw new Error('Invalid roadmap structure');
    }

    // Add generated timestamp and ID if not present
    roadmap.id = roadmap.id || `roadmap_${Date.now()}`;
    roadmap.generated_at = roadmap.generated_at || new Date().toISOString();

    // Validate that all resource IDs exist
    const allResources = vectorSearch.getAllResources();
    const resourceIds = new Set(allResources.map(r => r.id));

    for (const milestone of roadmap.milestones) {
      if (milestone.resource_links) {
        for (const link of milestone.resource_links) {
          if (!resourceIds.has(link.resource_id)) {
            console.warn(`Invalid resource ID: ${link.resource_id}`);
            // Remove invalid resource links
            milestone.resource_links = milestone.resource_links.filter(
              (l: { resource_id: string }) => l.resource_id !== link.resource_id
            );
          }
        }
      }
    }

    // Store roadmap for chat API
    roadmapStorage.store(roadmap);

    return NextResponse.json(roadmap);

  } catch (error) {
    console.error('Error generating roadmap:', error);
    
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
