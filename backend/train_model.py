import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Dense, Flatten, Dropout, Input
from tensorflow.keras.models import Model
from tensorflow.keras.applications import VGG16
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import os
from collections import Counter

# --- 1. Define Paths ---
train_dir = 'chest_xray/train'
test_dir = 'chest_xray/test'

# --- 2. Image Preprocessing ---
# VGG16 expects 224x224 usually, but 150x150 works too.
# We add aggressive augmentation to prevent overfitting.
train_gen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True,
    fill_mode='nearest'
)

# --- 3. Create Data Generators ---
train_data = train_gen.flow_from_directory(
    train_dir,
    target_size=(150, 150),
    batch_size=32,
    class_mode='binary',
    subset='training'
)

val_data = train_gen.flow_from_directory(
    train_dir,
    target_size=(150, 150),
    batch_size=32,
    class_mode='binary',
    subset='validation'
)

# --- 4. Calculate Class Weights (Crucial for Imbalance) ---
counter = Counter(train_data.classes)
total = len(train_data.classes)
# Increase penalty for Normal class slightly to ensure it learns them well
weight_for_0 = (1 / counter[0]) * (total / 2.0) * 1.2  # Slight boost to Normal
weight_for_1 = (1 / counter[1]) * (total / 2.0)

class_weight = {0: weight_for_0, 1: weight_for_1}

print(f"Weights -> Normal: {weight_for_0:.2f}, Pneumonia: {weight_for_1:.2f}")

# --- 5. Build Model with Transfer Learning (VGG16) ---
# Load VGG16 model without the top classification layers
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(150, 150, 3))

# Freeze the base model layers so we don't destroy pre-learned features
for layer in base_model.layers:
    layer.trainable = False

# Add our own custom layers on top
x = Flatten()(base_model.output)
x = Dense(512, activation='relu')(x)
x = Dropout(0.5)(x) # Dropout helps prevent overfitting
output = Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=output)

# --- 6. Compile ---
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001), # Lower learning rate for fine-tuning
    loss='binary_crossentropy', 
    metrics=['accuracy']
)

# --- 7. Callbacks ---
# Stop training if validation loss doesn't improve for 3 epochs
early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
# Reduce learning rate if improvement stalls
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=2, min_lr=0.00001)

# --- 8. Train ---
print("Starting training with VGG16...")
model.fit(
    train_data,
    epochs=10, # More epochs, but early_stop will prevent overtraining
    validation_data=val_data,
    class_weight=class_weight,
    callbacks=[early_stop, reduce_lr]
)

# --- 9. Save ---
os.makedirs('model', exist_ok=True)
model.save('model/pneumonia_model.h5')

print("✅ High-accuracy VGG16 model saved successfully!")