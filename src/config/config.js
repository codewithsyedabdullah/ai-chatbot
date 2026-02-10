// Configuration for API keys and services
// In production, these should come from environment variables

export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  
  // OpenAI Configuration (for backend)
  // Note: This should be called from a backend endpoint, not directly from frontend
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
  },
  
  // Alternative: Use a backend endpoint
  backend: {
    apiUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  },
  
  // Widget Configuration
  widget: {
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    offsetX: 20,
    offsetY: 20,
    theme: 'light', // light, dark
  },
};

export default config;