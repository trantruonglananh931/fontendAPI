import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../Components/Navbar/Navbar";
const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await axios.put("/v3/api/user/ChangePassWord", {
        oldPassword,
        newPassword,
        confirmNewPassword,
      });

      setMessage(response.data.message);

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      setMessage("Thay đổi mật khẩu không thành công.");
    }
  };

  return (
    <div className="w-full">
      <Navbar/>
    
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Đổi Mật Khẩu</h1>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <label className="block mb-1">Mật Khẩu Cũ</label>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/4 flex items-center"
            >
              <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="relative">
            <label className="block mb-1">Mật Khẩu Mới</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/4 flex items-center"
            >
              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="relative">
            <label className="block mb-1">Xác Nhận Mật Khẩu Mới</label>
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/4 flex items-center"
            >
              <FontAwesomeIcon icon={showConfirmNewPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Đổi Mật Khẩu
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </div>
    </div>
    </div>
  );
};

export default ChangePassword;
