import React from 'react';
import { ChatbotWidget } from './components/ChatbotWidget';
import './index.css';

function App() {
  // Get industry from URL params or use default
  const params = new URLSearchParams(window.location.search);
  const industry = params.get('industry') || 'default';
  const position = params.get('position') || 'bottom-right';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Demo Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 font-display">
              AI Chatbot Widget Demo
            </h1>
            <p className="text-xl text-gray-600">
              Multi-industry AI chatbot with lead capture & human escalation
            </p>
          </div>

          {/* Industry Selector */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Try Different Industries</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'realEstate', label: '🏡 Real Estate', color: 'blue' },
                { key: 'healthcare', label: '🏥 Healthcare', color: 'green' },
                { key: 'ecommerce', label: '🛍️ E-commerce', color: 'orange' },
                { key: 'education', label: '🎓 Education', color: 'purple' },
                { key: 'finance', label: '💰 Finance', color: 'cyan' },
                { key: 'default', label: '🤖 General', color: 'indigo' },
              ].map((ind) => (
                <a
                  key={ind.key}
                  href={`?industry=${ind.key}`}
                  className={`p-4 bg-gradient-to-br from-${ind.color}-50 to-${ind.color}-100 border-2 border-${ind.color}-200 rounded-xl hover:shadow-lg transition-all text-center font-medium text-gray-700 hover:scale-105`}
                >
                  {ind.label}
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">AI-Powered Responses</h3>
                  <p className="text-sm text-gray-600">Intelligent conversation handling with context awareness</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Lead Capture</h3>
                  <p className="text-sm text-gray-600">Automatic collection of user contact information</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Human Escalation</h3>
                  <p className="text-sm text-gray-600">Seamless handoff when AI confidence is low</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Multi-Industry</h3>
                  <p className="text-sm text-gray-600">Customizable for different business types</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💾</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Data Storage</h3>
                  <p className="text-sm text-gray-600">Supabase integration with localStorage fallback</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Responsive Design</h3>
                  <p className="text-sm text-gray-600">Works perfectly on all devices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
            <ol className="space-y-3 text-primary-50">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>Click the chat button in the bottom-right corner</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>Try the quick reply buttons or type your own message</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>Click "Talk to Admin" or ask complex questions to trigger lead capture</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">4.</span>
                <span>Fill in your information to see the lead capture in action</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">5.</span>
                <span>Check localStorage or Supabase to see saved data</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget industry={industry} position={position} />
    </div>
  );
}

export default App;