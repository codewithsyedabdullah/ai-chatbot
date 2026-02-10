import config from '../config/config';

class AIService {
  constructor() {
    this.apiUrl = config.backend.apiUrl;
    this.conversationHistory = [];
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;  // OpenRouter / Groq API key
  }

  /**
   * Main function to send a message and get a response
   * Includes AI response + fallback + escalation handling
   */
  async sendMessage(message, systemPrompt = '', conversationHistory = []) {
    try {
      const response = await this.callOpenRouterAPI(message, systemPrompt, conversationHistory);

      // Decide if escalation is needed
      const escalate = this.shouldEscalate(response);

      if (escalate) {
        return {
          success: true,
          message: response.message,
          escalation: "Would you like to speak with a team member? I can have someone reach out to you.",
        };
      }

      return {
        success: true,
        message: response.message,
      };

    } catch (error) {
      console.error('AI API error:', error);

      // Fallback if API fails
      const fallback = this.getFallbackResponse(message);
      const escalate = this.shouldEscalate(fallback);

      if (escalate) {
        return {
          success: fallback.success,
          message: fallback.message,
          escalation: "Would you like to speak with a team member? I can have someone reach out to you.",
        };
      }

      return fallback;
    }
  }

  /**
   * Calls OpenRouter / Groq API
   */
  async callOpenRouterAPI(userMessage, systemPrompt = '', history = []) {
    // Build conversation context
    const messages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Replace with your Groq model if needed
        messages,
        max_tokens: 1024
      })
    });

    if (!response.ok) throw new Error('OpenRouter API request failed');

    const data = await response.json();

    // Extract AI message
    const messageText = data?.choices?.[0]?.message?.content || "I'm not sure about that.";

    return {
      success: true,
      message: messageText,
      confidence: 0.9
    };
  }

  /**
   * Keyword-based fallback responses
   */
  getFallbackResponse(message) {
    const lowercaseMsg = message.toLowerCase();

    if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
      return { success: true, message: "Hello! How can I assist you today?", confidence: 0.8 };
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
        confidence: 0.55,
        needsEscalation: true
      };
    }

    if (lowercaseMsg.includes('thank')) {
      return {
        success: true,
        message: "You're welcome! Is there anything else I can help you with?",
        confidence: 0.9
      };
    }

    // Default fallback
    return {
      success: true,
      message: "Great question. I can still help with general guidance—if you want exact details for your case, I can connect you with a specialist as a next step.",
      confidence: 0.65,
      needsEscalation: false
    };
  }

  /**
   * Decide whether to escalate to human
   */
  shouldEscalate(response) {
    return response.confidence < 0.6 || response.needsEscalation;
  }

  /**
   * Demo / pattern-based smart responses (optional)
   * Can be used if API key is missing
   */
  async getSmartResponse(message, systemPrompt = '') {
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
