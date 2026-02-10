import config from '../config/config';

class AIService {
  constructor() {
    this.apiUrl = config.backend.apiUrl;
    this.conversationHistory = [];
  }

  async sendMessage(message, systemPrompt, conversationHistory = []) {
    try {
      // For demo purposes, we'll use the Anthropic API through Claude.ai
      // In production, this should go through your backend
      const response = await this.callAnthropicAPI(message, systemPrompt, conversationHistory);
      return response;
    } catch (error) {
      console.error('Error in AI service:', error);
      return this.getFallbackResponse(message);
    }
  }

  async callAnthropicAPI(userMessage, systemPrompt, history) {
    try {
      // Build conversation context
      const messages = [
        ...history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Call Anthropic API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.openai.apiKey || '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', // Use your API key
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return {
        success: true,
        message: data.content[0].text,
        confidence: 0.9
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }

  getFallbackResponse(message) {
    const lowercaseMsg = message.toLowerCase();
    
    // Simple keyword matching for common queries
    if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
      return {
        success: true,
        message: "Hello! How can I assist you today?",
        confidence: 0.8
      };
    }
    
    if (lowercaseMsg.includes('price') || lowercaseMsg.includes('cost')) {
      return {
        success: true,
        message: "I'd be happy to help you with pricing information. Could you please specify which product or service you're interested in?",
        confidence: 0.7
      };
    }
    
    if (lowercaseMsg.includes('contact') || lowercaseMsg.includes('phone') || lowercaseMsg.includes('email')) {
      return {
        success: true,
        message: "I can help you get in touch with our team. Would you like to speak with a human representative?",
        confidence: 0.8
      };
    }
    
    if (lowercaseMsg.includes('thank')) {
      return {
        success: true,
        message: "You're welcome! Is there anything else I can help you with?",
        confidence: 0.9
      };
    }

    // Default fallback for unrecognized queries
    return {
      success: false,
      message: "I'm not sure about that, but I'd be happy to connect you with someone who can help. Would you like to speak with a team member?",
      confidence: 0.3,
      needsEscalation: true
    };
  }

  // Simulate AI confidence check
  shouldEscalate(response) {
    return response.confidence < 0.6 || response.needsEscalation;
  }

  // Pattern-based responses for demo without API
  async getSmartResponse(message, systemPrompt) {
    const responses = {
      greeting: [
        "Hello! How can I help you today?",
        "Hi there! What can I do for you?",
        "Welcome! How may I assist you?"
      ],
      help: [
        "I'm here to help! What would you like to know?",
        "I'd be happy to assist you. What do you need help with?",
        "Let me help you with that. What's your question?"
      ],
      thanks: [
        "You're welcome! Anything else I can help with?",
        "Happy to help! Let me know if you need anything else.",
        "My pleasure! Is there anything else you'd like to know?"
      ],
      unknown: [
        "I'm not entirely sure about that. Would you like me to connect you with a specialist?",
        "That's a great question! Let me get you in touch with someone who can provide the best answer.",
        "I want to make sure you get accurate information. Would you like to speak with a team member?"
      ]
    };

    const msg = message.toLowerCase();
    
    if (msg.match(/hello|hi|hey|good morning|good afternoon/)) {
      return {
        success: true,
        message: responses.greeting[Math.floor(Math.random() * responses.greeting.length)],
        confidence: 0.9
      };
    }
    
    if (msg.match(/thank|thanks|appreciate/)) {
      return {
        success: true,
        message: responses.thanks[Math.floor(Math.random() * responses.thanks.length)],
        confidence: 0.9
      };
    }
    
    if (msg.match(/help|assist|support/)) {
      return {
        success: true,
        message: responses.help[Math.floor(Math.random() * responses.help.length)],
        confidence: 0.8
      };
    }

    // For other queries, suggest escalation
    return {
      success: false,
      message: responses.unknown[Math.floor(Math.random() * responses.unknown.length)],
      confidence: 0.4,
      needsEscalation: true
    };
  }
}

export const aiService = new AIService();