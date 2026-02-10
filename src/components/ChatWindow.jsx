import React, { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { QuickReplies } from './QuickReplies';
import { ChatInput } from './ChatInput';
import { LeadCaptureForm } from './LeadCaptureForm';
import { useChatContext } from '../context/ChatContext';

export const ChatWindow = ({ onClose, onMinimize }) => {
  const { messages, isTyping, showLeadForm } = useChatContext();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur-xl overflow-hidden">
      <ChatHeader onClose={onClose} onMinimize={onMinimize} />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 chat-messages bg-gradient-to-b from-slate-50/80 via-white to-indigo-50/40"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Replies */}
        <QuickReplies />
        
        {/* Chat Input */}
        <ChatInput />
        
        {/* Lead Capture Form Overlay */}
        {showLeadForm && <LeadCaptureForm />}
      </div>
    </div>
  );
};