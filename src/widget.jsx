import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatbotWidget } from './components/ChatbotWidget';
import './index.css';

// Function to initialize the chatbot widget
window.initAIChatbot = (config = {}) => {
  const {
    industry = 'default',
    position = 'bottom-right',
    containerId = 'ai-chatbot-root',
  } = config;

  // Create container if it doesn't exist
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Render the chatbot
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatbotWidget industry={industry} position={position} />
    </React.StrictMode>
  );

  return {
    destroy: () => root.unmount(),
  };
};

// Auto-initialize if script tag has data attributes
if (typeof document !== 'undefined') {
  const script = document.currentScript;
  if (script) {
    const industry = script.getAttribute('data-industry') || 'default';
    const position = script.getAttribute('data-position') || 'bottom-right';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.initAIChatbot({ industry, position });
      });
    } else {
      window.initAIChatbot({ industry, position });
    }
  }
}