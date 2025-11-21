"""
Leaf Disease Detection Model Training Script
Trains a CNN model on the leaf disease dataset
"""

import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras import mixed_precision
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
from pathlib import Path

# Configuration
DATASET_PATH = r"d:\leafdetection\image data"
MODEL_SAVE_PATH = r"d:\leafdetection\smart-leaf-advisor-main\public\leaf_disease_model.h5"
CLASSES_SAVE_PATH = r"d:\leafdetection\smart-leaf-advisor-main\public\classes.json"

# Fast mode lets you trade a little accuracy for noticeably faster experiments.
FAST_MODE = os.getenv("FAST_TRAINING", "false").lower() == "true"

DEFAULT_IMG_SIZE = 224
DEFAULT_BATCH_SIZE = 32
DEFAULT_EPOCHS = 15

FAST_IMG_SIZE = 176
FAST_BATCH_SIZE = 32  # keep batch size moderate for CPU/GPU compatibility
FAST_EPOCHS = 10

IMG_SIZE = FAST_IMG_SIZE if FAST_MODE else DEFAULT_IMG_SIZE
BATCH_SIZE = FAST_BATCH_SIZE if FAST_MODE else DEFAULT_BATCH_SIZE
EPOCHS = FAST_EPOCHS if FAST_MODE else DEFAULT_EPOCHS
VALIDATION_SPLIT = 0.2

def get_class_names():
    """Extract class names from directory structure"""
    train_path = os.path.join(DATASET_PATH, "train")
    all_classes = sorted([d for d in os.listdir(train_path) if os.path.isdir(os.path.join(train_path, d))])
    
    # Filter to only 6 crops (case-insensitive matching)
    selected_crops = ['apple', 'corn', 'grape', 'potato', 'rice', 'tomato']
    classes = [c for c in all_classes if any(crop.lower() in c.lower() for crop in selected_crops)]
    
    print(f"[INFO] Selected crops: {selected_crops}")
    print(f"[INFO] All available classes: {all_classes}")
    print(f"[INFO] Filtered classes: {classes}")
    print(f"[INFO] Total classes for selected crops: {len(classes)}")
    
    return classes

def create_model(num_classes):
    """Create a CNN model for leaf disease classification"""
    model = models.Sequential([
        # Data augmentation layers
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
        
        # Preprocessing
        layers.Rescaling(1./255),
        
        # Block 1
        layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 2
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 3
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 4
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Global Average Pooling
        layers.GlobalAveragePooling2D(),
        
        # Dense layers
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax', dtype='float32')
    ])
    
    return model


def configure_performance():
    """Enable optional TensorFlow performance features."""
    gpu_devices = tf.config.list_physical_devices('GPU')
    if gpu_devices:
        try:
            for gpu in gpu_devices:
                tf.config.experimental.set_memory_growth(gpu, True)
            mixed_precision.set_global_policy('mixed_float16')
            print("[INFO] GPU detected – mixed precision enabled for faster training")
        except Exception as exc:
            print(f"[WARNING] Could not enable mixed precision: {exc}")
    else:
        print("[WARNING] No GPU detected – training will run on CPU")
    try:
        tf.config.optimizer.set_jit(True)
        print("[INFO] XLA JIT compilation enabled")
    except Exception as exc:
        print(f"[WARNING] Could not enable XLA JIT: {exc}")

def train_model():
    """Train the leaf disease detection model"""
    print("[INFO] Starting Leaf Disease Detection Model Training...")
    configure_performance()
    print(f"[INFO] Training configuration -> FAST_MODE={FAST_MODE}, IMG_SIZE={IMG_SIZE}, BATCH_SIZE={BATCH_SIZE}, EPOCHS={EPOCHS}")
    
    # Get class names
    classes = get_class_names()
    num_classes = len(classes)
    print(f"[INFO] Found {num_classes} disease classes")
    print(f"[INFO] Classes: {classes}")
    
    # Create model
    print("\n[INFO] Building model architecture...")
    model = create_model(num_classes)
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(model.summary())
    
    # Data generators
    print("\n[INFO] Loading training data...")
    train_path = os.path.join(DATASET_PATH, "train")
    validation_path = os.path.join(DATASET_PATH, "validation")
    
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    train_generator = train_datagen.flow_from_directory(
        train_path,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        classes=classes,
        shuffle=True,
        seed=42
    )
    
    val_generator = val_datagen.flow_from_directory(
        validation_path,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        classes=classes,
        shuffle=False
    )
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        keras.callbacks.ModelCheckpoint(
            MODEL_SAVE_PATH,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Train model
    print("\n[INFO] Training model...")
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1
    )
    
    # Save model
    print(f"\n[INFO] Saving model to {MODEL_SAVE_PATH}...")
    model.save(MODEL_SAVE_PATH)
    
    # Save class names
    class_mapping = {i: name for i, name in enumerate(classes)}
    with open(CLASSES_SAVE_PATH, 'w') as f:
        json.dump(class_mapping, f, indent=2)
    print(f"[INFO] Saving classes to {CLASSES_SAVE_PATH}...")
    
    # Evaluate on test set
    print("\n[INFO] Evaluating on test set...")
    test_path = os.path.join(DATASET_PATH, "test")
    test_datagen = ImageDataGenerator(rescale=1./255)
    test_generator = test_datagen.flow_from_directory(
        test_path,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        classes=classes,
        shuffle=False
    )
    
    test_loss, test_accuracy = model.evaluate(test_generator)
    print(f"[OK] Test Accuracy: {test_accuracy:.4f}")
    print(f"[OK] Test Loss: {test_loss:.4f}")
    
    # Plot training history
    print("\n[INFO] Plotting training history...")
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Val Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True)
    
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Val Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig(r"d:\leafdetection\training_history.png")
    print("[INFO] Training history saved to training_history.png")
    
    print("\n[OK] Training completed successfully!")
    return model, classes

if __name__ == "__main__":
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    
    # Train model
    model, classes = train_model()
