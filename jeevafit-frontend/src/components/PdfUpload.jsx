import React, { useState } from 'react';
import axios from 'axios';

const PdfFileInput = ({ userId }) => {
  console.log("userId in component:", userId);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId); // you already know userId from your dashboard

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:8001/api/upload-health-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(res.data.message || 'Upload successful!');
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginLeft: '10px' }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PdfFileInput;
