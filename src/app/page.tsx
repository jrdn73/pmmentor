'use client';

import { useState } from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import CareerGoalForm from '@/components/CareerGoalForm';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import ChatbotWidget from '@/components/ChatbotWidget';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  resource_links: Array<{
    title: string;
    url: string;
    resource_id: string;
  }>;
  estimated_duration: string;
}

export interface Roadmap {
  id: string;
  goal: string;
  background?: string;
  timeline?: string;
  weaknesses?: string[];
  milestones: Milestone[];
  generated_at: string;
}

export default function Home() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormSubmit = async (formData: {
    goal: string;
    background?: string;
    timeline?: string;
    weaknesses?: string[];
  }) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Career Roadmap Generator 🚀
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Powered by AI • Built with Next.js
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!roadmap ? (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What&apos;s your career goal? 🎯
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tell us about your aspirations and we&apos;ll create a personalized roadmap 
                with milestones, tasks, and resources to get you there!
              </p>
            </div>
            
            <CareerGoalForm onSubmit={handleFormSubmit} isLoading={isGenerating} />
            
            {isGenerating && (
              <div className="mt-8 flex items-center justify-center space-x-2 text-purple-600">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="text-lg font-medium">Generating your personalized roadmap...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Career Roadmap ✨
              </h2>
              <p className="text-lg text-gray-600">
                Goal: <span className="font-semibold text-purple-600">{roadmap.goal}</span>
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <button
                onClick={() => setRoadmap(null)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Generate New Roadmap
              </button>
            </div>

            <RoadmapDisplay roadmap={roadmap} />
            
            <div className="mt-12">
              <ChatbotWidget roadmapId={roadmap.id} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Built with ❤️ using Next.js, Tailwind CSS, and OpenAI</p>
            <p className="text-sm mt-2">© 2024 Career Roadmap Generator</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
