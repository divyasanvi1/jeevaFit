import React, { useState } from 'react';
import axios from 'axios';

const PredictRisk = ({ userId }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8001/api/predict-risk-live', { userId });
      console.log("Prediction response:", response.data);  // Check the response in the console
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
        {loading ? 'Predicting...' : 'Predict Risk'}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h3 className="font-semibold text-gray-800">Prediction Result:</h3>
          <p><strong>Risk Level:</strong> {result.prediction || 'Unknown'}</p>  {/* Access prediction */}
          
          <p><strong>Reasons:</strong></p>
          <ul>
            {result.reasons && result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          {result.model_confidence && (
            <p><strong>Confidence:</strong> {result.model_confidence}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictRisk;
