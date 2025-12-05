# Render Deployment Guide for SnapCheck Backend

This guide will help you deploy your SnapCheck backend to Render.

## Prerequisites

- A Render account (sign up at [render.com](https://render.com))
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- Supabase credentials (URL and Key)

## Deployment Options

### Option 1: Docker Deployment (Recommended)

Render supports Docker deployments, which is ideal for your backend since it requires Tesseract OCR and other system dependencies.

#### Step 1: Create a Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `snapcheck-backend` (or your preferred name)
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `backend/Dockerfile` (or just `Dockerfile` if root is backend)

#### Step 2: Configure Environment Variables

In the Render dashboard, add these environment variables:

- **SUPABASE_URL**: `https://mokpviqoctidtpwdihax.supabase.co`
- **SUPABASE_KEY**: `sb_secret_KcrDXUkPQq8_CPNGcXqQug_-xfgVjol` (or your actual key)
- **PORT**: (Auto-set by Render, but you can verify)

#### Step 3: Deploy

Click "Create Web Service" and Render will:
1. Build the Docker image
2. Install all dependencies including Tesseract OCR
3. Deploy your Flask app

Your API will be available at `https://your-service-name.onrender.com`

### Option 2: Native Python Deployment

⚠️ **Note**: This requires installing Tesseract OCR via build scripts, which can be more complex.

#### Step 1: Create a Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name**: `snapcheck-backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     apt-get update && apt-get install -y tesseract-ocr libgl1-mesa-glx libglib2.0-0 && pip install -r requirements.txt
     ```
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Root Directory**: `backend`

#### Step 2: Add Environment Variables

Same as Option 1.

#### Step 3: Update requirements.txt

Add `gunicorn` to your requirements.txt:
```txt
gunicorn
```

## Post-Deployment Checklist

- [ ] Verify the health endpoint: `https://your-service.onrender.com/`
- [ ] Test the API endpoint: `https://your-service.onrender.com/api/health`
- [ ] Update frontend `VITE_API_URL` to point to your Render URL
- [ ] Test file upload functionality
- [ ] Verify CORS settings (already configured to allow all origins)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://mokpviqoctidtpwdihax.supabase.co` |
| `SUPABASE_KEY` | Your Supabase secret key | `sb_secret_...` |
| `PORT` | Server port (auto-set by Render) | `10000` |

## Important Notes

### Tesseract OCR
- The Dockerfile includes Tesseract OCR installation
- For native Python deployment, you'll need to install it via build scripts
- Docker is recommended for easier dependency management

### Cold Starts
- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for always-on services

### Timeouts
- Default timeout is 30 seconds
- For large image processing, you may need to increase timeout
- The Procfile includes `--timeout 120` for longer operations

### CORS
- Your backend is already configured with `CORS(app, resources={r"/api/*": {"origins": "*"}})`
- This allows requests from any origin, including your Vercel frontend

## Updating Frontend

After deploying to Render, update your frontend environment variable:

1. Go to Vercel dashboard
2. Navigate to your project settings
3. Go to Environment Variables
4. Update `VITE_API_URL` to: `https://your-service-name.onrender.com/api`

## Troubleshooting

### Build Fails
- Check that Dockerfile is in the correct location
- Verify all dependencies in requirements.txt
- Check Render build logs for specific errors

### API Calls Fail
- Verify environment variables are set correctly
- Check Render service logs
- Ensure service is running (not spun down)

### Tesseract Not Found
- For Docker: Verify Dockerfile includes Tesseract installation
- For native: Add Tesseract installation to build command

## Support

- Render Documentation: https://render.com/docs
- Render Status: https://status.render.com

