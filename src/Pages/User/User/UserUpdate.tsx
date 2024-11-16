import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserInformation } from "../../../Models/User";
import Navbar from "../../../Components/Navbar/Navbar";

const UserUpdate: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInformation>({
    image: "", // Chứa đường dẫn ảnh
    birthDay: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Hàm xử lý thay đổi hình ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("files", files[0]);
      formData.append("isMainImage", "true"); // Đặt thành true nếu là ảnh chính

      // Gửi file đến API backend
      setLoading(true);
      axios
        .post("/v2/api/UploadImages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const uploadedUrl = response.data.urls[0]; // URL của ảnh đã tải lên
          setUserInfo((prev) => ({ ...prev, image: uploadedUrl }));
          setLoading(false);
        })
        .catch((error) => {
          setMessage("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
          setLoading(false);
          console.error(error);
        });
    }
  };

  // Hàm xử lý thay đổi ngày sinh
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, birthDay: e.target.value }));
  };

  // Hàm gửi yêu cầu cập nhật
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
          navigate("/"); // Điều hướng về trang chính sau 1 giây
        }, 1000);
      } else {
        setMessage(response.data.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi trong quá trình cập nhật:", error);
      if (error.response) {
        setMessage(error.response.data.message || "Đã xảy ra lỗi từ máy chủ.");
      } else if (error.request) {
        setMessage("Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.");
      } else {
        setMessage("Gửi yêu cầu không thành công. Vui lòng kiểm tra mạng.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị hình ảnh người dùng nếu đã có
  const renderProfileImage = () => {
    return userInfo.image ? (
      <img
        src={userInfo.image}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover mb-4"
      />
    ) : (
      <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div> // Placeholder
    );
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-5 mb-5">
        <h2 className="text-2xl font-bold mb-4">Cập nhật người dùng</h2>

        {renderProfileImage()} {/* Hiển thị hình đại diện */}

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
