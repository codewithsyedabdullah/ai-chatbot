import React from 'react';
import { X, Minimize2, RotateCcw } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

export const ChatHeader = ({ onClose, onMinimize }) => {
  const { config, resetChat } = useChatContext();
  
  return (
    <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
          {config.icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{config.name}</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-primary-100">Online</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={resetChat}
          className="p-2 hover:bg-primary-400 rounded-full transition-colors"
          title="Reset chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onMinimize}
          className="p-2 hover:bg-primary-400 rounded-full transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-primary-400 rounded-full transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};