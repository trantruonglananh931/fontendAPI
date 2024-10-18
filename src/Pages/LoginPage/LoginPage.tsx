import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../Context/useAuth';
import { useForm } from 'react-hook-form';

type Props = {};

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = (props: Props) => {
  const { loginUser, loginWithGoogle } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    loginUser(form.userName, form.password);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mb-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  {...register('userName')}
                />
                {errors.userName && <p className="text-red-500">{errors.userName.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700"
                  {...register('password')}
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                className="w-2/5 font-bold h-10 border-2 rounded-full bg-yellow-500 hover:text-white"
              >
                Sign in
              </button>
              <div className="w-full border text-center my-4">
                <p>Or</p>
              </div>
              <button
                onClick={loginWithGoogle}
                className="w-2/5 border-2 border-solid rounded-full border-gray-800"
              >
                Google
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
