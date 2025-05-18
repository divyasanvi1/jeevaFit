import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useTranslation } from 'react-i18next';

const PredictRisk = ({ userId }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/predict-risk-live', { userId });
      console.log("Prediction response:", response.data);  
      setResult(response.data.result);  // Set result from response
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePredict}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? t('risk.predicting') : t('risk.predict')}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h3 className="font-semibold text-gray-800">{t('risk.resultTitle')}:</h3>
          <p><strong>{t('risk.riskLevel')}:</strong> {result.prediction || 'Unknown'}</p>  {/* Access prediction */}
          
          <p><strong>{t('risk.reasons')}:</strong></p>
          <ul>
            {result.reasons && result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          {result.model_confidence && (
            <p><strong>{t('risk.confidence')}:</strong> {result.model_confidence}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictRisk;
