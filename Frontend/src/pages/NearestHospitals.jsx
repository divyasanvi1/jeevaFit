// src/pages/NearestHospitalsPage.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const NearestHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Dynamically load the Google Maps script once
  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", resolve);
        existingScript.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBKIyISxZz4HoVWHC5kNpDJE0M4Yk-E31o&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadGoogleMapsScript();

        if (!navigator.geolocation) {
          setError("Geolocation not supported by this browser.");
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            try {
              const res = await axios.post("http://localhost:8001/location/hospitals", {
                latitude,
                longitude,
              });
              setHospitals(res.data.hospitals);
            } catch (err) {
              console.error("Fetch hospitals error:", err);
              setError("Failed to fetch hospitals.");
            } finally {
              setLoading(false);
            }
          },
          () => {
            setError("Permission denied or failed to get location.");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Google Maps script load error:", err);
        setError("Failed to load Google Maps.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location && window.google && window.google.maps && mapRef.current) {
      // Initialize map only once
      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: location.latitude, lng: location.longitude },
          zoom: 13,
        });
      }

      // Add user location marker
      new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: mapInstance.current,
        title: "Your Location",
      });

      // Add hospital markers
      hospitals.forEach((hospital) => {
        if (typeof hospital.latitude === "number" && typeof hospital.longitude === "number") {
          new window.google.maps.Marker({
            position: { lat: hospital.latitude, lng: hospital.longitude },
            map: mapInstance.current,
            title: hospital.name,
          });
        }
      });
    }
  }, [location, hospitals]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Hospitals</h1>
      {loading && <p>Fetching your location and nearby hospitals...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Map container */}
      <div ref={mapRef} id="map" className="h-96 w-full mb-4 rounded-lg shadow"></div>

      <ul className="space-y-4">
        {hospitals.map((hospital, index) => (
          <li key={index} className="border-b pb-2">
            <strong>{hospital.name}</strong>
            <p>{hospital.address}</p>
            {hospital.rating && (
              <p className="text-sm text-gray-500">Rating: {hospital.rating}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearestHospitalsPage;
