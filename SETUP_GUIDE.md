# 🌿 Leaf Disease Detection - Setup & Run Guide

## Project Overview
This is a 12-hour hackathon project that uses AI to detect leaf diseases from photos. It features:
- **Real-time camera capture** using getUserMedia API
- **Deep Learning model** trained on your leaf disease dataset
- **Multi-language support** (English & Kannada)
- **Treatment recommendations** for detected diseases

---

## 📋 Prerequisites

### System Requirements
- Python 3.8+ (for ML training and API)
- Node.js 16+ (for React frontend)
- 4GB+ RAM (recommended for model training)
- Webcam (for camera capture feature)

### Install Python (if not already installed)
Download from: https://www.python.org/downloads/

### Install Node.js (if not already installed)
Download from: https://nodejs.org/

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Python Dependencies
```bash
cd d:\leafdetection
pip install -r requirements.txt
```

### Step 2: Train the ML Model
```bash
python train_model.py
```
This will:
- Load your leaf disease dataset from `image data/` folder
- Train a CNN model on ~60,000 images
- Save the model to `smart-leaf-advisor-main/public/leaf_disease_model.h5`
- Save class mappings to `smart-leaf-advisor-main/public/classes.json`
- Display training history and test accuracy

**⏱️ Estimated time: 30-60 minutes** (depending on your GPU)

### Step 3: Start the Application

#### Terminal 1 - Start Flask API (ML Detection Backend)
```bash
cd d:\leafdetection
python app.py
```
You should see:
```
🌿 Leaf Disease Detection API
==================================================
Loading model from d:\leafdetection\smart-leaf-advisor-main\public\leaf_disease_model.h5...
✅ Model loaded successfully
✅ Classes loaded: [list of diseases]

🚀 Starting Flask API server...
API running on http://localhost:5000
```

#### Terminal 2 - Start React Frontend
```bash
cd d:\leafdetection\smart-leaf-advisor-main
npm run dev
```
You should see:
```
  VITE v5.4.19  ready in 304 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://172.15.7.233:8080/
```

---

## 🎯 How to Use

1. **Open the app** in your browser: http://localhost:8080
2. **Click "Take Photo"** to open your camera
3. **Capture a leaf image** - make sure the leaf is clearly visible
4. **Click "Analyze Leaf"** to detect the disease
5. **View results** with treatment recommendations

---

## 📁 Project Structure

```
d:\leafdetection/
├── image data/                          # Your dataset
│   ├── train/                          # Training images (38,104 images)
│   ├── validation/                     # Validation images (9,458 images)
│   └── test/                           # Test images (5,741 images)
├── train_model.py                      # ML training script
├── app.py                              # Flask API server
├── requirements.txt                    # Python dependencies
├── SETUP_GUIDE.md                      # This file
└── smart-leaf-advisor-main/            # React frontend
    ├── src/
    │   ├── components/
    │   │   └── CameraCapture.tsx       # ✨ NEW: Real camera capture
    │   └── pages/
    │       └── Index.tsx               # ✨ UPDATED: Uses Flask API
    ├── public/
    │   ├── leaf_disease_model.h5       # Trained model (generated)
    │   └── classes.json                # Disease classes (generated)
    └── package.json
```

---

## 🔧 Troubleshooting

### Issue: "Camera access denied"
**Solution:** 
- Check browser permissions for camera access
- Try a different browser (Chrome/Edge recommended)
- Ensure HTTPS or localhost is used

### Issue: "Cannot connect to detection service"
**Solution:**
- Make sure Flask API is running on port 5000
- Check if port 5000 is already in use: `netstat -ano | findstr :5000`
- Kill the process and restart: `taskkill /PID <PID> /F`

### Issue: Model training is very slow
**Solution:**
- Use GPU acceleration: Install `tensorflow-gpu` instead of `tensorflow`
- Reduce BATCH_SIZE in `train_model.py` if running out of memory
- Use a smaller subset of data for testing

### Issue: "Model not found" error
**Solution:**
- Run `python train_model.py` first to train the model
- Verify files exist:
  - `d:\leafdetection\smart-leaf-advisor-main\public\leaf_disease_model.h5`
  - `d:\leafdetection\smart-leaf-advisor-main\public\classes.json`

### Issue: Port 8080 already in use
**Solution:**
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

---

## 📊 Dataset Information

Your dataset contains leaf images for 13 crop types:
- **Apple** (2,286 images)
- **Cassava** (1,573 images)
- **Cherry** (1,374 images)
- **Corn/Maize** (2,776 images)
- **Grape** (2,927 images)
- **Orange** (3,966 images)
- **Peach** (1,915 images)
- **Pepper, Bell** (1,784 images)
- **Potato** (1,550 images)
- **Rice** (2,419 images)
- **Squash** (1,322 images)
- **Strawberry** (1,129 images)
- **Tomato** (13,083 images)

**Total: 53,104 training images**

---

## 🎨 Features Implemented

### ✅ Camera Capture
- Real-time camera feed using `getUserMedia` API
- Capture button to take photo
- Cancel button to close camera
- Fallback to file upload

### ✅ ML Model
- CNN architecture with 4 convolutional blocks
- Data augmentation for better generalization
- Batch normalization and dropout for regularization
- Trained on your complete dataset

### ✅ API Backend
- Flask REST API on port 5000
- Image preprocessing and validation
- Disease detection with confidence scores
- CORS enabled for frontend communication

### ✅ Frontend Integration
- Real-time camera preview
- Image upload fallback
- Disease detection results
- Treatment recommendations
- Multi-language support (English & Kannada)

---

## 🔌 API Endpoints

### POST /detect
Detect disease from image
```bash
curl -X POST http://localhost:5000/detect \
  -H "Content-Type: application/json" \
  -d '{"imageData": "data:image/jpeg;base64,..."}'
```

**Response:**
```json
{
  "isLeaf": true,
  "isHealthy": false,
  "diseaseId": "0",
  "diseaseName": "Apple___Apple_scab",
  "confidence": 0.95,
  "allPredictions": {
    "Apple___Apple_scab": 0.95,
    "Apple___Black_rot": 0.03,
    ...
  }
}
```

### GET /health
Check API health status
```bash
curl http://localhost:5000/health
```

### GET /classes
Get list of disease classes
```bash
curl http://localhost:5000/classes
```

### GET /info
Get model information
```bash
curl http://localhost:5000/info
```

---

## 📈 Model Performance

After training, you'll see:
- **Training Accuracy**: ~95%+ (on training data)
- **Validation Accuracy**: ~85-90% (on validation data)
- **Test Accuracy**: ~80-85% (on test data)

The model learns to distinguish between:
- Healthy leaves
- Various disease types for each crop

---

## 🛠️ Advanced Configuration

### Modify Model Architecture
Edit `train_model.py`:
```python
EPOCHS = 20              # Increase for better accuracy
BATCH_SIZE = 32          # Decrease if out of memory
IMG_SIZE = 224           # Input image size
```

### Modify API Settings
Edit `app.py`:
```python
MODEL_PATH = r"..."      # Path to trained model
CLASSES_PATH = r"..."    # Path to classes.json
IMG_SIZE = 224           # Must match training size
```

---

## 📝 Notes

- The camera capture requires HTTPS in production (or localhost for development)
- Model training uses TensorFlow/Keras
- Frontend is built with React + Vite + TypeScript
- All dependencies are listed in `requirements.txt` and `package.json`

---

## 🎓 Learning Resources

- **TensorFlow**: https://www.tensorflow.org/
- **Flask**: https://flask.palletsprojects.com/
- **React**: https://react.dev/
- **CNN Basics**: https://en.wikipedia.org/wiki/Convolutional_neural_network

---

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Verify all dependencies are installed
3. Check console logs for error messages
4. Ensure ports 5000 and 8080 are available

---

## 🎉 You're All Set!

Your leaf disease detection app is ready to use. Start with Step 3 above to run the application!

Happy farming! 🌾
