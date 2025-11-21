# Deploying Leaf Disease Detection to Render

## Prerequisites
- Render account (https://render.com)
- GitHub account with your repository pushed
- Trained model file (`leaf_disease_model.h5`)
- Classes file (`classes.json`)

## Step 1: Prepare Files

✅ Already done:
- `Procfile` - tells Render how to run the app
- `requirements.txt` - Python dependencies
- `app.py` - Flask API with environment variable support

## Step 2: Push to GitHub

```bash
cd d:\leafdetection
git init
git add .
git commit -m "Initial commit - leaf disease detection API"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/leafdetection.git
git push -u origin main
```

## Step 3: Deploy on Render

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"** and choose your GitHub repo
4. Fill in the form:
   - **Name**: `leaf-disease-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free` (or paid for better performance)

5. Click **"Create Web Service"**

## Step 4: Monitor Deployment

- Render will automatically build and deploy
- Check the logs for any errors
- Once deployed, you'll get a URL like: `https://leaf-disease-api.onrender.com`

## Step 5: Update Frontend

In `d:\leafdetection\smart-leaf-advisor-main\src\pages\Index.tsx`, change:

```javascript
// OLD (local)
const response = await fetch('http://localhost:5000/detect', {

// NEW (Render)
const response = await fetch('https://leaf-disease-api.onrender.com/detect', {
```

## Step 6: Test the Deployment

```bash
curl https://leaf-disease-api.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes_loaded": true,
  "timestamp": "..."
}
```

## Important Notes

⚠️ **Model Size**: The trained model (~17 MB) will be uploaded to Render. This is within limits but may take time.

⚠️ **Cold Starts**: Free tier has cold starts (first request takes 30-60 seconds). Consider paid tier for production.

⚠️ **Environment Variables**: If you need to set any env vars, use Render's dashboard under "Environment".

## Troubleshooting

- **Build fails**: Check `requirements.txt` versions
- **Model not loading**: Ensure `leaf_disease_model.h5` and `classes.json` are in `public/` folder
- **CORS errors**: Already configured in `app.py`
- **Timeout errors**: Increase timeout in frontend or upgrade Render tier

## Rollback

If something breaks, you can:
1. Go to Render dashboard
2. Click your service
3. Go to "Deploys" tab
4. Click "Redeploy" on a previous version
