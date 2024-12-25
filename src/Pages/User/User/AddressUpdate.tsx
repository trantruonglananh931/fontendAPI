import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
interface UserInformation {
  phone: string;
  address: string;
}

const AddressUpdate: React.FC = () => {
     const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInformation>({
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Vui lòng đăng nhập để tiếp tục.");
          return;
        }

        const response = await axios.get("/v3/api/user/GetCurrentUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          const data = response.data.data;

          setUserInfo({
            phone: data.phone || "",
            address: data.address || "",
          });
        } else {
          setMessage("Không thể tải thông tin người dùng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setMessage("Đã xảy ra lỗi khi lấy thông tin người dùng.");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);

    const { phone, address } = userInfo;

    if (!phone || !address) {
      setMessage("Vui lòng điền tất cả các trường.");
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setMessage("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
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
        { phone, address },
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
          navigate(-1);
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

  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-sm mt-5 mb-5">
        <h2 className="text-2xl font-sans mb-4">Cập nhật địa chỉ và số điện thoại</h2>

        {/* Địa chỉ */}
        <div className="mb-4">
          <label className="block text-lg mb-1">Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={userInfo.address}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập địa chỉ"
            disabled={loading}
          />
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label className="block text-lg mb-1">Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập số điện thoại"
            disabled={loading}
          />
        </div>

        {/* Nút cập nhật */}
        <button
          onClick={handleUpdate}
          className={`w-full px-4 py-2 rounded-md shadow-md transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          } text-white`}
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>

        {message && (
          <p
            className={`text-center mt-4 ${
              message.includes("thành công") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddressUpdate;
