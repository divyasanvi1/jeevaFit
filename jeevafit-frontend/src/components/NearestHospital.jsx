import { useState } from "react";
import axios from "axios";

const NearestHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHospitals = async () => {
    setLoading(true);
    setError("");
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation not supported.");
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await axios.post("http://localhost:8001/location/hospitals", {
            latitude,
            longitude,
        });
        setHospitals(res.data.hospitals);
        setLoading(false);
      });
    } catch (err) {
      setError("Failed to fetch nearby hospitals.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-white rounded-2xl shadow p-4">
      <button
        onClick={fetchHospitals}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Find Nearest Hospitals
      </button>

      {loading && <p className="mt-2 text-gray-500">Fetching hospitals...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {hospitals.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Nearby Hospitals</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {hospitals.map((hospital, i) => (
              <li key={i} className="border-b pb-2">
                <strong>{hospital.name}</strong>
                <p className="text-sm text-gray-600">{hospital.vicinity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NearestHospitals;
