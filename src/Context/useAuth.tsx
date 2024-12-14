import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (
    username: string,
    email: string,
    password: string,
    nameOfUser: string,
    registerWithGoogle: boolean
  ) => Promise<void>;
  loginUser: (username: string, password: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
  
      if (user && token) {
        const parsedUser = JSON.parse(user);
        setUser(parsedUser);
        setToken(token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setIsReady(true);
  }, []);


  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );
  
        const userProfile = res.data;
  
        const emailCheckResponse = await axios.post('/v1/account/check-email', {
          email: userProfile.email,
        });
  
        if (emailCheckResponse.data.exists) {
          const loginResponse = await axios.post('/v1/account/google-login', {
            email: userProfile.email,
            nameOfUser: userProfile.name,
          });
  
          if (loginResponse.data.token) {
            localStorage.setItem("token", loginResponse.data.token);
            const userObj = {
              userName: loginResponse.data.username,
              email: loginResponse.data.emailAddress,
              token: loginResponse.data.token,
              role: loginResponse.data.role,
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            setUser(userObj);
            setToken(loginResponse.data.token);
            toast.success("Đăng nhập với Google thành công!");
            
            navigate('/product');
          }
        } else {
          const registerPayload = {
            username: userProfile.name,
            emailAddress: userProfile.email,
            password: null, 
            nameOfUser: userProfile.name,
            resigterWithgoogle: true,
          };
  
          const registerResponse = await registerAPI(registerPayload);

          if (registerResponse?.data?.token) {
            const userObj = {
              userName: registerResponse.data.userName,
              email: registerResponse.data.email,
              token: registerResponse.data.token,
              role: registerResponse.data.role,
            };
            localStorage.setItem("token", registerResponse.data.token);
            localStorage.setItem("user", JSON.stringify(userObj));

            setUser(userObj);
            setToken(registerResponse.data.token);
            toast.success("Đăng ký với Google thành công!");
            
            navigate('/product');
          }
        }
      } catch (err) {
        console.error("Đăng nhập với Google thất bại:", err);
        toast.error("Google Login Failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      toast.error("Google Login Failed");
    },
  });
  
  const registerUser = async (
    username: string,
    email: string,
    password: string,
    nameOfUser: string,
    registerWithGoogle: boolean
  ) => {
    const payload = {
      username,
      emailAddress: email,
      password,
      nameOfUser,
      resigterWithgoogle: registerWithGoogle,
    };
  
    await registerAPI(payload)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
  
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
            token: res?.data.token,
            role: res?.data.role,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Đăng ký thành công, mời bạn đăng nhập lại");
          navigate("");
        }
      })
      .catch((e) => toast.warning("Lỗi"));
  };
  

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
            token : res?.data.token,
            role: res?.data.role,  
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Đăng nhập thành công!");
          if (res?.data.role === "Admin") {
            navigate("/admin");
          } else if (res?.data.role === "User") {
            navigate("/product");
          }
        }
      })
      .catch((e) => toast.warning("Lỗi máy chủ. Vui lòng thử lại."));
  };
  
  const isLoggedIn = () => {
    return !!user;
  }

  const logout = () => {
    googleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/login");
  };


  

  return (
    <UserContext.Provider
      value={{ loginUser, loginWithGoogle, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);