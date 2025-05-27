import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


const UploadMedicalFileCompact = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage(t('pdfuploadmedical.pleaseSelect'));
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await axios.post('/api/upload-medical', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setMessage(res.data.message || t('pdfuploadmedical.success'));
      setError(false);
      setFile(null);
      document.getElementById('fileInput').value = null;
    } catch (err) {
      console.error(err);
      console.log("error",err);
      const backendMessage = err.response?.data?.message?.trim();
      console.log("backendMessage :",backendMessage);
    if (backendMessage === "Not a medical-related file") {
      setMessage(t('pdfuploadmedical.notMedical'));
      setError(true);
    return; 
    } else {
      setMessage(t('pdfuploadmedical.fail'));
    }
      setMessage(t('pdfuploadmedical.fail'));
      setError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📄 {t('pdfuploadmedical.PdfTitle')}
      </h3>

      <div className="flex items-center gap-4">
        <input
          id="fileInput"
          type="file"
          accept="application/pdf,image/*"
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
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? t('pdfuploadmedical.uploading') : t('pdfuploadmedical.upload')}
        </button>
      </div>

      {message && (
        <p className={`mt-3 text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <button
        className="mt-4 text-blue-600 underline"
        onClick={() => navigate('/uploadList')}
      >
        {t('pdfuploadmedical.viewUploads', 'View My Uploaded Files')}
      </button>
    </div>
  );
};

export default UploadMedicalFileCompact;
