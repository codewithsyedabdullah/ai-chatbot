# 🚀 QUICK START GUIDE

## Get Running in 5 Minutes!

### Step 1: Install Dependencies
```bash
cd ai-chatbot-widget
npm install
```

### Step 2: Run the Project
```bash
npm run dev
```

### Step 3: Open in Browser
Go to: **http://localhost:5173**

**That's it!** 🎉 The chatbot is working with localStorage (no setup required).

---

## 📝 What You Need to Submit

### 1. GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: AI Chatbot Widget"

# Create repo on GitHub, then:
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Live Demo (Choose One)

**Option A: Netlify (Easiest - 5 min)**
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```
Get URL like: `https://your-app.netlify.app`

**Option B: Vercel (Also Easy - 5 min)**
```bash
npm i -g vercel
vercel --prod
```
Get URL like: `https://your-app.vercel.app`

### 3. Embed Widget URL
After deployment, your widget URL will be:
```
https://your-app.netlify.app/chatbot-widget.iife.js
```

---

## 🎯 Testing Before Submission

### Test Checklist:
- [ ] Chatbot opens and closes
- [ ] Quick replies work
- [ ] Can type and send messages
- [ ] AI responds (even with fallback)
- [ ] "Talk to Admin" triggers lead form
- [ ] Lead form validates input
- [ ] Lead form submits successfully
- [ ] Data appears in localStorage/Supabase
- [ ] Different industries work (`?industry=healthcare`)
- [ ] Responsive on mobile

### View Captured Leads:
```javascript
// Open browser console (F12) and type:
JSON.parse(localStorage.getItem('chatbot_leads'))
```

---

## 📋 Submission Format

Send these 3 items:

1. **Live Demo URL**
   ```
   https://your-app.netlify.app
   or
   https://your-app.vercel.app
   ```

2. **GitHub Repository**
   ```
   https://github.com/yourusername/ai-chatbot-widget
   ```

3. **README** (already included in project)
   - Setup instructions ✓
   - Configuration details ✓
   - Usage notes ✓

---

## 🎨 Features Implemented

✅ **Frontend (React.js)**
- Responsive chat widget
- Embeddable via script tag
- Welcome message
- Industry-specific quick replies
- Multi-concurrent user support

✅ **Backend/AI Integration**
- AI response processing
- Fallback for unrecognized queries
- No custom backend (uses Supabase/localStorage)

✅ **Lead Capture**
- Name, Email, Phone, Query fields
- Form validation
- Storage in Supabase/localStorage

✅ **Human Escalation**
- AI confidence detection
- "Talk to Admin" option
- Forward user info

✅ **Bonus Features**
- Industry-specific customization (JSON config)
- State management (Context API)
- Clean, responsive UI/UX
- Complete documentation

---

## 🔧 Optional: Add Supabase (Better for Demo)

### Quick Supabase Setup (10 min):

1. **Create account**: https://supabase.com

2. **Create project** and get credentials

3. **Run this SQL**:
```sql
create table leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  query text,
  industry text,
  conversation_history jsonb,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

alter table leads enable row level security;
create policy "Enable insert for all" on leads for insert with check (true);
create policy "Enable read for all" on leads for select using (true);
```

4. **Create `.env` file**:
```env
VITE_SUPABASE_URL=your-url-here
VITE_SUPABASE_ANON_KEY=your-key-here
```

5. **Restart dev server**:
```bash
npm run dev
```

Now leads save to Supabase database!

---

## 📞 Need Help?

Everything is documented in:
- `README.md` - Complete documentation
- `SETUP.md` - Detailed setup guide
- `DEPLOYMENT.md` - Deployment guide

---

## 🎉 You're Ready!

Your chatbot is production-ready and fully functional. Good luck with your submission!

**Time to completion:**
- Basic setup: 5 minutes
- With Supabase: 15 minutes
- Deployed: 20 minutes total

**P.S.** The chatbot works perfectly with just localStorage - Supabase is optional but recommended for a professional demo!