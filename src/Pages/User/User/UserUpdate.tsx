import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Components/Navbar/Navbar";
import { LoadScript, Autocomplete, Libraries } from "@react-google-maps/api";

interface UserInformation {
  phone: string;
  address: string;
  image: string;
  birthDay: string;
}

const libraries: Libraries = ["places"]; 

const UserUpdate: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInformation>({
    phone: "",
    address: "",
    image: "",
    birthDay: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
            image: data.image || "",
            birthDay: data.birthDay ? data.birthDay.split("T")[0] : "", 
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setMessage("Vui lòng chọn một tệp hình ảnh.");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage("Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append("files", file);

      const apiUrl = "/v2/api/images?isUserAvatar=true";

      setLoading(true);
      axios
        .post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const uploadedUrl = response.data.urls[0];
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prev) => ({ ...prev, birthDay: e.target.value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setUserInfo((prev) => ({
          ...prev,
          address: place.formatted_address || "", 
        }));
      }
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);

    const { phone, address, image, birthDay } = userInfo;

    if (!phone || !address || !image || !birthDay) {
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
        {
          phone,
          address,
          image,
          birthDay,
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

  const renderProfileImage = () => {
    return userInfo.image ? (
      <img
        src={`http://localhost:5152${userInfo.image}`}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover mb-4"
      />
    ) : (
      <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
    );
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-sm mt-5 mb-5">
        <h2 className="text-2xl font-sans mb-4">Thông tin người dùng</h2>

        {/* Ảnh hồ sơ */}
        <div className="flex items-center gap-8 mb-4">
          {renderProfileImage()}
          <div className="flex-1">
            <label className="block text-lg mb-1">Chọn hình ảnh hồ sơ:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>
        </div>

        <div className="col-span-2 mb-2">
          <label className="block text-lg mb-1">Địa chỉ:</label>
          <input
                type="text"
                name="address"
                value={userInfo.address || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nhập địa chỉ"
                disabled={loading}
              />
         {/*  <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
            libraries={libraries}
          >
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={handlePlaceSelect}
            >
              //input
            </Autocomplete>
          </LoadScript> */}
        </div>

        {/* Các trường thông tin */}
        <div className="grid grid-cols-2 mt-6 gap-4 mb-6">
          <div>
            <label className="block text-lg mb-1">Ngày sinh:</label>
            <input
              type="date"
              name="birthDay"
              value={userInfo.birthDay || ""}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-lg mb-1">Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={userInfo.phone || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập số điện thoại"
              disabled={loading}
            />
          </div>
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

export default UserUpdate;
