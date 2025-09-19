'use client';

import { useState } from 'react';
import { Target, User, Clock, AlertCircle, Send } from 'lucide-react';

interface CareerGoalFormProps {
  onSubmit: (data: {
    goal: string;
    background?: string;
    timeline?: string;
    weaknesses?: string[];
  }) => void;
  isLoading: boolean;
}

export default function CareerGoalForm({ onSubmit, isLoading }: CareerGoalFormProps) {
  const [formData, setFormData] = useState({
    goal: '',
    background: '',
    timeline: '',
    weaknesses: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weaknessesArray = formData.weaknesses
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0);

    onSubmit({
      goal: formData.goal,
      background: formData.background || undefined,
      timeline: formData.timeline || undefined,
      weaknesses: weaknessesArray.length > 0 ? weaknessesArray : undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Career Goal - Required */}
        <div>
          <label htmlFor="goal" className="block text-lg font-semibold text-gray-900 mb-3">
            <Target className="inline h-5 w-5 mr-2 text-purple-600" />
            What&apos;s your career goal? *
          </label>
          <input
            type="text"
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            placeholder="e.g., Become a Senior Software Engineer at a tech company"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-400"
          />
        </div>

        {/* Background - Optional */}
        <div>
          <label htmlFor="background" className="block text-lg font-semibold text-gray-900 mb-3">
            <User className="inline h-5 w-5 mr-2 text-blue-600" />
            Your background (optional)
          </label>
          <textarea
            id="background"
            name="background"
            value={formData.background}
            onChange={handleChange}
            placeholder="e.g., I&apos;m a junior developer with 2 years of experience in React and Node.js"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-400 resize-none"
          />
        </div>

        {/* Timeline - Optional */}
        <div>
          <label htmlFor="timeline" className="block text-lg font-semibold text-gray-900 mb-3">
            <Clock className="inline h-5 w-5 mr-2 text-green-600" />
            Timeline (optional)
          </label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="e.g., 6 months, 1 year, 2 years"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-400"
          />
        </div>

        {/* Weaknesses - Optional */}
        <div>
          <label htmlFor="weaknesses" className="block text-lg font-semibold text-gray-900 mb-3">
            <AlertCircle className="inline h-5 w-5 mr-2 text-orange-600" />
            Areas to improve (optional)
          </label>
          <input
            type="text"
            id="weaknesses"
            name="weaknesses"
            value={formData.weaknesses}
            onChange={handleChange}
            placeholder="e.g., system design, leadership, algorithms (comma-separated)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder-gray-400"
          />
          <p className="text-sm text-gray-500 mt-2">
            Separate multiple areas with commas
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!formData.goal.trim() || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Generate My Roadmap 🚀</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Be specific about your goal - the more details, the better the roadmap</li>
          <li>• Include your current experience level for personalized milestones</li>
          <li>• Mention any time constraints to get realistic timelines</li>
          <li>• Be honest about areas to improve - we&apos;ll help you address them!</li>
        </ul>
      </div>
    </div>
  );
}
