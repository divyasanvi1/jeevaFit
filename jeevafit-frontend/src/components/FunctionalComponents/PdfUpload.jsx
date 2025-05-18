import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useTranslation } from 'react-i18next';

const PdfFileInput = ({ userId }) => {
  console.log("userId in component:", userId);
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage(t('pdfupload.pleaseSelect'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId); // you already know userId from your dashboard

    try {
      setUploading(true);
      const res = await axios.post('/api/upload-health-pdf', formData, {
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
    <div className="p-6 bg-white rounded-2xl shadow-md mt-6 w-full max-w-md">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    📄 {t('pdfupload.title')}
  </h3>
  <div className="flex items-center gap-4">
    <input
      type="file"
      accept="application/pdf"
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    <button
      onClick={handleUpload}
      disabled={uploading}
      className={`px-4 py-2 rounded-full text-white font-medium transition ${
        uploading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {uploading ? t('pdfupload.uploading') : t('pdfupload.upload')}
    </button>
  </div>
  {message && (
    <p className="mt-3 text-sm text-gray-700">
      ✅ {message}
    </p>
  )}
</div>

  );
};

export default PdfFileInput;
