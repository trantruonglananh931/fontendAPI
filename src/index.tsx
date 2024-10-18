import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { router } from "./Routes/Routes";

// Tạo root để render ứng dụng
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Thêm GoogleOAuthProvider và truyền vào clientId
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="439897666887-f83oja1bcobqc1nuju7h2phaofk4f8m6.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Đo hiệu năng ứng dụng nếu cần
reportWebVitals();
