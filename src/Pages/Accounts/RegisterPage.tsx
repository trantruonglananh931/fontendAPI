import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type Props = {};

type RegisterFormsInputs = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  nameOfUser: string;
  registerWithGoogle?: boolean;
};

const validation = Yup.object().shape({
  userName: Yup.string().required("Tên người dùng là bắt buộc"),
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(12, "Mật khẩu phải có ít nhất 12 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ in hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất một chữ thường")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất một chữ số")
    .matches(/[@$!%*?&#]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt"),
  confirmPassword: Yup.string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu nhập lại không khớp"),
  nameOfUser: Yup.string().required("Tên đầy đủ là bắt buộc"),
  registerWithGoogle: Yup.boolean(),
});


const RegisterPage = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { loginWithGoogle } = useAuth();
  const emailFromGoogle = location.state?.email || "";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({
    resolver: yupResolver(validation),
    defaultValues: {
      email: emailFromGoogle || "",
      registerWithGoogle: false,
    },
  });

  const navigate = useNavigate();

  const handleRegister = async (form: RegisterFormsInputs) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post("/v1/account/register", {
        username: form.userName,
        emailAddress: form.email,
        password: form.password,
        nameOfUser: form.nameOfUser,
        registerWithGoogle: form.registerWithGoogle,
      });

      if (response.data) {
        alert("Đăng ký thành công, mời bạn đăng nhập!");
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage("Đăng ký không thành công. Vui lòng thử lại.");
      console.error("Lỗi trong quá trình đăng ký:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Navbar />
      <section className="bg-gray-50 dark:bg-gray-900 ">
        <div className="mt-8 flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mb-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 space-y-2 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Đăng ký
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(handleRegister)}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Tên người dùng"
                    {...register("userName")}
                  />
                  {errors.userName && (
                    <p className="text-red-500">{errors.userName.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="nameOfUser"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="nameOfUser"
                    placeholder="Tên đầy đủ"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("nameOfUser")}
                  />
                  {errors.nameOfUser && (
                    <p className="text-red-500">{errors.nameOfUser.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email"
                    {...register("email")}
                    readOnly={!!emailFromGoogle}
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Nhập lại mật khẩu */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEye : faEyeSlash}
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {errorMessage && (
                  <p className="text-red-500">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  className="w-full h-10 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition duration-200"
                >
                  Đăng ký
                </button>
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Bạn đã có tài khoản? </span>
                  <a
                    href="/login"
                    className="text-sm font-semibold text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Đăng nhập
                  </a>
                </div>

                <div className="w-full border-t my-4">
                  <p className="text-center text-gray-500 dark:text-gray-400">Hoặc</p>
                </div>

                
              </form>
              <div className="flex space-x-2 text-sm">
                  <button
                    onClick={loginWithGoogle}
                    className="w-full h-10 border-2 border-gray-800 rounded-full font-semibold text-gray-800 hover:bg-gray-800 hover:text-white transition duration-200"
                  >
                    Đăng ký với Google
                  </button>
                  {/* <button
                    onClick={WithFacebook}
                    className="w-1/2 h-10 border-2 border-blue-600 rounded-full font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200"
                  >
                    Đăng ký với Facebook
                  </button> */}
                </div>

                
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
