import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in kilometers
};
const NearestHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);

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
              const hospitalsWithDistance = res.data.hospitals.map((hospital) => {
                const lat = parseFloat(hospital.latitude);
                const lng = parseFloat(hospital.longitude);
              
                let distance = null;
                if (!isNaN(lat) && !isNaN(lng)) {
                  distance = calculateDistance(latitude, longitude, lat, lng);
                  //console.log(`✅ ${hospital.name} - Distance: ${distance.toFixed(2)} km`);
                } else {
                  console.warn(`❌ ${hospital.name} - Invalid coordinates:`, {
                    latitude: hospital.latitude,
                    longitude: hospital.longitude
                  });
                }
              
                return {
                  ...hospital,
                  distance,
                };
              });
              
              // Optional: sort only those that have distance
              hospitalsWithDistance.sort((a, b) => {
                if (a.distance === null) return 1;
                if (b.distance === null) return -1;
                return a.distance - b.distance;
              });
              
              setHospitals(hospitalsWithDistance);
              

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

  const getDirectionsToHospital = (hospital) => {
    if (!directionsService.current || !directionsRenderer.current || !location) return;

    const { latitude, longitude } = hospital;

    // Parse to float to ensure they're valid numbers
  const lat = parseFloat(hospital.latitude);
  const lng = parseFloat(hospital.longitude);
console.log("lat",lat);
console.log("lng",lng);
  if (isNaN(lat) || isNaN(lng)) {
    console.error("Invalid latitude or longitude for the hospital", hospital);
    return;
  }

    const destination = new window.google.maps.LatLng(latitude, longitude);

    // Get the user's current location (origin)
    const origin = new window.google.maps.LatLng(location.latitude, location.longitude);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

  window.open(mapsUrl, "_blank");
    const request = {
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING, // Can be changed to WALKING, BICYCLING, etc.
    };

    directionsService.current.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.current.setDirections(result);
      } else {
        console.error("Directions request failed due to " + status);
        setError("Failed to get directions.");
      }
    });
  };

  useEffect(() => {
    if (location && window.google && window.google.maps && mapRef.current) {
      // Initialize map only once
      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: location.latitude, lng: location.longitude },
          zoom: 13,
        });
      }

      // Initialize the DirectionsService and DirectionsRenderer if not already initialized
      if (!directionsService.current) {
        directionsService.current = new window.google.maps.DirectionsService();
      }
      if (!directionsRenderer.current) {
        directionsRenderer.current = new window.google.maps.DirectionsRenderer();
        directionsRenderer.current.setMap(mapInstance.current);
      }

      // Add user location marker
      new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: mapInstance.current,
        title: "Your Location",
      });

      // Add hospital markers
      hospitals.forEach((hospital) => {
        const { latitude, longitude } = hospital;
        if (typeof latitude === "number" && typeof longitude === "number") {
          const marker = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance.current,
            title: hospital.name,
          });

          // Add a click event to show directions when clicking a hospital marker
          marker.addListener("click", () => {
            getDirectionsToHospital(hospital);
          });
        } else {
          console.error(`Invalid coordinates for hospital: ${hospital.name}`);
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
            <p> Distance: {hospital.distance.toFixed(2)} km </p>
            {hospital.rating && (
              <p className="text-sm text-gray-500">  Rating: {hospital.rating}</p>
            )}
            <button
              onClick={() => getDirectionsToHospital(hospital)}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            >
              Get Directions
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearestHospitalsPage;
