import React from 'react';
import { useChatContext } from '../context/ChatContext';

export const QuickReplies = () => {
  const { config, handleQuickReply, messages } = useChatContext();
  
  // Only show quick replies at the start or when no user messages yet
  const userMessageCount = messages.filter(m => m.sender === 'user').length;
  
  if (userMessageCount > 2) return null;
  
  return (
    <div className="px-4 pb-3 animate-fade-in">
      <p className="text-xs text-gray-500 mb-2 font-medium">Quick options:</p>
      <div className="flex flex-wrap gap-2">
        {config.quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => handleQuickReply(reply)}
            className="quick-reply-btn"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};