import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import ProductPage from "../Pages/ProductPage/ProductList";
import SearchPage from "../Pages/SearchPage/SearchPage";
import CompanyProfile from "../Components/CompanyProfile/CompanyProfile";
import IncomeStatement from "../Components/IncomeStatement/IncomeStatement";
//import DesignGuide from "../Pages/DesignGuide/DesignGuide";
import CategoryList from "../Pages/CategoryPage/CategoryList";

import BalanceSheet from "../Components/BalanceSheet/BalanceSheet";
import HistoricalDividend from "../Components/HistoricalDividend/HistoricalDividend";
import CashflowStatement from "../Components/CashflowStatement/CashflowStatement"; 
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ProductList from "../Pages/ProductPage/ProductList";
import ProductDetail from "../Pages/ProductPage/ProductDetail";
import ProductUpdate from "../Pages/ProductPage/ProductUpdate";
import ProductAdd from "../Pages/ProductPage/ProductAdd";
import UserList from "../Pages/UserPage/UserList";
import ChangePassword from "../Pages/UserPage/ChagePassword";
import UserUpdate from "../Pages/UserPage/UserUpdate";
import Cart from "../Pages/ProductPage/Cart";
import Checkout from "../Pages/ProductPage/Checkout";
import HistoryOrders from "../Pages/OrderPage/HistoryOrders";
import UserProfile from "../Pages/UserPage/UserProfile";
import AllHistoryOrders from "../Pages/OrderPage/AllHistoryOrders";
import Finance from "../Pages/FinancePage/Finance";
import Admin from "../Pages/AdminPage/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    
      { path: "admin", element: <Admin /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "", element: <ProductList /> },
      { path: "product", element: <ProductList /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "product/update/:id", element: <ProductUpdate/>},
      { path: "product/add", element: <ProductAdd/>},
      { path: "cart" , element: <Cart/>},
      { path: "category", element: <CategoryList/> },
      { path: "user", element: <UserList/> },
      { path : "allorders", element: <AllHistoryOrders/>},
      { path: "checkout", element: <Checkout/> },
      { path: "history-orders", element: <HistoryOrders/> },
      { path: "user/update/:name", element: <UserUpdate/>},
      { path:"change-password", element: <ChangePassword/>},
      { path:"user/:username", element: <UserProfile/>},
      { path:"finance", element: <Finance/>},
    {
        path: "search",
        element: (
            <SearchPage />
        ),
      }, 
      //{ path: "design-guide", element: <DesignGuide /> },
      
    ],
  },
]);
