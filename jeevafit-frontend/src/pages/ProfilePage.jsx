import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  console.log("userId:", userId);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/userRoute/getUser/${userId}`);
        console.log("res",res);
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!userData) return <p>Loading profile...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Age:</strong> {userData.age}</p>
      <p><strong>Gender:</strong> {userData.gender}</p>
      <p><strong>Height:</strong> {userData.height}</p>
      <p><strong>Weight:</strong> {userData.weight}</p>
      {/* Add more fields if needed */}
    </div>
  );
};

export default ProfilePage;
