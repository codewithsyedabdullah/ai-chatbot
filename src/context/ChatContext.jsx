import React, { createContext, useContext, useState, useCallback } from 'react';
import { aiService } from '../services/ai';
import { supabaseService } from '../services/supabase';
import { getIndustryConfig } from '../config/industries';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children, industry = 'default' }) => {
  const config = getIndustryConfig(industry);
  
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: config.welcomeMessage,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [conversationSaved, setConversationSaved] = useState(false);
  const [awaitingLeadConfirmation, setAwaitingLeadConfirmation] = useState(false);

  const addMessage = useCallback((text, sender = 'user') => {
    const message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const handleQuickReply = useCallback(async (reply) => {
    // Add user message
    addMessage(reply, 'user');
    
    // Check if it's a request to talk to human
    if (reply.toLowerCase().includes('talk') || reply.toLowerCase().includes('admin') || reply.toLowerCase().includes('human')) {
      setAwaitingLeadConfirmation(false);
      setShowLeadForm(true);
      setTimeout(() => {
        addMessage(
          "I'd be happy to connect you with our team! Please share your contact information so we can reach out to you.",
          'bot'
        );
      }, 500);
      return;
    }
    
    // Process AI response
    await sendMessageToAI(reply);
  }, [addMessage]);

  const sendMessageToAI = useCallback(async (userMessage) => {
    setIsTyping(true);
    
    try {
      // Get AI response from API with fallback support
      const response = await aiService.sendMessage(
        userMessage,
        config.systemPrompt,
        messages
      );
      
      setTimeout(() => {
        addMessage(response.message, 'bot');
        setIsTyping(false);
        
        // Ask for escalation and wait for user confirmation before opening the form
        if (response.escalation) {
          setTimeout(() => {
            addMessage(response.escalation, 'bot');
            setAwaitingLeadConfirmation(true);
          }, 1000);
        } else {
          setAwaitingLeadConfirmation(false);
        }
      }, 1000 + Math.random() * 1000); // Random delay for natural feel
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setTimeout(() => {
        addMessage(
          "I'm having trouble processing that right now. Would you like to speak with a team member instead?",
          'bot'
        );
        setIsTyping(false);
        setAwaitingLeadConfirmation(false);
        setShowLeadForm(true);
      }, 1000);
    }
  }, [config, messages, addMessage]);

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const normalized = text.trim().toLowerCase();
    const asksForHuman = /talk to (a )?(person|human|agent|admin)|human|agent|representative|specialist|team member/.test(normalized);
    const confirmsEscalation = /^(yes|yeah|yep|sure|ok|okay|please|connect me)/.test(normalized);

    if (asksForHuman || (awaitingLeadConfirmation && confirmsEscalation)) {
      addMessage(text, 'user');
      addMessage("Perfect — please share your contact details and our team will reach out.", 'bot');
      setAwaitingLeadConfirmation(false);
      setShowLeadForm(true);
      return;
    }
    
    // Add user message
    addMessage(text, 'user');
    
    // Process AI response
    await sendMessageToAI(text);
  }, [addMessage, awaitingLeadConfirmation, sendMessageToAI]);

  const handleLeadSubmit = useCallback(async (leadData) => {
    try {
      const fullLeadData = {
        ...leadData,
        industry: config.industry,
        conversationHistory: messages,
        metadata: {
          sessionId,
          timestamp: new Date().toISOString(),
        },
      };
      
      // Save lead to Supabase/localStorage
      const result = await supabaseService.saveLead(fullLeadData);
      
      if (result.success) {
        setUserInfo(leadData);
        setShowLeadForm(false);
        
        // Save conversation
        if (!conversationSaved) {
          await supabaseService.saveConversation({
            sessionId,
            messages,
            industry: config.industry,
            metadata: { userInfo: leadData },
          });
          setConversationSaved(true);
        }
        
        addMessage(
          `Thank you, ${leadData.name}! We've received your information and someone from our team will reach out to you shortly at ${leadData.email}.`,
          'bot'
        );
        
        return { success: true };
      } else {
        throw new Error('Failed to save lead');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      addMessage(
        "I'm sorry, there was an error saving your information. Please try again or contact us directly.",
        'bot'
      );
      return { success: false, error };
    }
  }, [messages, sessionId, config, conversationSaved, addMessage]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        text: config.welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setUserInfo(null);
    setShowLeadForm(false);
    setAwaitingLeadConfirmation(false);
    setIsTyping(false);
  }, [config]);

  const value = {
    messages,
    isTyping,
    userInfo,
    showLeadForm,
    config,
    sessionId,
    handleSendMessage,
    handleQuickReply,
    handleLeadSubmit,
    setShowLeadForm,
    resetChat,
    addMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
