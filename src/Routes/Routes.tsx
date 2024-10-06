import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import ProductPage from "../Pages/ProductPage/ProductList";
import CompanyPage from "../Pages/CompanyPage/CompanyPage";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "product", element: <ProductList /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "product/update/:id", element: <ProductUpdate/>},
      { path: "product/add", element: <ProductAdd/>},
      { path: "cart" , element: <Cart/>},
      { path: "category", element: <CategoryList/> },
      { path: "user", element: <UserList/> },
      { path: "checkout", element: <Checkout/> },
      { path: "history-orders", element: <HistoryOrders/> },
      { path: "user/update/:name", element: <UserUpdate/>},
      { path:"change-password", element: <ChangePassword/>},
      { path:"profile/:username", element: <UserProfile/>},
    {
        path: "search",
        element: (
            <SearchPage />
        ),
      }, 
      //{ path: "design-guide", element: <DesignGuide /> },
      {
        path: "company/:ticker",
        element: (
          <ProtectedRoute>
            <CompanyPage />
          </ProtectedRoute>
        ),
        children: [
          { path: "company-profile", element: <CompanyProfile /> },
          { path: "income-statement", element: <IncomeStatement /> },
          { path: "balance-sheet", element: <BalanceSheet /> },
          { path: "cashflow-statement", element: <CashflowStatement /> },
          { path: "historical-dividend", element: <HistoricalDividend /> },
        ],
      }, 
    ],
  },
]);
