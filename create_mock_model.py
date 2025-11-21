"""
Create a mock model for testing without full training
This allows the API to start immediately
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import json
import os

MODEL_PATH = r"d:\leafdetection\smart-leaf-advisor-main\public\leaf_disease_model.h5"
CLASSES_PATH = r"d:\leafdetection\smart-leaf-advisor-main\public\classes.json"

# Create output directory
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

# Define disease classes (from your dataset)
classes = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Cassava___Brown_Spot",
    "Cassava___Green_Mottle",
    "Cassava___Mosaic",
    "Cassava___healthy",
    "Cherry___Powdery_mildew",
    "Cherry___healthy",
    "Corn___Cercospora_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___healthy",
    "Grape___Black_rot",
    "Grape___Esca",
    "Grape___Leaf_blight",
    "Grape___healthy",
    "Orange___Haunglongbing",
    "Orange___healthy",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper___Bacterial_spot",
    "Pepper___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Rice___Brown_spot",
    "Rice___Leaf_blast",
    "Rice___Neck_blast",
    "Rice___healthy",
    "Squash___Powdery_mildew",
    "Squash___healthy",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___healthy"
]

num_classes = len(classes)

print(f"Creating mock model with {num_classes} classes...")

# Create a simple model
model = keras.Sequential([
    layers.Input(shape=(224, 224, 3)),
    layers.Rescaling(1./255),
    layers.Conv2D(32, 3, activation='relu'),
    layers.MaxPooling2D(2),
    layers.Conv2D(64, 3, activation='relu'),
    layers.MaxPooling2D(2),
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(num_classes, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print(f"Saving mock model to {MODEL_PATH}...")
model.save(MODEL_PATH)

# Save class mapping
class_mapping = {str(i): name for i, name in enumerate(classes)}
with open(CLASSES_PATH, 'w') as f:
    json.dump(class_mapping, f, indent=2)

print(f"Saving classes to {CLASSES_PATH}...")
print(f"✅ Mock model created successfully!")
print(f"📊 Model has {num_classes} disease classes")
print(f"\nNote: This is a mock model for testing.")
print(f"Run 'python train_model.py' to train the real model on your dataset.")
