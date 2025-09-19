'use client';

import { useState } from 'react';
import { CheckCircle, ExternalLink, Download, Clock, BookOpen, Target } from 'lucide-react';
import { Roadmap } from '@/app/page';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
}

export default function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const handleExportPDF = async () => {
    try {
      console.log('Starting PDF export for roadmap:', roadmap.id);
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmap),
      });

      console.log('PDF API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('PDF generation failed:', errorData);
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Create blob from response
      console.log('Creating blob from response...');
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size, 'bytes');
      
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `career-roadmap-${roadmap.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('PDF download initiated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Export as PDF 📄</span>
        </button>
      </div>

      {/* Roadmap Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <div className="flex items-start space-x-4">
          <Target className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Roadmap Overview</h3>
            <p className="text-gray-600 mb-4">
              <strong>Goal:</strong> {roadmap.goal}
            </p>
            {roadmap.background && (
              <p className="text-gray-600 mb-2">
                <strong>Background:</strong> {roadmap.background}
              </p>
            )}
            {roadmap.timeline && (
              <p className="text-gray-600 mb-2">
                <strong>Timeline:</strong> {roadmap.timeline}
              </p>
            )}
            {roadmap.weaknesses && roadmap.weaknesses.length > 0 && (
              <div>
                <strong className="text-gray-600">Areas to improve:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {roadmap.weaknesses.map((weakness, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm"
                    >
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Your Journey Milestones 🎯
        </h3>
        
        {roadmap.milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => toggleMilestone(milestone.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {milestone.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{milestone.estimated_duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>{milestone.tasks.length} tasks</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{milestone.resource_links.length} resources</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className={`transform transition-transform ${expandedMilestone === milestone.id ? 'rotate-180' : ''}`}>
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedMilestone === milestone.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <div className="space-y-6">
                  {/* Tasks */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Tasks to Complete
                    </h5>
                    <ul className="space-y-2">
                      {milestone.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  {milestone.resource_links.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                        Recommended Resources
                      </h5>
                      <div className="grid gap-3">
                        {milestone.resource_links.map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                          >
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {resource.title}
                              </h6>
                              <p className="text-sm text-gray-500 mt-1">
                                Resource ID: {resource.resource_id}
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Generated on {new Date(roadmap.generated_at).toLocaleDateString()} • Roadmap ID: {roadmap.id}</p>
      </div>
    </div>
  );
}
