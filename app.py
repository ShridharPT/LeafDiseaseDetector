"""
Flask API for Leaf Disease Detection
Provides endpoints for disease detection using the trained model
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import json
import base64
from io import BytesIO
from PIL import Image
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
MODEL_PATH = r"d:\leafdetection\smart-leaf-advisor-main\public\leaf_disease_model.h5"
CLASSES_PATH = r"d:\leafdetection\smart-leaf-advisor-main\public\classes.json"
IMG_SIZE = 224

# Global model and classes
model = None
class_mapping = None

def load_model_and_classes():
    """Load the trained model and class mapping"""
    global model, class_mapping
    
    try:
        if os.path.exists(MODEL_PATH):
            print(f"Loading model from {MODEL_PATH}...")
            model = tf.keras.models.load_model(MODEL_PATH)
            print("[OK] Model loaded successfully")
        else:
            print(f"[WARNING] Model not found at {MODEL_PATH}")
            print("Please run train_model.py first to train the model")
            
        if os.path.exists(CLASSES_PATH):
            with open(CLASSES_PATH, 'r') as f:
                class_mapping = json.load(f)
            print(f"[OK] Classes loaded: {list(class_mapping.values())}")
        else:
            print(f"[WARNING] Classes file not found at {CLASSES_PATH}")
            
    except Exception as e:
        print(f"[ERROR] Error loading model: {str(e)}")

def preprocess_image(image_data):
    """Preprocess image for model prediction"""
    try:
        # Handle base64 encoded image
        if isinstance(image_data, str) and image_data.startswith('data:image'):
            # Extract base64 string
            image_data = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_bytes))
        else:
            image = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize((IMG_SIZE, IMG_SIZE))
        
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        return None

def is_leaf_image(image_array):
    """Check if the image contains a leaf (very lenient heuristic)"""
    try:
        # Very lenient check - accept almost any image
        # The ML model will do the actual classification
        
        # Only reject completely blank/uniform images
        if image_array is None or image_array.size == 0:
            return False
        
        # Check if image has any variation (not completely uniform)
        std_dev = np.std(image_array)
        if std_dev < 0.01:
            return False  # Completely uniform/blank image
        
        # Accept everything else - let the model decide
        return True
    except Exception as e:
        print(f"[WARNING] Error in leaf validation: {str(e)}")
        return True  # Default to True if check fails

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes_loaded': class_mapping is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/detect', methods=['POST'])
def detect_disease():
    """Detect leaf disease from image"""
    try:
        if model is None or class_mapping is None:
            return jsonify({
                'error': 'Model not loaded. Please train the model first.',
                'isLeaf': False
            }), 503
        
        # Get image data from request
        data = request.get_json()
        if not data or 'imageData' not in data:
            return jsonify({
                'error': 'No image data provided',
                'isLeaf': False
            }), 400
        
        image_data = data['imageData']
        
        # Preprocess image
        image_array = preprocess_image(image_data)
        if image_array is None:
            return jsonify({
                'error': 'Failed to process image',
                'isLeaf': False
            }), 400
        
        # Check if it's a leaf image
        is_valid_leaf = is_leaf_image(image_array)
        print(f"[DEBUG] Leaf validation result: {is_valid_leaf}")
        if not is_valid_leaf:
            print(f"[ERROR] Image rejected as invalid leaf")
            return jsonify({
                'error': 'Please upload a valid plant leaf image',
                'isLeaf': False
            }), 400
        
        # Make prediction
        predictions = model.predict(image_array, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get disease name
        disease_name = class_mapping.get(str(predicted_class_idx), 'Unknown')
        
        # Check if leaf is healthy (you can customize this logic)
        # For now, we'll consider it healthy if the top prediction is "Healthy" or similar
        is_healthy = 'healthy' in disease_name.lower() or confidence < 0.5
        
        response = {
            'isLeaf': True,
            'isHealthy': is_healthy,
            'diseaseId': str(predicted_class_idx),
            'diseaseName': disease_name,
            'confidence': confidence,
            'allPredictions': {
                class_mapping.get(str(i), f'Class {i}'): float(predictions[0][i])
                for i in range(len(predictions[0]))
            }
        }
        
        print(f"✅ Detection: {disease_name} (confidence: {confidence:.2%})")
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Error during detection: {str(e)}")
        return jsonify({
            'error': f'Detection failed: {str(e)}',
            'isLeaf': False
        }), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get list of disease classes"""
    if class_mapping is None:
        return jsonify({'error': 'Classes not loaded'}), 503
    
    return jsonify({
        'classes': list(class_mapping.values()),
        'count': len(class_mapping)
    })

@app.route('/info', methods=['GET'])
def get_info():
    """Get model information"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 503
    
    return jsonify({
        'modelPath': MODEL_PATH,
        'classesPath': CLASSES_PATH,
        'inputSize': IMG_SIZE,
        'numClasses': len(class_mapping) if class_mapping else 0,
        'classes': list(class_mapping.values()) if class_mapping else []
    })

if __name__ == '__main__':
    print("Leaf Disease Detection API")
    print("=" * 50)
    
    # Load model and classes
    load_model_and_classes()
    
    print("\nStarting Flask API server...")
    print("API running on http://localhost:5000")
    print("=" * 50)
    
    # Run Flask app
    app.run(debug=True, port=5000, use_reloader=False)
