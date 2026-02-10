import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { ChatProvider } from '../context/ChatContext';

export const ChatbotWidget = ({ industry = 'default', position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };
    return positions[position] || positions['bottom-right'];
  };

  return (
    <ChatProvider industry={industry}>
      <div className={`fixed ${getPositionClasses()} z-[9999]`}>
        {/* Chat Window */}
        {(isOpen || isMinimized) && (
          <div
            className={`mb-4 transition-all duration-300 ${
              isMinimized 
                ? 'w-80 h-16' 
                : 'w-96 h-[600px]'
            }`}
            style={{
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {!isMinimized ? (
              <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
            ) : (
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-2xl shadow-2xl cursor-pointer hover:shadow-3xl transition-all"
                onClick={toggleChat}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Chat minimized</span>
                  </div>
                  <X className="w-5 h-5 hover:bg-primary-400 rounded-full p-0.5" onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Toggle Button */}
        {!isOpen && !isMinimized && (
          <button
            onClick={toggleChat}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 group animate-bounce-subtle"
            aria-label="Open chat"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
              1
            </div>
          </button>
        )}
      </div>
    </ChatProvider>
  );
};