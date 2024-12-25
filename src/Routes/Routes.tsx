import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SearchPage from "../Components/Search/Search";
import CategoryList from "../Pages/Admin/CategoryList";
import LoginPage from "../Pages/Accounts/LoginPage";
import RegisterPage from "../Pages/Accounts/RegisterPage";
import ProductCategoryView from "../Pages/User/Product/ProductCategoryView";
import ProductView from "../Pages/User/Product/ProductView";
import ProductDetail from "../Pages/User/Product/ProductDetail";
import ProductUpdate from "../Pages/Admin/Products/ProductUpdate";
import ProductList from "../Pages/Admin/Products/ProducList";
import ProductAdd from "../Pages/Admin/Products/ProductAdd";
import UserList from "../Pages/Admin/UserList";
import ChangePassword from "../Pages/Accounts/ChagePassword";
import UserUpdate from "../Pages/User/User/UserUpdate";
import Cart from "../Pages/User/Orders/Cart";
import Checkout from "../Pages/User/Orders/Checkout";
import HistoryOrders from "../Pages/User/Orders/HistoryOrders";
import UserProfile from "../Pages/User/User/UserProfile";
import AllOrders from "../Pages/Admin/AllOrders";
import Finance from "../Pages/Admin/Finance";
import Admin from "../Pages/Admin/Admin";
import Winter2024 from "../Components/InformationWeb/winter2024";
import ForgotPassword from "../Pages/Accounts/ForgotPassword";
import ResetPassword from "../Pages/Accounts/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import AIUi from "../Pages/AI/AIUi";
import ProductDetailAdm from "../Pages/Admin/Products/ProductDetailAdm";
import SimilarProductsView from "../Pages/AI/SimilarProductsView";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        { path: "admin", 
          element: (
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          ),
      children: [
        { index: true, element: <Finance /> },
        { path: "productlist", element: <ProductList /> },
        { path : "orders", element: <AllOrders/>},
        { path: "category", element: <CategoryList/>},
        { path: "user", element: <UserList/> },
        { path:"finance", element: <Finance/>},
        { path: "product/update/:id", element: <ProductUpdate/>},
        { path: "product/add", element: <ProductAdd/>},
        { path: "product/:id", element: <ProductDetailAdm /> },
       ],
      },
     
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "/admin/product/:id", element: <ProductDetailAdm /> },
      { path: "", element: <ProductView /> },
      { path: "product", element: <ProductView /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "/similar-products", element: <SimilarProductsView/> },
      { path: "ai1", element: <AIUi/> },
      { path: "cart" , element: <Cart/>},
      { path: "checkout", element: <Checkout/> },
      { path: "history-orders", element: <HistoryOrders/> },
      { path: "user/update/:name", element: <UserUpdate/>},
      { path:"change-password", element: <ChangePassword/>},
      { path:"forgot-password", element: <ForgotPassword/>},
      { path:"reset-password", element: <ResetPassword/>},
      { path:"user/:username", element: <UserProfile/>},
      { path:"category/:categoryId" ,element:<ProductCategoryView />},
      {path:"gioi-thieu", element:<Winter2024/>},
      {path:"tuyen-dung", element:<Winter2024/>},
      {path:"tin-tuc", element:<Winter2024/>},
      {path:"he-thong-cua-hang", element:<Winter2024/>},
    {
        path: "search",
        element: (
            <SearchPage />
        ),
      }, 

      
    ],
  },

]);
