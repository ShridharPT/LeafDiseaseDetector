# Update Frontend for Render Deployment

## After Deploying to Render

Once your Flask API is deployed on Render, update the frontend to use the new URL.

### Step 1: Get Your Render URL

After deployment completes, Render will give you a URL like:
```
https://leaf-disease-api.onrender.com
```

### Step 2: Update Index.tsx

Open `d:\leafdetection\smart-leaf-advisor-main\src\pages\Index.tsx`

Find this line (around line 74):
```javascript
const response = await fetch('http://localhost:5000/detect', {
```

Replace it with:
```javascript
const response = await fetch('https://leaf-disease-api.onrender.com/detect', {
```

### Step 3: (Optional) Use Environment Variables

For better flexibility, create a `.env` file in your frontend folder:

**File**: `d:\leafdetection\smart-leaf-advisor-main\.env`
```
VITE_API_URL=https://leaf-disease-api.onrender.com
```

Then update Index.tsx:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/detect`, {
```

### Step 4: Test

1. Restart your frontend dev server
2. Upload an image
3. Should now connect to the Render API

### Step 5: Deploy Frontend

If using Netlify or Vercel:
1. Push changes to GitHub
2. Netlify/Vercel will auto-redeploy
3. Done!

## Troubleshooting

**"Failed to fetch" error**: 
- Check CORS is enabled (already done in app.py)
- Verify Render URL is correct
- Check browser console for exact error

**"Model not loaded" error**:
- SSH into Render and check if files exist
- Redeploy the API

**Timeout errors**:
- Render free tier has cold starts
- First request takes 30-60 seconds
- Consider upgrading to paid tier
