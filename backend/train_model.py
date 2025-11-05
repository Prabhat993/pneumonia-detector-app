import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
import os

# --- 1. Define Paths ---
# Make sure this path matches where you put the dataset
# Path to dataset
train_dir = 'chest_xray/train'
test_dir = 'chest_xray/test'

# --- 2. Image Preprocessing ---
# 'ImageDataGenerator' automatically reads images from folders and prepares them 
# for the model. 'rescale=1./255' normalizes pixel values from 0-255 to 0-1,
# which helps the model train better.
# 'validation_split=0.2' tells the generator to reserve 20% of data for validation

train_gen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

# 'flow_from_directory' links the generator to our image folders
# Get the 80% of images for training
train_data = train_gen.flow_from_directory(
    train_dir,
    target_size=(150, 150),  # Resize all images to 150x150
    batch_size=32,
    class_mode='binary',  # We have two classes: 'normal' and 'pneumonia'
    subset='training'  # Specify this is the training subset
)

# Get the 20% of images for validation
val_data = train_gen.flow_from_directory(
    train_dir,  # Note: We are using train_dir again
    target_size=(150, 150),
    batch_size=32,
    class_mode='binary',
    subset='validation'  # Specify this is the validation subset
)

# --- 3. Build the CNN Model ---
# This is the "brain's" architecture. It's a stack of layers.

model = Sequential([
    # Layer 1: Find simple features (edges, corners)
    Conv2D(32, (3,3), activation='relu', input_shape=(150,150,3)),
    MaxPooling2D(2,2),
    
    # Layer 2: Find more complex features
    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(2,2),
    
    # Layer 3: Find even more complex features
    Conv2D(128, (3,3), activation='relu'),
    MaxPooling2D(2,2),
    
    # --- 4. Classifier Head ---
    # Flatten the 3D features into a 1D vector
    Flatten(),
    
    # A standard "brain" layer
    Dense(512, activation='relu'),
    Dropout(0.5), # Helps prevent overfitting
    
    # Output Layer: 'sigmoid' gives a probability (0 to 1)
    # 0 = Normal, 1 = Pneumonia
    Dense(1, activation='sigmoid')
])

# --- 5. Compile the Model ---
# Tell the model how to learn
model.compile(
    optimizer='adam', 
    loss='binary_crossentropy', # Good for binary (0 or 1) problems
    metrics=['accuracy']
)

# --- 6. Train the Model ---
# 'fit' starts the training process
model.fit(
    train_data,
    epochs=5,  # 5 passes over the entire dataset
    validation_data=val_data
)

# --- 7. Save the Trained Model ---
# Create a 'model' directory if it doesn't exist
os.makedirs('model', exist_ok=True)
# Save the final trained model
model.save('model/pneumonia_model.h5')

print("✅ Model saved successfully!")