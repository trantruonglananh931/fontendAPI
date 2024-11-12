import React, { useEffect, useState } from "react";
import axios from "axios";
import UserUpdate from "./UserUpdate";
import { User } from "../../../Models/User";

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
          // Chuyển đổi birthDay thành định dạng ngày tháng thân thiện
          const userData = response.data.data;
          if (userData.birthDay) {
            const birthDate = new Date(userData.birthDay);
            userData.birthDay = birthDate.toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          }
          setUserData(userData);
        } else {
          console.error("Lỗi khi lấy dữ liệu người dùng:", response.data.message);
        }
      } catch (error) {
        console.error("Lấy thông tin người dùng thất bại:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateClick = () => {
    setIsUpdating(true);
  };

  if (isUpdating) {
    return <UserUpdate />;
  }

  if (!userData) return <p>Đang tải...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white">
      <img
        src={userData.image || "https://via.placeholder.com/150"}
        alt="Hình đại diện người dùng"
        className="w-32 h-32 rounded-full mx-auto"
      />
      <h2 className="text-center text-2xl mt-4">{userData.username}</h2>
      <p className="text-center">{userData.emailAddress}</p>
      <p className="text-center">Ngày sinh: {userData.birthDay}</p>

      <button
        onClick={handleUpdateClick}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors mt-4"
      >
        Cập nhật
      </button>
    </div>
  );
};

export default UserProfile;
