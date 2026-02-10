import React from 'react';
import { ChatbotWidget } from './components/ChatbotWidget';
import './index.css';

const INDUSTRIES = [
  { key: 'realEstate', label: '🏡 Real Estate', classes: 'from-blue-100 to-cyan-100 border-blue-200' },
  { key: 'healthcare', label: '🏥 Healthcare', classes: 'from-emerald-100 to-green-100 border-emerald-200' },
  { key: 'ecommerce', label: '🛍️ E-commerce', classes: 'from-orange-100 to-amber-100 border-orange-200' },
  { key: 'education', label: '🎓 Education', classes: 'from-violet-100 to-purple-100 border-violet-200' },
  { key: 'finance', label: '💰 Finance', classes: 'from-cyan-100 to-sky-100 border-cyan-200' },
  { key: 'default', label: '🤖 General', classes: 'from-indigo-100 to-blue-100 border-indigo-200' },
];

function App() {
  const params = new URLSearchParams(window.location.search);
  const industry = params.get('industry') || 'default';
  const position = params.get('position') || 'bottom-right';

  return (
    <div className="min-h-screen app-bg text-gray-800">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-300/30 blur-3xl" />
        <div className="absolute top-1/3 -right-28 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="rounded-3xl border border-white/50 bg-white/80 p-10 shadow-2xl backdrop-blur-md">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">Modern Conversational UI</p>
            <h1 className="mb-4 text-5xl font-bold text-gray-900 font-display leading-tight">
              AI Chatbot Widget Demo
            </h1>
            <p className="max-w-3xl text-lg text-gray-600">
              Beautiful, responsive chatbot experience with AI-first conversation flow and smooth escalation when a specialist is needed.
            </p>
          </div>

          <div className="rounded-3xl border border-white/50 bg-white/85 p-8 shadow-xl backdrop-blur-md">
            <h2 className="mb-5 text-2xl font-semibold text-gray-800">Try Different Industries</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {INDUSTRIES.map((ind) => (
                <a
                  key={ind.key}
                  href={`?industry=${ind.key}`}
                  className={`rounded-2xl border bg-gradient-to-br p-4 text-center font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg ${ind.classes}`}
                >
                  {ind.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChatbotWidget industry={industry} position={position} />
    </div>
  );
}

export default App;
