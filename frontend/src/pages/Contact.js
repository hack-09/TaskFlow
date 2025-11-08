import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white min-h-screen'
    : 'bg-gray-50 text-gray-900 min-h-screen';

  const cardClasses = darkMode 
    ? 'bg-gray-800 text-white shadow-2xl'
    : 'bg-white text-gray-900 shadow-lg';

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={themeClasses}>
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">Contact Us</span>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions about TaskFlow? We're here to help and would love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl p-8 h-full ${cardClasses}`}>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">support@taskflow.com</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">We'll reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Live Chat</h3>
                      <p className="text-gray-600 dark:text-gray-300">Available 9AM-6PM EST</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get instant help from our team</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Documentation</h3>
                      <p className="text-gray-600 dark:text-gray-300">Comprehensive guides</p>
                      <button 
                        onClick={() => navigate('/documentation')}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        Browse Docs →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {['Twitter', 'GitHub', 'LinkedIn', 'Product Hunt'].map((platform) => (
                      <button
                        key={platform}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-8 ${cardClasses}`}>
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="feedback">Product Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;