import React, { useState } from 'react';
import axios from 'axios';

const TextDetectionComponent = () => {
  const [image, setImage] = useState(null);
  const [detectedText, setDetectedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const detectText = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setDetectedText('');

    const formData = new FormData();
    formData.append('apikey', 'K82824195688957');
    formData.append('language', 'eng');
    formData.append('file', image);

    try {
      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (
        response.data &&
        response.data.ParsedResults &&
        response.data.ParsedResults.length > 0
      ) {
        const text = response.data.ParsedResults[0].ParsedText;
        setDetectedText(text);
      } else {
        setError('No text detected in the image');
      }
    } catch (error) {
      console.error('Error detecting text:', error);
      setError('Error detecting text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {error && <div>{error}</div>}
      {loading && <div>Loading...</div>}
      {detectedText && <div>Detected Text: {detectedText}</div>}
      <button onClick={detectText}>Detect Text</button>
    </div>
  );
};

export default TextDetectionComponent;
