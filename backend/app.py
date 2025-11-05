from flask import Flask, request, jsonify
from flask_cors import CORS # To let our React app talk to this server
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # This allows requests from other origins (like localhost:3000)

# --- 1. Load the "Brain" ---
# Load the model you just trained
print("Loading model...")
model = tf.keras.models.load_model('model/pneumonia_model.h5')
print("✅ Model loaded!")

# --- 2. Create the Prediction Endpoint ---
# This is the URL our React app will send the image to
@app.route('/predict', methods=['POST'])
def predict():
    
    # --- 3. Get the Image from the Request ---
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    # Create an 'uploads' folder if it doesn't exist
    os.makedirs('uploads', exist_ok=True)
    
    # Save the file to the 'uploads' folder
    filepath = os.path.join('uploads', file.filename)
    file.save(filepath)

    # --- 4. Preprocess the Image for the Model ---
    # We must do the *exact* same steps as we did for training
    img = image.load_img(filepath, target_size=(150, 150)) # Resize to 150x150
    img_array = image.img_to_array(img)                    # Convert to array
    img_array = np.expand_dims(img_array, axis=0) / 255.0 # Add batch dimension and rescale

    

    # --- 5. Make the Prediction ---
    prediction_value = model.predict(img_array)[0][0]

    # --- 6. Send the Result Back as JSON ---
    # The 'sigmoid' function gives a value between 0 (Normal) and 1 (Pneumonia)
    # We'll use 0.5 as our cutoff
    
    if prediction_value > 0.5:
        result = "Pneumonia Detected 😷"
    else:
        result = "Normal 😊"
        
    # Clean up the uploaded file
    os.remove(filepath) 
    
    # Send the result back to the React app
    return jsonify({'result': result, 'prediction_value': float(prediction_value)})

# --- 7. Run the App ---
if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(debug=True, port=5000)