import { createClient } from '@supabase/supabase-js';
import config from '../config/config';

class SupabaseService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    
    try {
      if (config.supabase.url && config.supabase.anonKey) {
        this.client = createClient(config.supabase.url, config.supabase.anonKey);
        this.initialized = true;
        console.log('Supabase initialized successfully');
      } else {
        console.warn('Supabase credentials not configured. Using mock storage.');
      }
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
    }
  }

  async saveLead(leadData) {
    this.initialize();

    const lead = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || null,
      query: leadData.query || '',
      industry: leadData.industry || 'general',
      conversation_history: JSON.stringify(leadData.conversationHistory || []),
      metadata: JSON.stringify(leadData.metadata || {}),
      created_at: new Date().toISOString(),
    };

    // If Supabase is configured, save to database
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('leads')
          .insert([lead])
          .select();

        if (error) throw error;
        
        console.log('Lead saved to Supabase:', data);
        return { success: true, data };
      } catch (error) {
        console.error('Error saving lead to Supabase:', error);
        // Fallback to localStorage
        return this.saveToLocalStorage(lead);
      }
    } else {
      // Fallback to localStorage if Supabase not configured
      return this.saveToLocalStorage(lead);
    }
  }

  saveToLocalStorage(lead) {
    try {
      const leads = JSON.parse(localStorage.getItem('chatbot_leads') || '[]');
      lead.id = Date.now().toString();
      leads.push(lead);
      localStorage.setItem('chatbot_leads', JSON.stringify(leads));
      console.log('Lead saved to localStorage:', lead);
      return { success: true, data: lead, storage: 'localStorage' };
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return { success: false, error: error.message };
    }
  }

  async saveConversation(conversationData) {
    this.initialize();

    const conversation = {
      session_id: conversationData.sessionId,
      messages: JSON.stringify(conversationData.messages),
      industry: conversationData.industry || 'general',
      metadata: JSON.stringify(conversationData.metadata || {}),
      created_at: new Date().toISOString(),
    };

    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('conversations')
          .insert([conversation])
          .select();

        if (error) throw error;
        
        return { success: true, data };
      } catch (error) {
        console.error('Error saving conversation:', error);
        return { success: false, error: error.message };
      }
    }

    // Fallback to localStorage
    try {
      const conversations = JSON.parse(localStorage.getItem('chatbot_conversations') || '[]');
      conversation.id = Date.now().toString();
      conversations.push(conversation);
      localStorage.setItem('chatbot_conversations', JSON.stringify(conversations));
      return { success: true, data: conversation, storage: 'localStorage' };
    } catch (error) {
      console.error('Error saving conversation to localStorage:', error);
      return { success: false, error: error.message };
    }
  }

  async getLeads() {
    this.initialize();

    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
      } catch (error) {
        console.error('Error fetching leads:', error);
        return this.getLeadsFromLocalStorage();
      }
    }

    return this.getLeadsFromLocalStorage();
  }

  getLeadsFromLocalStorage() {
    try {
      const leads = JSON.parse(localStorage.getItem('chatbot_leads') || '[]');
      return { success: true, data: leads, storage: 'localStorage' };
    } catch (error) {
      console.error('Error fetching leads from localStorage:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
}

export const supabaseService = new SupabaseService();