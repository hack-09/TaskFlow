import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();
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
      title: 'Acceptance of Terms',
      content: `By accessing and using TaskFlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.`
    },
    {
      title: 'Description of Service',
      content: `TaskFlow provides a real-time task management platform that enables teams to collaborate, track, and organize tasks across devices.`
    },
    {
      title: 'User Accounts',
      content: `You must be at least 13 years old to use our Service. You are responsible for maintaining the security of your account and password.`
    },
    {
      title: 'Subscription and Payments',
      content: `• Free tier: Basic features available at no cost
• Pro tier: Advanced features available for a monthly subscription
• Enterprise: Custom pricing for large organizations
• All payments are non-refundable unless required by law`
    },
    {
      title: 'User Responsibilities',
      content: `You agree not to:
• Violate any laws or third-party rights
• Use the Service for any illegal purpose
• Share your account credentials
• Attempt to gain unauthorized access
• Interfere with the Service's operation`
    },
    {
      title: 'Intellectual Property',
      content: `The Service and its original content, features, and functionality are owned by TaskFlow and are protected by international copyright, trademark, and other intellectual property laws.`
    },
    {
      title: 'Termination',
      content: `We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.`
    },
    {
      title: 'Limitation of Liability',
      content: `TaskFlow shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use or inability to use the Service.`
    },
    {
      title: 'Disclaimer',
      content: `The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free.`
    },
    {
      title: 'Governing Law',
      content: `These Terms shall be governed by the laws of the State of California, without regard to its conflict of law provisions.`
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to modify these terms at any time. We will provide notice of significant changes. Continued use of the Service constitutes acceptance of the modified terms.`
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
              <span className="text-xl font-bold">Terms of Service</span>
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

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <div className={`inline-block px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              Effective Date: December 1, 2024
            </div>
          </div>

          {/* Important Notice */}
          <div className={`rounded-2xl p-8 mb-8 border-l-4 border-yellow-500 ${cardClasses}`}>
            <div className="flex items-start space-x-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-bold text-lg mb-2">Important Legal Notice</h3>
                <p className="leading-relaxed">
                  Please read these Terms of Service carefully before using TaskFlow. 
                  These terms govern your access to and use of our services.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className={`rounded-2xl p-8 ${cardClasses}`}>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300 ml-11">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Agreement Section */}
          <div className={`rounded-2xl p-8 mt-8 border-l-4 border-green-500 ${cardClasses}`}>
            <h2 className="text-2xl font-bold mb-4">Your Agreement</h2>
            <p className="mb-4">
              By using TaskFlow, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/contact')}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                Questions? Contact Us
              </button>
              <button 
                onClick={() => navigate('/privacy')}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                View Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;