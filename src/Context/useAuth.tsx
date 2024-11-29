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
  registerUser: ( username: string, email: string, password: string) => void;
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
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
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
              Accept: 'application/json',
            },
          }
        );
  
        const userProfile = res.data;
        setUser(userProfile);
  
        // Tạm thời giả lập phản hồi từ backend
        const backendResponse = {
          success: true,
          token: "fake_token", 
          user: {
            userName: userProfile.name,
            email: userProfile.email,
            token : userProfile.token,
            role: userProfile.role, 
          },
        };
  
        if (backendResponse.success) {
          
          localStorage.setItem("token", backendResponse.token);
          localStorage.setItem("user", JSON.stringify(backendResponse.user));
  
          
          setToken(backendResponse.token);
          setUser(backendResponse.user);
  
          // Chuyển hướng đến trang /product
          navigate('/product');
        } else {
          toast.error("Login failed. Please try again.");
        }
        
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        toast.error("Login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      toast.error("Google Login Failed");
    },
  });
  

  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    await registerAPI(username, email, password)
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
          console.log("User Object:", userObj);
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login Success!");
          navigate("");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          // Save the token and user details including the role
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
            token : res?.data.token,
            role: res?.data.role,  
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          
          // Update state with the user details and token
          setToken(res?.data.token!);
          setUser(userObj!);
          
          toast.success("Login Success!");
  
          // Redirect based on role
          if (res?.data.role === "Admin") {
            navigate("/admin");
          } else if (res?.data.role === "User") {
            navigate("/product");
          }
        }
      })
      .catch((e) => toast.warning("Server error occurred"));
  };
  

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
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