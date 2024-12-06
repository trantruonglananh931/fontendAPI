import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../../Context/useAuth';
import { useForm } from 'react-hook-form';
import Navbar from "../../Components/Navbar/Navbar";

type Props = {};

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required('Tên đăng nhập là bắt buộc'),
  password: Yup.string().required('Mật khẩu là bắt buộc'),
});

const LoginPage = (props: Props) => {
  const { loginUser, loginWithGoogle } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (form: LoginFormsInputs) => {
    loginUser(form.userName, form.password);
  };

  return (
    <div className="w-full">
      <Navbar />
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="p-6 space-y-2 sm:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Đăng nhập
            </h1>
            
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Tên đăng nhập"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  {...register('userName')}
                />
                {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <div className="mt-4">
                <a
                  href="/forgot-password"
                  className="text-xs text-gray-500 hover:text-green-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition duration-200"
              >
                Đăng nhập
              </button>

              <div className="w-full border-t my-4">
                <p className="text-center text-gray-500 dark:text-gray-400">Hoặc</p>
              </div>

              <div className="mt-2 text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Bạn chưa có tài khoản? </span>
                <a
                  href="/register"
                  className="text-sm font-semibold text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                  Đăng ký
                </a>
              </div>
            </form>
            <div className="flex space-x-4 text-sm">
                <button
                  onClick={loginWithGoogle}
                  className="w-1/2 h-10 border-2 border-gray-800 rounded-full font-semibold text-gray-800 hover:bg-gray-800 hover:text-white transition duration-200"
                >
                  Đăng nhập với Google
                </button>
                <button
                  /* onClick={loginWithFacebook} */
                  className="w-1/2 h-10 border-2 border-blue-600 rounded-full font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200"
                >
                  Đăng nhập với Facebook
                </button>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
