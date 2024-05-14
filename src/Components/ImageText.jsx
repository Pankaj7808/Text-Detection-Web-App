import React, { useState } from 'react';
import axios from 'axios';

const ImageTextDetector = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const detectText = async () => {
    if (!image) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('apikey', 'K87292502288957');
    formData.append('language', 'eng');
    formData.append('file', image);
    formData.append('OCREngine', '2'); // Specify OCR Engine 2

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

      if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
        const parsedText = response.data.ParsedResults[0].ParsedText;
        if (parsedText) {
          setText(parsedText);
        } else {
          setError('No text detected in the image');
        }
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
      {image && <img src={URL.createObjectURL(image)} alt="Uploaded" />}
      <button onClick={detectText} disabled={loading}>Detect Text</button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && text && <div>{text}</div>}
    </div>
  );
};

export default ImageTextDetector;
