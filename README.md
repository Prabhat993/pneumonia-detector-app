# AI Pneumonia Detector 🫁✨

This is a full-stack web application that uses a Deep Learning model (a Convolutional Neural Network) to detect pneumonia from chest X-ray images.

The user can upload an X-ray, and the app will provide a real-time prediction: **"Normal 😊"** or **"Pneumonia Detected 😷"**.

[Image of the Pneumonia Detector app UI]
(https://i.imgur.com/your-screenshot-link.png) 
*<-- Note: You'll need to upload your screenshot to a site like Imgur and paste the link here.*

---

## 🌐 Tech Stack

This project is built with a modern full-stack architecture:

* **🧠 Backend (The "Brain"):**
    * **Python:** The core programming language.
    * **Flask:** A lightweight web server to create and serve the prediction API.
    * **TensorFlow & Keras:** Used to build, train, and run the CNN deep learning model.

* **⚛️ Frontend (The "Face"):**
    * **React.js:** A JavaScript library for building the dynamic user interface.
    * **Axios:** Used to make API requests from the React app to the Flask backend.
    * **CSS-in-JS:** All styling is handled directly within the React components for a modern, colorful UI.

---

## 🚀 How to Run This Project Locally

Follow these steps to set up and run the project on your own machine.

### 1. Clone the Repository

```sh
git clone [https://github.com/Prabhat993/pneumonia-detector-app.git](https://github.com/Prabhat993/pneumonia-detector-app.git)
cd pneumonia-detector



Here are the two scripts you need to run on your local computer to start the project for development.

You will need two separate terminals running at the same time.

⚙️ Backend (Flask API)
In your first terminal, you'll start the Flask server.

PowerShell

# 1. Navigate to your backend folder
cd C:\Users\Prabhat\Desktop\pneumonia-detector\backend

# 2. Activate your Python virtual environment
.\venv\Scripts\Activate

# 3. Run the Python app
python app.py
This will start your backend server, which will be listening at: http://127.0.0.1:5000

⚛️ Frontend (React App)
In a second terminal, you'll start the React app.

PowerShell

# 1. Navigate to your frontend folder
cd C:\Users\Prabhat\Desktop\pneumonia-detector\frontend

# 2. Start the React development server
npm start
This will automatically open your web browser to your app at: http://localhost:3000
