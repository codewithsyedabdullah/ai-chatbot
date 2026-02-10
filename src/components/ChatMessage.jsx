import React from 'react';
import { User, Bot } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-2 mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-slide-up`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`chat-message ${isBot ? 'chat-message-bot' : 'chat-message-user'} shadow-sm`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        <span className={`text-xs mt-1 block ${isBot ? 'text-gray-500' : 'text-primary-100'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};