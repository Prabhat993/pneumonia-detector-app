import React, { useState } from "react";
import axios from "axios";

// --- 1. CSS Styles (as a JavaScript object) ---
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: 'linear-gradient(135deg, #FFC0CB 0%, #ADD8E6 100%)', // Pink to Light Blue
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '45px',
    borderRadius: '18px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    textAlign: 'center',
    width: '500px',
    maxWidth: '90%',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  },
  title: {
    fontSize: '40px', // Even larger title
    fontWeight: '800', // Extra bold
    marginBottom: '15px',
    // --- ANIMATED MULTICOLOR TEXT STYLE ---
    // Background gradient for text
    background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
    WebkitBackgroundClip: 'text', // Clip background to text shape
    WebkitTextFillColor: 'transparent', // Make text transparent to show background
    backgroundSize: '400% 400%', // Larger background to allow animation
    animation: 'rainbowGradient 8s ease infinite', // Apply animation
    lineHeight: '1.2', // Adjust line height if title breaks to two lines
  },
  subtitle: {
    color: '#555',
    fontSize: '18px',
    marginBottom: '35px',
  },
  imagePreviewBox: {
    width: '100%',
    height: '280px',
    borderRadius: '15px',
    border: '3px dashed #AEC6CF',
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: '35px',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePreviewText: {
    color: '#888',
    fontSize: '16px',
    textShadow: '1px 1px 2px rgba(255,255,255,0.7)',
  },
  uploadLabel: {
    backgroundColor: '#6A5ACD',
    color: 'white',
    padding: '14px 25px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '600',
    display: 'inline-block',
    transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    '&:hover': {
      backgroundColor: '#483D8B',
      transform: 'translateY(-2px)',
    }
  },
  hiddenInput: {
    display: 'none',
  },
  predictButton: {
    backgroundColor: '#3CB371',
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '25px',
    transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    '&:hover': {
      backgroundColor: '#2E8B57',
      transform: 'translateY(-2px)',
    }
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    animation: 'spin 1s linear infinite',
    margin: '25px auto 0',
  },
  resultText: {
    marginTop: '25px',
    fontSize: '26px',
    fontWeight: 'bold',
    textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
  },
  errorText: {
    color: '#FF6347',
    marginTop: '18px',
    fontSize: '16px',
    fontWeight: '500',
  },
};

// --- CSS Animations ---
// Added 'rainbowGradient' keyframes for the heading text
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.03); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes rainbowGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

// --- 2. The React Component ---
const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult("");
      setError("");
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // NEW handleUpload function for Gradio API
  const handleUpload = async () => {
    if (!file) {
      setError("Please select an X-ray image first.");
      return;
    }
    
    setLoading(true);
    setResult("");
    setError("");

    // 1. Create a FileReader to read the file
    const reader = new FileReader();
    
    // 2. This runs when the file is finished reading
    reader.onload = async (e) => {
      const base64Image = e.target.result; // This is the Base64 data URL

      try {
        // --- This is the API Call ---
        // This is your live Hugging Face API endpoint
        const GRADIO_API_URL = "https://prabhat993-pneumonia-detector-api.hf.space/run/predict";

        // 3. Send a JSON payload in the format Gradio expects
        const res = await axios.post(GRADIO_API_URL, {
          data: [
            base64Image  // The Base64 string is in the 'data' array
          ]
        });
        
        // 4. Get the result from the Gradio response
        // The prediction is in res.data.data[0]
        setResult(res.data.data[0]);

      } catch (err) {
        console.error("Error uploading file:", err);
        setError("An error occurred. Is the backend server running?");
      }
      
      setLoading(false); // Hide loading message
    };

    // 5. Tell the reader to read the file as a Base64 string
    reader.readAsDataURL(file);
  };

  const getResultStyle = () => {
    let color = '#333';
    if (result.includes("Pneumonia")) {
      color = '#FF4500'; // OrangeRed for Pneumonia
    } else if (result.includes("Normal")) {
      color = '#32CD32'; // LimeGreen for Normal
    }
    return { 
      ...styles.resultText, 
      color,
      animation: result ? 'pulse 1.5s infinite ease-in-out' : 'none',
    };
  };

  // --- Hover effects for buttons and card ---
  const [cardHovered, setCardHovered] = useState(false);
  const [uploadHovered, setUploadHovered] = useState(false);
  const [predictHovered, setPredictHovered] = useState(false);

  const cardDynamicStyle = {
    ...styles.card,
    transform: cardHovered ? 'scale(1.02)' : 'scale(1)',
    boxShadow: cardHovered ? '0 20px 50px rgba(0,0,0,0.35)' : '0 15px 40px rgba(0,0,0,0.25)',
  };

  const uploadDynamicStyle = {
    ...styles.uploadLabel,
    backgroundColor: uploadHovered ? styles.uploadLabel['&:hover'].backgroundColor : styles.uploadLabel.backgroundColor,
    transform: uploadHovered ? styles.uploadLabel['&:hover'].transform : 'none',
  };

  const predictDynamicStyle = {
    ...styles.predictButton,
    backgroundColor: predictHovered ? styles.predictButton['&:hover'].backgroundColor : styles.predictButton.backgroundColor,
    transform: predictHovered ? styles.predictButton['&:hover'].transform : 'none',
  };

  return (
    <>
      <style>{keyframes}</style> 
      
      <div style={styles.container}>
        <div 
          style={cardDynamicStyle}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
        >
          
          <h1 style={styles.title}>AI Pneumonia Detector</h1>
          <p style={styles.subtitle}>Upload a chest X-ray to get a prediction.</p>

          {/* Image Preview Box */}
          <div style={styles.imagePreviewBox}>
            {preview ? (
              <img src={preview} alt="Upload Preview" style={styles.imagePreview} />
            ) : (
              <span style={styles.imagePreviewText}>Select an X-ray to preview</span>
            )}
          </div>

          {/* Custom Upload Button */}
          <label 
            htmlFor="file-upload" 
            style={uploadDynamicStyle}
            onMouseEnter={() => setUploadHovered(true)}
            onMouseLeave={() => setUploadHovered(false)}
          >
            Choose Image
          </label>
          <input 
            id="file-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={styles.hiddenInput} 
          />

          {/* Predict Button (only show if a file is selected and not loading/result) */}
          {file && !loading && !result && (
            <button 
              onClick={handleUpload} 
              style={predictDynamicStyle}
              onMouseEnter={() => setPredictHovered(true)}
              onMouseLeave={() => setPredictHovered(false)}
            >
              Predict
            </button>
          )}

          {/* Loading Spinner */}
          {loading && <div style={styles.spinner}></div>}

          {/* Result Text */}
          {result && (
            <h3 style={getResultStyle()}>
              {result}
            </h3>
          )}

          {/* Error Text */}
          {error && <p style={styles.errorText}>{error}</p>}
          
        </div>
      </div>
    </>
  );
};

export default UploadForm;