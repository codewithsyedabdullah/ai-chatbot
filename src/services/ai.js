import config from '../config/config';

class AIService {
  constructor() {
    this.apiUrl = config.backend.apiUrl;
    this.conversationHistory = [];
    this.groqKey = this.resolveApiKey('VITE_GROQ_API_KEY');
    this.groqModel = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant';
  }

  resolveApiKey(envKey) {
    const rawKey = import.meta.env[envKey];

    if (typeof rawKey !== 'string') {
      return '';
    }

    // Normalize accidental wrapping quotes/spaces from env files
    const normalizedKey = rawKey.trim().replace(/^['"]|['"]$/g, '');

    // Guard against placeholder/comment-like values such as "// your key here"
    if (!normalizedKey || normalizedKey.startsWith('//')) {
      return '';
    }

    return normalizedKey;
  }

  hasGroqKey() {
    return typeof this.groqKey === 'string' && this.groqKey.startsWith('gsk_');
  }

  /**
   * Main function to send a message and get a response
   * Includes AI response + fallback + escalation handling
   */
  async sendMessage(message, systemPrompt = '', conversationHistory = []) {
    try {
      // Groq-only provider mode
      if (!this.hasGroqKey()) {
        console.warn('Groq API key missing/invalid. Set VITE_GROQ_API_KEY and restart the app. Falling back to local smart responses.');
        return this.getSmartResponse(message, systemPrompt);
      }

      const response = await this.callGroqAPI(message, systemPrompt, conversationHistory);

      // Decide if escalation is needed
      const escalate = this.shouldEscalate(response);

      if (escalate) {
        return {
          success: true,
          message: response.message,
          escalation: 'Would you like to speak with a team member? I can have someone reach out to you.',
        };
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('AI API error:', error);

      const errorMessage = error?.message || '';

      // If auth fails, keep chat useful with local AI-style responses
      if (errorMessage.includes('401')) {
        console.warn('Groq returned 401. Check VITE_GROQ_API_KEY and account status. Falling back to local responses.');
      }

      // If API fails, try smart local response first
      const smart = await this.getSmartResponse(message, systemPrompt);
      if (smart.success && smart.confidence >= 0.6) {
        return smart;
      }

      // Then fallback keyword response
      const fallback = this.getFallbackResponse(message);
      const escalate = this.shouldEscalate(fallback);

      if (escalate) {
        return {
          success: true,
          message: fallback.message,
          escalation: 'Would you like to speak with a team member? I can have someone reach out to you.',
        };
      }

      return fallback;
    }
  }

  buildMessages(userMessage, systemPrompt = '', history = []) {
    return [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...history.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: userMessage },
    ];
  }

  async parseProviderResponse(response, providerLabel) {
    const rawBody = await response.text();
    let data = null;

    try {
      data = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      const apiMessage = data?.error?.message || rawBody || `${response.status} ${response.statusText}`;
      throw new Error(`${providerLabel} API request failed (${response.status}): ${apiMessage}`);
    }

    const messageText = data?.choices?.[0]?.message?.content || "I'm not sure about that.";

    return {
      success: true,
      message: messageText,
      confidence: 0.9,
    };
  }

  async callGroqAPI(userMessage, systemPrompt = '', history = []) {
    const messages = this.buildMessages(userMessage, systemPrompt, history);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.groqKey}`,
      },
      body: JSON.stringify({
        model: this.groqModel,
        messages,
        max_tokens: 1024,
      }),
    });

    return this.parseProviderResponse(response, 'Groq');
  }

  /**
   * Keyword-based fallback responses
   */
  getFallbackResponse(message) {
    const lowercaseMsg = message.toLowerCase();

    if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
      return { success: true, message: 'Hello! How can I assist you today?', confidence: 0.8 };
    }

    if (lowercaseMsg.includes('price') || lowercaseMsg.includes('cost')) {
      return {
        success: true,
        message: "I'd be happy to help you with pricing information. Could you please specify which product or service you're interested in?",
        confidence: 0.7,
      };
    }

    if (lowercaseMsg.includes('contact') || lowercaseMsg.includes('phone') || lowercaseMsg.includes('email')) {
      return {
        success: true,
        message: 'I can help you get in touch with our team. Would you like to speak with a human representative?',
        confidence: 0.55,
        needsEscalation: true,
      };
    }

    if (lowercaseMsg.includes('thank')) {
      return {
        success: true,
        message: "You're welcome! Is there anything else I can help you with?",
        confidence: 0.9,
      };
    }

    // Default fallback
    return {
      success: true,
      message:
        'Great question. I can still help with general guidance—if you want exact details for your case, I can connect you with a specialist as a next step.',
      confidence: 0.65,
      needsEscalation: false,
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
      greeting: ['Hello! How can I help you today?', 'Hi there! What can I do for you?', 'Welcome! How may I assist you?'],
      help: [
        "I'm here to help! What would you like to know?",
        "I'd be happy to assist you. What do you need help with?",
        "Let me help you with that. What's your question?",
      ],
      thanks: [
        "You're welcome! Anything else I can help with?",
        'Happy to help! Let me know if you need anything else.',
        "My pleasure! Is there anything else you'd like to know?",
      ],
      unknown: [
        'That’s a good question about "{topic}" — here’s what I can share based on what I know so far.',
        'I can help with "{topic}". Could you share a bit more detail so I can give a better answer?',
        'I can provide general guidance on "{topic}", and if needed I can also connect you with a specialist.',
      ],
    };

    const msg = message.toLowerCase();

    if (msg.match(/hello|hi|hey|good morning|good afternoon/)) {
      return {
        success: true,
        message: responses.greeting[Math.floor(Math.random() * responses.greeting.length)],
        confidence: 0.9,
      };
    }

    if (msg.match(/thank|thanks|appreciate/)) {
      return {
        success: true,
        message: responses.thanks[Math.floor(Math.random() * responses.thanks.length)],
        confidence: 0.9,
      };
    }

    if (msg.match(/help|assist|support/)) {
      return {
        success: true,
        message: responses.help[Math.floor(Math.random() * responses.help.length)],
        confidence: 0.8,
      };
    }

    // For unknown queries, return a useful answer first and avoid immediate escalation
    const topic = message.trim() || 'that';
    const template = responses.unknown[Math.floor(Math.random() * responses.unknown.length)];

    return {
      success: true,
      message: template.replace('{topic}', topic),
      confidence: 0.7,
      needsEscalation: false,
    };
  }
}

export const aiService = new AIService();
