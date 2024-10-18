import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

type UserInformation = {
  image: string; 
  year: string;
  month: string;
  day: string;
};

const UserUpdate: React.FC = () => {
  const navigate = useNavigate(); 
  const [userInfo, setUserInfo] = useState<UserInformation>({
    image: "",
    year: "",
    month: "",
    day: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, image: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);

    if (!userInfo.image || !userInfo.year || !userInfo.month || !userInfo.day) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setMessage("Token is missing. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        "/v3/api/user",
        {
          image: userInfo.image, 
          year: userInfo.year,
          month: userInfo.month,
          day: userInfo.day,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setMessage("Update Success");
        setTimeout(() => {
          navigate("/user"); 
        }, 1000); 
      } else {
        setMessage(response.data.message || "Update failed");
      }
    } catch (error: any) {
      console.error("Error during update:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        setMessage(error.response.data.message || "Server error occurred.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setMessage("No response from the server. Please try again later.");
      } else {
        console.error("Error setting up request:", error.message);
        setMessage("Failed to send request. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-5 mb-5">
      <h2 className="text-2xl font-bold mb-4">Update User</h2>

      <div className="mb-4">
        <label className="block text-lg mb-1">Profile Image URL:</label>
        <input
          type="text"
          name="image"
          value={userInfo.image}
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-1">Date of Birth:</label>
        <div className="flex space-x-2">
          <input
            type="text"
            name="day"
            placeholder="Day"
            value={userInfo.day}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="month"
            placeholder="Month"
            value={userInfo.month}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={userInfo.year}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Nút cập nhật */}
      <button
        onClick={handleUpdate}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>

      {message && <p className="text-center mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default UserUpdate;
