import React, { useState } from "react";  
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { UserInformation } from "../../../Models/User";
import Navbar from "../../../Components/Navbar/Navbar";
const UserUpdate: React.FC = () => {
  const navigate = useNavigate(); 
  const [userInfo, setUserInfo] = useState<UserInformation>({
    image: "",
    birthDay: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const filePath = `/images/avtUser/${file.name}`; 
      setUserInfo((prev) => ({ ...prev, image: filePath }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, birthDay: e.target.value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);

    if (!userInfo.image || !userInfo.birthDay) {
      setMessage("Vui lòng điền tất cả các trường.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setMessage("Thiếu token. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        "/v3/api/user",
        {
          image: userInfo.image, 
          birthDay: userInfo.birthDay, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setMessage("Cập nhật thành công");
        setTimeout(() => {
          navigate("/"); 
        }, 1000); 
      } else {
        setMessage(response.data.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi trong quá trình cập nhật:", error);
      if (error.response) {
        console.error("Dữ liệu phản hồi:", error.response.data);
        setMessage(error.response.data.message || "Đã xảy ra lỗi từ máy chủ.");
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
        setMessage("Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.");
      } else {
        console.error("Lỗi khi thiết lập yêu cầu:", error.message);
        setMessage("Gửi yêu cầu không thành công. Vui lòng kiểm tra mạng.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
        <Navbar/>
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-5 mb-5">
      <h2 className="text-2xl font-bold mb-4">Cập nhật người dùng</h2>

      <div className="mb-4">
        <label className="block text-lg mb-1">Chọn hình ảnh hồ sơ:</label>
        <input
          type="file"
          accept="image/*" 
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-1">Ngày sinh:</label>
        <input
          type="date"
          name="birthDay"
          value={userInfo.birthDay}
          onChange={handleDateChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? "Đang cập nhật..." : "Cập nhật"}
      </button>

      {message && <p className="text-center mt-4 text-red-500">{message}</p>}
    </div>
    
    </div>
  );
};

export default UserUpdate;
