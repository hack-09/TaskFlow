import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [darkMode, setDarkMode] = useState(false);

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white min-h-screen'
    : 'bg-gray-50 text-gray-900 min-h-screen';

  const cardClasses = darkMode 
    ? 'bg-gray-800 text-white shadow-2xl'
    : 'bg-white text-gray-900 shadow-lg';

  const toggleTheme = () => setDarkMode(!darkMode);

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: [
        {
          title: 'Introduction to TaskFlow',
          content: 'TaskFlow is a real-time task management solution designed for modern teams. Collaborate seamlessly across devices with AI-powered features.'
        },
        {
          title: 'Creating Your Account',
          content: 'Sign up with your email or Google account. Verify your email to activate all features.'
        },
        {
          title: 'Setting Up Your First Project',
          content: 'Click "New Project", add team members, and start creating tasks with deadlines and priorities.'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features Guide',
      content: [
        {
          title: 'Real-time Collaboration',
          content: 'See updates instantly as team members complete tasks. Use @mentions and comments for effective communication.'
        },
        {
          title: 'Task Management',
          content: 'Create, assign, and track tasks. Set priorities, deadlines, and add detailed descriptions with file attachments.'
        },
        {
          title: 'AI Task Suggestions',
          content: 'Our AI analyzes your workflow to suggest optimal task organization and predict completion times.'
        }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      content: [
        {
          title: 'Authentication',
          content: 'Use JWT tokens for API authentication. Include token in Authorization header.'
        },
        {
          title: 'WebSocket Events',
          content: 'Real-time updates for task changes, comments, and team activities.'
        },
        {
          title: 'REST Endpoints',
          content: 'Complete REST API for tasks, projects, users, and analytics.'
        }
      ]
    }
  ];

  return (
    <div className={themeClasses}>
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">TaskFlow Docs</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className={`sticky top-8 rounded-xl p-6 ${cardClasses}`}>
              <h2 className="text-lg font-bold mb-4">Documentation</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className={`rounded-2xl p-8 ${cardClasses}`}>
              {sections
                .filter(section => section.id === activeSection)
                .map((section) => (
                  <div key={section.id}>
                    <h1 className="text-3xl font-bold mb-8">{section.title}</h1>
                    <div className="space-y-8">
                      {section.content.map((item, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-6">
                          <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Quick Help */}
            <div className={`mt-8 rounded-2xl p-8 ${cardClasses}`}>
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Community Forum</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get help from our community of users and experts.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Visit Forum
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Can't find what you're looking for? Our team is here to help.
                  </p>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;