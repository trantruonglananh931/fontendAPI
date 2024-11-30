import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(120); // 2 phút
  const navigate = useNavigate(); // Khai báo hook useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/Mail", { emailToId: email });
      if (response.data.status) {
      /*   setMessage("Mã OTP đã được gửi đến email của bạn."); */
        setIsOtpSent(true);
        startCountdown();
      } else {
        setMessage(response.data.message);
      }
    } catch {
      setMessage("Đã xảy ra lỗi khi gửi mã OTP.");
    }
  };

  const startCountdown = () => {
    setCountdown(120); // Reset countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0; // Dừng lại khi đếm ngược về 0
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    // Gửi lại mã OTP
    try {
      const response = await axios.post("/Mail", { emailToId: email });
      if (response.data.status) {
        setMessage("Mã OTP đã được gửi lại đến email của bạn.");
        startCountdown(); // Bắt đầu lại đồng hồ đếm ngược
      } else {
        setMessage(response.data.message);
      }
    } catch {
      setMessage("Đã xảy ra lỗi khi gửi lại mã OTP.");
    }
  };

  const handleCancel = () => {
    navigate("/login"); 
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`/Mail/verifyCode?code=${otp}&email=${email}`);
      if (response.data.status) {
        const token = response.data.data.result; 
        navigate("/reset-password", { state: { email, token } }); 
      } else {
        setMessage("Mã OTP không hợp lệ.");
      }
    } catch {
      setMessage("Đã xảy ra lỗi khi xác minh mã OTP.");
    }
  };

  
  return (
    <div className="w-full">
      <Navbar />
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="p-6 space-y-2 sm:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              {isOtpSent ? "Vui lòng nhập mã OTP đã gửi đến email của bạn." : "Nhập email của bạn"}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isOtpSent} // Không cho phép sửa khi đã gửi mã OTP
                />
              </div>

              {!isOtpSent && (
                <button
                  type="submit"
                  className="w-full h-10 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition duration-200"
                >
                  Gửi mã OTP
                </button>
              )}

              {isOtpSent && (
                <div className="mt-4">
                  <h2 className="text-sm font-medium">Nhập mã OTP của bạn:</h2>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    required
                  />
                  <div className="text-center">
                    <button onClick={handleVerifyOtp} className="w-full mt-2 h-10 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition duration-200">
                      Xác nhận mã OTP
                    </button>
                    <button onClick={handleCancel} className="text-blue-600 hover:underline">
                      Hủy
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    {countdown > 0 ? (
                      <span>Gửi lại mã OTP sau: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                    ) : (
                      <button onClick={handleResendOtp} className="text-red-600 hover:underline">
                        Gửi lại mã OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
            {message && <div className="mt-4 text-center text-red-500">{message}</div>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
