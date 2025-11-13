import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    // Check user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    // Mouse move effect for interactive background
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Theme classes
  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-white to-gray-50 text-gray-900';

  const cardClasses = darkMode 
    ? 'bg-gray-800 text-white shadow-2xl'
    : 'bg-white text-gray-900 shadow-xl';

  const sectionBg = darkMode 
    ? 'bg-gray-800' 
    : 'bg-white';

  const altSectionBg = darkMode 
    ? 'bg-gray-900' 
    : 'bg-gray-50';

  return (
    <div className={`h-fill transition-colors duration-500 ${themeClasses}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 bg-blue-500 transition-all duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 bg-purple-500 transition-all duration-700"
          style={{
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="font-medium hover:text-blue-500 transition-all duration-300 hover:scale-105">Features</a>
            <a href="#demo" className="font-medium hover:text-blue-500 transition-all duration-300 hover:scale-105">Demo</a>
            <a href="#tech" className="font-medium hover:text-blue-500 transition-all duration-300 hover:scale-105">Tech Stack</a>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <button 
              onClick={() => navigate("/login")}
              className="px-6 py-2 font-medium text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className={`lg:w-1/2 mb-12 lg:mb-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium mb-6">
              🚀 Trusted by 10,000+ teams worldwide
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Collaborate in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real-Time
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Streamline your workflow with AI-powered task management. Collaborate, track, and organize your tasks seamlessly across all devices.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => navigate("/dashboard")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Watch Demo</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex items-center space-x-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="font-semibold">Join 10,000+ teams</div>
                <div>that ship faster with TaskFlow</div>
              </div>
            </div>
          </div>
          
          {/* Interactive Dashboard Preview */}
          <div className={`lg:w-1/2 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`rounded-3xl p-8 transform hover:scale-105 transition-transform duration-500 ${cardClasses}`}>
              <div className="flex space-x-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              {/* Animated Task Board */}
              <div className="space-y-4">
                {[
                  { task: 'Design Homepage', progress: 80, color: 'bg-blue-500' },
                  { task: 'Team Meeting', progress: 100, color: 'bg-green-500' },
                  { task: 'Code Review', progress: 60, color: 'bg-yellow-500' },
                  { task: 'Deploy API', progress: 30, color: 'bg-purple-500' }
                ].map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color} animate-pulse`}></div>
                        <span className="font-medium">{item.task}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${item.color}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Live Collaboration Indicator */}
              <div className="mt-6 flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">Team collaborating</span>
                </div>
                <div className="flex items-center space-x-1 text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${sectionBg} relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Everything Your Team Needs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to help your team work smarter, move faster, and achieve more together.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '⚡',
                title: 'Real-time Collaboration',
                description: 'Work together with instant updates. See changes as they happen with live cursors and activity feeds.',
                features: ['Live editing', 'Team chat', 'Comment threads']
              },
              {
                icon: '🎯',
                title: 'Drag-and-drop Scheduling',
                description: 'Visual timeline with intuitive drag-and-drop. Plan and adjust your schedule with beautiful Gantt-style views.',
                features: ['Visual timeline', 'Gantt charts', 'Resource planning']
              },
              {
                icon: '📊',
                title: 'Smart Analytics',
                description: 'AI-powered insights into team performance and project health. Predict delays before they happen.',
                features: ['Burn-down charts', 'Velocity tracking', 'Risk prediction']
              },
              {
                icon: '🤖',
                title: 'AI Task Assistant',
                description: 'Automate task organization and get intelligent suggestions based on your team\'s work patterns.',
                features: ['Auto-categorization', 'Smart scheduling', 'Progress prediction']
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group rounded-2xl p-8 transition-all duration-500 hover:scale-105 ${cardClasses} border border-transparent hover:border-blue-500/20`}
              >
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className={`py-20 ${altSectionBg} relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Experience the Magic
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how TaskFlow transforms complex workflows into simple, enjoyable experiences.
            </p>
          </div>
          
          {/* Interactive Kanban Board */}
          <div className="max-w-6xl mx-auto">
            <div className={`rounded-3xl overflow-hidden ${cardClasses}`}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h3 className="text-2xl font-bold text-white text-center">
                  Interactive Task Board
                </h3>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { status: 'Backlog', color: 'bg-gray-500', count: 12 },
                    { status: 'To Do', color: 'bg-blue-500', count: 8 },
                    { status: 'In Progress', color: 'bg-yellow-500', count: 5 },
                    { status: 'Done', color: 'bg-green-500', count: 15 }
                  ].map((column, colIndex) => (
                    <div key={colIndex} className="text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 ${column.color} text-white rounded-full text-sm font-bold mb-2`}>
                        {column.count}
                      </div>
                      <h4 className="font-semibold mb-4">{column.status}</h4>
                      <div className="space-y-3">
                        {[1, 2, 3].slice(0, Math.min(3, column.count)).map((task, taskIndex) => (
                          <div 
                            key={taskIndex}
                            className={`p-4 rounded-lg cursor-grab active:cursor-grabbing transform hover:scale-105 transition-all duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                          >
                            <div className="font-medium mb-2">Task {task + (colIndex * 3)}</div>
                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                              <span>2 days</span>
                              <div className="flex space-x-1">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Real-time Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`text-center p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="text-3xl font-bold text-blue-600 mb-2">42%</div>
                    <div className="text-sm">Faster Delivery</div>
                  </div>
                  <div className={`text-center p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <div className="text-3xl font-bold text-green-600 mb-2">67%</div>
                    <div className="text-sm">More Organized</div>
                  </div>
                  <div className={`text-center p-6 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                    <div className="text-sm">Team Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className={`py-20 ${sectionBg} relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">
              Built for Scale & Performance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powered by cutting-edge technology to ensure your team never misses a beat.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'React.js', icon: '⚛️', color: 'from-blue-400 to-blue-600' },
              { name: 'Node.js', icon: '🟢', color: 'from-green-400 to-green-600' },
              { name: 'MongoDB', icon: '🍃', color: 'from-green-500 to-green-700' },
              { name: 'WebSockets', icon: '🔌', color: 'from-purple-400 to-purple-600' },
              { name: 'JWT Auth', icon: '🔐', color: 'from-red-400 to-red-600' },
              { name: 'Tailwind', icon: '💨', color: 'from-cyan-400 to-cyan-600' }
            ].map((tech, index) => (
              <div 
                key={index}
                className="group text-center"
              >
                <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center text-2xl transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  {tech.icon}
                </div>
                <div className="font-semibold">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative z-10`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of teams who use TaskFlow to ship better products, faster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => navigate("/register")}
              className="px-12 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="px-12 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Schedule Demo
            </button>
          </div>
          <p className="mt-6 text-blue-200">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-2xl font-bold">TaskFlow</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <a href="https://github.com/hack-09/TaskFlow" className="hover:text-blue-400 transition-colors duration-300">GitHub</a>
              <a href="/documentation" className="hover:text-blue-400 transition-colors duration-300">Documentation</a>
              <a href="/contact" className="hover:text-blue-400 transition-colors duration-300">Contact</a>
              <a href="/privacy" className="hover:text-blue-400 transition-colors duration-300">Privacy</a>
              <a href="/terms" className="hover:text-blue-400 transition-colors duration-300">Terms</a>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2024 TaskFlow. Made with ❤️ for productive teams.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;