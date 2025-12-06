# Vercel Deployment Guide for SnapCheck

This guide will help you deploy your SnapCheck frontend to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Your backend API deployed and accessible (currently on Railway)

## Deployment Options

### Option 1: Deploy Frontend Only (Recommended)

Since your backend is already on Railway, you can deploy just the frontend to Vercel.

#### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

#### Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variable:

- **Name**: `VITE_API_URL`
- **Value**: `https://snapcheck-production.up.railway.app/api` (or your backend URL)

#### Step 3: Deploy

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build your project
3. Deploy to a production URL

Your app will be available at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Set environment variable:
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://snapcheck-production.up.railway.app/api
   ```

6. Redeploy with environment variable:
   ```bash
   vercel --prod
   ```

## Backend Deployment Options

### Keep Backend on Railway (Current Setup)

Your backend is already configured for Railway. This is recommended because:
- Railway supports Docker containers with heavy dependencies (OpenCV, Tesseract)
- Better suited for long-running processes
- More predictable for image processing workloads

### Alternative: Deploy Backend to Vercel (Advanced)

⚠️ **Note**: Vercel serverless functions have limitations:
- 10-second timeout on Hobby plan (50s on Pro)
- 50MB function size limit
- May struggle with OpenCV and Tesseract dependencies

If you still want to try Vercel serverless:

1. Create `api/` directory in the root
2. Convert Flask routes to serverless functions
3. Use Vercel's Python runtime
4. Consider using external services for heavy processing

## Post-Deployment Checklist

- [ ] Verify frontend loads correctly
- [ ] Test API connection from frontend
- [ ] Check CORS settings on backend (should allow your Vercel domain)
- [ ] Test file upload functionality
- [ ] Verify environment variables are set correctly

## Updating Backend CORS

If you deploy to a new Vercel URL, update your backend CORS settings in `backend/app.py`:

```python
CORS(app, resources={r"/api/*": {
    "origins": [
        "http://localhost:5173",
        "https://your-project.vercel.app",
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ]
}})
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://snapcheck-production.up.railway.app/api` |

## Troubleshooting

### Build Fails
- Check that `package.json` has correct build script
- Verify all dependencies are listed in `package.json`
- Check Vercel build logs for specific errors

### API Calls Fail
- Verify `VITE_API_URL` is set correctly in Vercel dashboard
- Check backend CORS settings allow your Vercel domain
- Verify backend is running and accessible

### Routing Issues
- The `vercel.json` includes SPA routing configuration
- All routes should redirect to `index.html` for client-side routing

## Continuous Deployment

Once connected to Git, Vercel will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Run builds automatically

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord

