# Deployment Guide

Comprehensive guide to deploying your AI Chatbot Widget to various platforms.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Supabase tables created and configured
- [ ] Build completes without errors (`npm run build`)
- [ ] README updated with your info
- [ ] Sensitive data removed from code
- [ ] .env file NOT committed to Git

---

## 🚀 Deployment Platforms

### 1. Netlify (Easiest - Recommended)

**Pros:** Free tier, automatic deployments, easy setup, CDN included
**Time:** 5-10 minutes

#### Method A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build your project
npm run build

# Deploy
netlify deploy

# Follow prompts, then deploy to production
netlify deploy --prod --dir=dist
```

#### Method B: GitHub Integration

1. Push code to GitHub
2. Go to https://netlify.com
3. Click "Add new site" > "Import from Git"
4. Select your repository
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy"

#### Environment Variables

1. Go to Site Settings > Environment variables
2. Add variables:
   ```
   VITE_SUPABASE_URL = your-supabase-url
   VITE_SUPABASE_ANON_KEY = your-anon-key
   ```
3. Redeploy

#### Get Your Widget URL

After deployment:
```
Your widget: https://your-site.netlify.app/chatbot-widget.iife.js
Embed code:
<script src="https://your-site.netlify.app/chatbot-widget.iife.js" 
        data-industry="realEstate">
</script>
```

---

### 2. Vercel

**Pros:** Free tier, automatic deployments, great performance
**Time:** 5-10 minutes

#### Method A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Deploy to production
vercel --prod
```

#### Method B: GitHub Integration

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Add New" > "Project"
4. Import your repository
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"

#### Environment Variables

1. Go to Project Settings > Environment Variables
2. Add all environments (Production, Preview, Development)
3. Add variables:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```
4. Redeploy

---

### 3. GitHub Pages

**Pros:** Free, integrated with GitHub
**Cons:** Public repos only for free tier
**Time:** 10 minutes

#### Setup

1. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/', // Add this line
     plugins: [react()],
     // ... rest of config
   })
   ```

2. **Build and deploy:**
   ```bash
   # Build
   npm run build

   # Add dist to git (usually ignored)
   git add dist -f

   # Commit
   git commit -m "Deploy to GitHub Pages"

   # Push to gh-pages branch
   git subtree push --prefix dist origin gh-pages
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings
   - Pages section
   - Source: gh-pages branch
   - Save

4. **Access at:**
   ```
   https://your-username.github.io/your-repo-name/
   ```

#### Automated Deployment with Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Add secrets in repository Settings > Secrets and variables > Actions.

---

### 4. Firebase Hosting

**Pros:** Google infrastructure, good performance, free tier
**Time:** 10-15 minutes

#### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init

# Select:
# - Hosting
# - Public directory: dist
# - Single-page app: Yes
# - GitHub auto-deploy: Optional

# Build your project
npm run build

# Deploy
firebase deploy --only hosting
```

#### Custom Domain

```bash
firebase hosting:channel:deploy production
```

---

### 5. AWS S3 + CloudFront

**Pros:** Scalable, professional, full AWS ecosystem
**Cons:** More complex setup, costs after free tier
**Time:** 20-30 minutes

#### Prerequisites

- AWS account
- AWS CLI installed

#### Setup

1. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://your-chatbot-bucket
   ```

2. **Enable static website hosting:**
   ```bash
   aws s3 website s3://your-chatbot-bucket \
     --index-document index.html \
     --error-document index.html
   ```

3. **Set bucket policy:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::your-chatbot-bucket/*"
     }]
   }
   ```

4. **Build and upload:**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-chatbot-bucket
   ```

5. **Create CloudFront distribution** (optional but recommended):
   - Go to CloudFront console
   - Create distribution
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Deploy

---

### 6. Custom Server (VPS/Dedicated)

**Pros:** Full control
**Cons:** Requires server management
**Time:** 30+ minutes

#### Using Nginx

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to server:**
   ```bash
   scp -r dist/* user@your-server:/var/www/chatbot/
   ```

3. **Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name chatbot.yourdomain.com;
       root /var/www/chatbot;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Enable SSL with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d chatbot.yourdomain.com
   ```

5. **Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

---

## 🔧 Post-Deployment Configuration

### CORS Setup

If your chatbot is on a different domain than websites using it, configure CORS in Supabase:

1. Go to Project Settings > API
2. Under CORS, add allowed origins:
   ```
   https://your-website.com
   https://www.your-website.com
   *  (for development only)
   ```

### CDN Configuration

For better performance, use a CDN:

**Cloudflare (Free):**
1. Sign up at https://cloudflare.com
2. Add your domain
3. Update nameservers
4. Enable "Auto Minify" for JS/CSS
5. Enable "Brotli" compression
6. Set caching rules

---

## 📊 Monitoring Setup

### Netlify Analytics

1. Go to Site Settings > Analytics
2. Enable Netlify Analytics ($9/month)
3. View traffic, performance, and errors

### Google Analytics

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry Error Tracking

```bash
npm install @sentry/react
```

Add to `src/main.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

---

## 🔄 Continuous Deployment

### Netlify Auto-Deploy

Already configured when using GitHub integration!

Every push to `main` branch automatically deploys.

### Vercel Auto-Deploy

Automatically deploys on every push when using GitHub integration.

### GitHub Actions

Create `.github/workflows/deploy.yml` for custom CD pipeline.

---

## ✅ Deployment Verification

After deployment, verify:

### 1. Widget Loads
```javascript
// Open browser console on any page
fetch('https://your-domain.com/chatbot-widget.iife.js')
  .then(r => console.log('Widget accessible:', r.ok))
```

### 2. CORS Works
Embed on a test page and check for CORS errors.

### 3. Data Saves
Submit a test lead and verify in Supabase.

### 4. Performance
Use Google PageSpeed Insights:
```
https://pagespeed.web.dev/analysis?url=https://your-domain.com
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## 🐛 Common Deployment Issues

### Issue: White screen after deployment

**Solution:**
1. Check browser console for errors
2. Verify all environment variables are set
3. Check `base` in vite.config.js matches your URL structure
4. Clear browser cache

### Issue: 404 on refresh

**Solution:**
Configure server for SPA:
- **Netlify:** Create `_redirects` file:
  ```
  /* /index.html 200
  ```
- **Vercel:** Automatic
- **Nginx:** Use `try_files` directive (see above)

### Issue: Environment variables not working

**Solution:**
1. Ensure they start with `VITE_`
2. Restart dev server after adding
3. Rebuild after changes
4. Check they're set in deployment platform

### Issue: CORS errors

**Solution:**
1. Add domain to Supabase CORS settings
2. Check API requests use correct URLs
3. Ensure HTTPS is used (not mixed content)

---

## 📈 Scaling Considerations

### High Traffic

If you expect high traffic:

1. **Use CDN** (Cloudflare, AWS CloudFront)
2. **Enable caching:**
   ```nginx
   add_header Cache-Control "public, max-age=31536000, immutable";
   ```
3. **Optimize bundle size:**
   ```bash
   npm run build -- --mode production
   ```
4. **Lazy load components:**
   ```javascript
   const LeadForm = lazy(() => import('./LeadCaptureForm'));
   ```

### Database Scaling

For high volume of leads:

1. **Supabase Pro** ($25/month)
   - More connections
   - Better performance
   - Larger database

2. **Add indexes:**
   ```sql
   CREATE INDEX idx_leads_created_at ON leads(created_at);
   CREATE INDEX idx_leads_industry ON leads(industry);
   ```

3. **Archive old data:**
   ```sql
   -- Move leads older than 90 days to archive table
   INSERT INTO leads_archive SELECT * FROM leads WHERE created_at < NOW() - INTERVAL '90 days';
   DELETE FROM leads WHERE created_at < NOW() - INTERVAL '90 days';
   ```

---

## 🔐 Security Checklist

Before going live:

- [ ] All API keys in environment variables
- [ ] No sensitive data in code
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled (Supabase has built-in)
- [ ] Input validation working
- [ ] SQL injection protection (Supabase handles this)
- [ ] XSS protection (React handles this)

---

## 📞 Support

If you encounter issues:

1. Check deployment platform docs
2. Review error logs
3. Test locally first
4. Create GitHub issue

---

**Ready to deploy! 🚀**