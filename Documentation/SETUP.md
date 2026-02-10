# Setup Guide - AI Chatbot Widget

Complete step-by-step guide to get your chatbot up and running.

## 🚀 Quick Start (5 minutes)

### Option 1: Run Without Any Configuration

```bash
# Clone and install
git clone <your-repo-url>
cd ai-chatbot-widget
npm install

# Run immediately (uses localStorage fallback)
npm run dev
```

Visit http://localhost:5173 - The chatbot works immediately with localStorage!

### Option 2: Full Setup with Supabase (15 minutes)

Follow the detailed steps below for production-ready setup.

---

## 📋 Detailed Setup Steps

### Step 1: System Requirements

Ensure you have:
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**
- A code editor (VS Code recommended)

Check versions:
```bash
node --version  # Should be 18+
npm --version
```

### Step 2: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-chatbot-widget

# Install dependencies
npm install

# This installs:
# - React & React DOM
# - Vite (build tool)
# - Tailwind CSS (styling)
# - Supabase client
# - Lucide React (icons)
# - Framer Motion (animations)
```

### Step 3: Create Supabase Project (Optional)

1. **Create Account**
   - Go to https://supabase.com
   - Sign up for free account
   - Create new project

2. **Get API Credentials**
   - Go to Project Settings > API
   - Copy your **Project URL**
   - Copy your **anon/public key**

3. **Create Database Tables**

   Go to SQL Editor and run this:

   ```sql
   -- Leads table
   create table leads (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     email text not null,
     phone text,
     query text,
     industry text,
     conversation_history jsonb,
     metadata jsonb,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Conversations table
   create table conversations (
     id uuid default uuid_generate_v4() primary key,
     session_id text not null,
     messages jsonb not null,
     industry text,
     metadata jsonb,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Enable Row Level Security (RLS)
   alter table leads enable row level security;
   alter table conversations enable row level security;

   -- Create policies for inserting (anyone can insert)
   create policy "Enable insert for all users" on leads
     for insert with check (true);

   create policy "Enable insert for all users" on conversations
     for insert with check (true);

   -- Create policies for reading (authenticated users only, or make it public)
   create policy "Enable read for all users" on leads
     for select using (true);

   create policy "Enable read for all users" on conversations
     for select using (true);
   ```

4. **Verify Tables Created**
   - Go to Table Editor
   - You should see `leads` and `conversations` tables

### Step 4: Configure Environment Variables

1. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here

   # Optional: OpenAI for AI responses
   VITE_OPENAI_API_KEY=sk-your-api-key

   # Optional: Backend URL if using proxy
   VITE_BACKEND_URL=http://localhost:3000/api
   ```

   **Important Notes:**
   - Replace placeholder values with your actual credentials
   - Never commit `.env` to Git (it's in .gitignore)
   - If you skip this, the app uses localStorage fallback

### Step 5: Run Development Server

```bash
npm run dev
```

Expected output:
```
VITE v5.0.8  ready in 300 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open http://localhost:5173 in your browser!

### Step 6: Test the Chatbot

1. **Open the demo page**
   - You should see the chatbot button in bottom-right

2. **Click the chat button**
   - Chat window should open

3. **Test quick replies**
   - Click any quick reply button
   - You should get a response

4. **Test lead capture**
   - Click "Talk to Admin"
   - Fill in the contact form
   - Submit

5. **Verify data saved**
   
   **If using Supabase:**
   - Go to Table Editor in Supabase
   - Check the `leads` table
   - Your submitted data should appear

   **If using localStorage:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Type: `JSON.parse(localStorage.getItem('chatbot_leads'))`
   - Your data should appear

### Step 7: Test Different Industries

Try different industries by adding URL parameter:

```
http://localhost:5173?industry=realEstate
http://localhost:5173?industry=healthcare
http://localhost:5173?industry=ecommerce
http://localhost:5173?industry=education
http://localhost:5173?industry=finance
```

Each should have different:
- Welcome message
- Quick reply buttons
- Icon
- System prompt behavior

---

## 🏗️ Building for Production

### Build the Project

```bash
npm run build
```

This creates a `dist/` folder with:
- `chatbot-widget.iife.js` - Your embeddable widget
- `chatbot-widget.css` - Widget styles
- Other optimized assets

### Test the Build

```bash
npm run preview
```

Visit http://localhost:4173 to test the production build.

---

## 📦 Deployment Options

### Option 1: Deploy to Netlify (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

4. **Set Environment Variables**
   - Go to Netlify dashboard
   - Site Settings > Environment Variables
   - Add your Supabase credentials

5. **Get Your URL**
   - Netlify will give you a URL like: `https://your-app.netlify.app`
   - Your widget is at: `https://your-app.netlify.app/chatbot-widget.iife.js`

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Add Environment Variables**
   - Go to Vercel dashboard
   - Settings > Environment Variables
   - Add your credentials

### Option 3: Deploy to GitHub Pages

1. **Update `vite.config.js`**
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

2. **Build and deploy**
   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

### Option 4: Custom Server

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload `dist/` contents to your server**

3. **Serve with nginx/Apache**
   
   Example nginx config:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     root /var/www/chatbot/dist;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

---

## 🔗 Embedding After Deployment

Once deployed, embed on any website:

```html
<!-- Replace with your actual deployed URL -->
<script src="https://your-domain.com/chatbot-widget.iife.js" 
        data-industry="realEstate" 
        data-position="bottom-right">
</script>
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: `Cannot find module`**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: `Vite not found`**
```bash
npm install -D vite
```

### Runtime Errors

**Chatbot not appearing:**
1. Check browser console for errors (F12)
2. Verify script URL is correct
3. Check CORS settings if on different domain

**Supabase errors:**
1. Verify API keys are correct
2. Check table names match exactly
3. Verify RLS policies allow inserts
4. Check Supabase project is not paused

**Data not saving:**
1. Check browser console for errors
2. Verify Supabase tables exist
3. Data should fallback to localStorage automatically

### Testing Connection

Test Supabase connection:
```javascript
// In browser console on your app
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Test insert
const { data, error } = await supabase
  .from('leads')
  .insert([{ name: 'Test', email: 'test@example.com' }])
  .select()

console.log('Success:', data)
console.log('Error:', error)
```

---

## 📊 Viewing Captured Data

### Supabase Dashboard

1. Go to your Supabase project
2. Click "Table Editor"
3. Select `leads` or `conversations` table
4. View all captured data

### Export Data

```sql
-- Export all leads as CSV
copy (select * from leads) to stdout with csv header;

-- Export today's leads
copy (
  select * from leads 
  where created_at::date = current_date
) to stdout with csv header;
```

### LocalStorage

```javascript
// View all leads
const leads = JSON.parse(localStorage.getItem('chatbot_leads') || '[]')
console.table(leads)

// View all conversations
const convos = JSON.parse(localStorage.getItem('chatbot_conversations') || '[]')
console.table(convos)

// Clear all data
localStorage.removeItem('chatbot_leads')
localStorage.removeItem('chatbot_conversations')
```

---

## 🔒 Security Best Practices

1. **Never expose API keys in frontend**
   - Use environment variables
   - Use backend proxy for AI APIs
   - Supabase anon key is safe (it's public)

2. **Set up Row Level Security in Supabase**
   - Already included in setup SQL
   - Restricts who can read/write data

3. **Validate user input**
   - Already implemented in LeadCaptureForm
   - Email validation with regex
   - Required field checks

4. **Rate limiting**
   - Consider adding rate limits for API calls
   - Prevent spam submissions

---

## 🎯 Next Steps

After setup, you can:

1. **Customize for your brand**
   - Edit colors in `tailwind.config.js`
   - Modify industry configs
   - Add your logo

2. **Integrate real AI**
   - Set up OpenAI/Anthropic API
   - Create backend proxy
   - Implement streaming responses

3. **Add analytics**
   - Track conversation metrics
   - Monitor lead conversion
   - Analyze common queries

4. **Enhance features**
   - Add file upload support
   - Implement voice messages
   - Add typing indicators for users
   - Multi-language support

---

## 📞 Need Help?

- **GitHub Issues**: [Create an issue]
- **Documentation**: See README.md
- **Email**: your-email@example.com

---

**Setup complete! 🎉 Your chatbot is ready to use.**