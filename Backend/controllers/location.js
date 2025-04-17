const axios = require('axios');
require('dotenv').config();
async function handleNearbyHospitals(req, res) {
    console.log("Received coordinates in backend:", req.body);

  try {
    const { latitude, longitude } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const radius = 5000; // meters

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: 'hospital',
          key: apiKey
        }
      }
    );
    //console.log("Google API Response:", response.data);
    const hospitals = response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      rating: place.rating
    }));

    res.status(200).json({ hospitals });
  } catch (err) {
    console.error("Error fetching hospitals:", err.message);
    res.status(500).json({ msg: "Failed to fetch hospitals" });
  }
}

module.exports = { handleNearbyHospitals };
