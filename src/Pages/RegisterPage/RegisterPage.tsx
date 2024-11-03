import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Props = {};

type RegisterFormsInputs = {
  userName: string;
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required("Tên người dùng là bắt buộc"),
  email: Yup.string().email("Địa chỉ email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string().required("Mật khẩu là bắt buộc"),
});

const RegisterPage = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });
  const navigate = useNavigate();

  const handleRegister = async (form: RegisterFormsInputs) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post("/v1/account/register", {
        username: form.userName,
        emailAddress: form.email,
        password: form.password,
      });

      if (response.data) {
        alert("Đăng ký thành công!");
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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mb-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Đăng ký tài khoản của bạn
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
                  Tên người dùng
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
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              {errorMessage && (
                <p className="text-red-500">{errorMessage}</p>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-2/5 font-bold h-10 border-2 rounded-full bg-yellow-500 hover:text-white hover:border-1 active:bg-blue-700 focus:outline-none focus:ring focus:ring-violet-300"
                  disabled={loading}
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </div>

              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                Bạn đã có tài khoản?{" "}
                <a
                  href="/login"
                  className="not-italic text-primary-600 hover:underline dark:text-primary-500"
                >
                  Đăng nhập
                </a>
              </p>
              <div className="w-full border text-center">
                <p>Hoặc</p>
              </div>
              <div className="flex justify-around">
                <button className="border-2 border-solid rounded-full border-gray-800 w-2/5">
                  <p className="mx-3">Facebook</p>
                </button>
                <button className="border-2 border-solid rounded-full border-gray-800 w-2/5">
                  <p className="mx-3">Google</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
