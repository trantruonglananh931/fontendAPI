import React, { useEffect, useState } from "react";
import axios from "axios";
import UserUpdate from "./UserUpdate"; // Import UserUpdate component

type UserProfileData = {
  username: string;
  emailAddress: string;
  image: string;
  birthDay: string;
};

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // State to toggle update mode

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          '/v3/api/user/GetCurrentUser', 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status) {
          setUserData(response.data.data); 
        } else {
          console.error("Error fetching user data:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile(); 
  }, []);

  const handleUpdateClick = () => {
    setIsUpdating(true); // Set updating mode to true
  };

  if (isUpdating) {
    return <UserUpdate />; // Render UserUpdate component when in updating mode
  }

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white">
      <img
        src={userData.image || "https://via.placeholder.com/150"}
        alt="User Avatar"
        className="w-32 h-32 rounded-full mx-auto"
      />
      <h2 className="text-center text-2xl mt-4">{userData.username}</h2>
      <p className="text-center">{userData.emailAddress}</p>
      <p className="text-center">{userData.birthDay}</p>
      
      {/* Nút cập nhật */}
      <button
        onClick={handleUpdateClick}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors mt-4"
      >
        Update
      </button>
    </div>
  );
};

export default UserProfile;
