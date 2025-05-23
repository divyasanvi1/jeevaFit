import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';

const UploadsListPage = () => {
  const { t } = useTranslation();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    try {
      const res = await axios.get('/api/user-uploads', {
        withCredentials: true,
      });
      setUploads(res.data);
    } catch (err) {
      console.error("Error fetching uploads:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);
  const handleDownload = async (filename, originalName) => {
    try {
      const response = await axios.get(`/api/download/${encodeURIComponent(filename)}`, {
        responseType: 'blob',  // VERY important!
        withCredentials: true, // if your API uses cookies/auth
      });
  
      // Create blob URL from response data
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  
      // Create temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName); // use the original filename for download
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{t("upload.previous", "Previously Uploaded Files")}</h2>

      {loading ? (
        <p>{t("upload.loading", "Loading...")}</p>
      ) : uploads.length === 0 ? (
        <p>{t("upload.none", "No uploads found.")}</p>
      ) : (
        <ul className="space-y-2">
          {uploads.map(file => {
            const url = `/api/download/${encodeURIComponent(file.filename)}`;

            return (
              <li key={file._id} className="border p-3 rounded shadow flex justify-between items-center">
                <div>
                  <p><strong>{file.originalName}</strong></p>
                  <p className="text-sm text-gray-600">{new Date(file.uploadDate).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDownload(file.filename, file.originalName)} className="text-blue-600 underline">
  Download
</button>

              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UploadsListPage;
