// src/components/UserDetailsCard.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserDetails } from '../redux/userSlice';
import axios from 'axios';

const UserDetailsCard = ({ onClose }) => {
  const dispatch = useDispatch();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [fullUser, setFullUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    age: storedUser?.age || '',
    weight: storedUser?.weight || '',
    gender: storedUser?.gender || '',
    height: storedUser?.height || '',
  });

  useEffect(() => {
    const fetchFullUserDetails = async () => {
      try {
        const res = await axios.post("http://localhost:8001/userRoute/details", { email: storedUser.email });
        setFullUser(res.data.user);
        setFormData(res.data.user);
        console.log("Fetched user details:", res.data.user);
        dispatch(updateUserDetails(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.error("Error fetching full user data:", err);
      }
    };

    fetchFullUserDetails();
  }, [storedUser.email, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:8001/userRoute/update', formData);
      const updatedUser = response.data.user;
      setFormData(updatedUser);
      setFullUser(updatedUser);
      dispatch(updateUserDetails(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating user data:', err);
    }
  };


  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 z-50 overflow-y-auto">
      <button onClick={onClose} className="text-red-500 float-right text-xl font-bold">
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        {isEditing ? (
          <>
            {['gender', 'age', 'weight', 'height'].map((field) => (
              <div key={field}>
                <label className="block capitalize">{field}:</label>
                <input
                  type={field === 'gender' ? 'text' : 'number'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="border p-1 w-full"
                />
              </div>
            ))}
            <button
              onClick={handleUpdate}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Age:</strong> {formData.age}</p>
            <p><strong>Weight:</strong> {formData.weight} kg</p>
            <p><strong>Height:</strong> {formData.height} cm</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailsCard;
