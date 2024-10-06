import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Sử dụng useParams để lấy username từ URL

type User = {
  username: string;
  emailAddress: string;
  password: string; // Mật khẩu đã mã hóa
};

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>(); // Lấy username từ URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  // Hàm để gọi API lấy thông tin user từ server
  const fetchUserProfile = async (username: string) => {
    try {
      console.log("Fetching user profile for:", username); // Log để kiểm tra giá trị username
      const response = await axios.get(`/v3/api/user/${username}`);
      console.log("API Response:", response); // Log phản hồi từ API

      if (response.data.status) {
        setUser(response.data.data); // Lưu thông tin user vào state
      } else {
        setError(response.data.message || "Failed to get user info");
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error.response || error.message); // Log chi tiết lỗi
      setError("Failed to fetch user profile. Please try again.");
    } finally {
      setLoading(false); // Kết thúc quá trình tải
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserProfile(username); // Gọi hàm fetch khi username có giá trị
    } else {
      console.log("No username found in URL.");
      setError("Username not provided.");
      setLoading(false);
    }
  }, [username]);

  // Xử lý khi dữ liệu đang được tải
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Xử lý khi có lỗi
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      {user ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Username:</h2>
            <p>{user.username}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Email Address:</h2>
            <p>{user.emailAddress}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Password (encrypted):</h2>
            <p>**************</p> {/* Hiển thị mật khẩu đã mã hóa dưới dạng ẩn */}
          </div>
        </div>
      ) : (
        <p className="text-center">User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
