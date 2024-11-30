import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { email, token } = location.state as { email: string; token: string };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const resetResponse = await axios.put("/Mail/ForGotPassWord", {
        emailUser: email,
        token: token,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (resetResponse.data.status) {
        alert("Thay đổi mật khẩu thành công. Mời bạn đăng nhập lại.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(resetResponse.data.message);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      setMessage("Đã xảy ra lỗi khi đặt lại mật khẩu.");
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="p-6 space-y-2 sm:p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Đặt lại mật khẩu
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4 relative">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="newPassword">Mật khẩu mới:</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute mt-3 right-2 top-1/2 transform -translate-y-1/2 flex items-center"
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <div className="mb-4 relative">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute mt-3 right-2 top-1/2 transform -translate-y-1/2 flex items-center"
                >
                  <FontAwesomeIcon icon={showConfirmNewPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <button type="submit" className="w-full h-10 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition duration-200">
                Đặt lại mật khẩu
              </button>
            </form>
            {message && <div className="mt-4 text-center text-red-500">{message}</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;
