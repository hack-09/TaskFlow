import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:
      
• Personal information: name, email address, profile information
• Content you create: tasks, projects, comments, files
• Usage data: how you interact with our services
• Technical data: IP address, device information, browser type`
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      
• Provide, maintain, and improve our services
• Develop new products and features
• Communicate with you about updates and support
• Ensure security and prevent fraud
• Personalize your experience
• Comply with legal obligations`
    },
    {
      title: 'Information Sharing',
      content: `We do not sell your personal information. We may share your information in the following circumstances:
      
• With your consent
• With service providers who assist our operations
• For legal compliance and protection
• During business transfers (mergers, acquisitions)
• With other users in your organization (for team features)`
    },
    {
      title: 'Data Security',
      content: `We implement appropriate technical and organizational security measures to protect your personal information. This includes encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure.`
    },
    {
      title: 'Your Rights',
      content: `You have the right to:
      
• Access and receive a copy of your personal data
• Correct inaccurate or incomplete data
• Delete your personal data
• Restrict or object to processing
• Data portability
• Withdraw consent at any time`
    },
    {
      title: 'Data Retention',
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. We may retain certain information as required by law or for legitimate business purposes.`
    },
    {
      title: 'International Transfers',
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.`
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.`
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
              <span className="text-xl font-bold">Privacy Policy</span>
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
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <div className={`inline-block px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              Last Updated: December 1, 2024
            </div>
          </div>

          {/* Introduction */}
          <div className={`rounded-2xl p-8 mb-8 ${cardClasses}`}>
            <p className="text-lg leading-relaxed">
              At TaskFlow, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our task management platform.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className={`rounded-2xl p-8 ${cardClasses}`}>
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-300">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className={`rounded-2xl p-8 mt-8 ${cardClasses}`}>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p>📧 privacy@taskflow.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Business Ave, Suite 100, San Francisco, CA 94107</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;