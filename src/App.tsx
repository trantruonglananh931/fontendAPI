import { Outlet } from "react-router";
import Navbar from "./Components/Navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";
import Footer from "./Footer/Footer";

function App() {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Outlet />
        <ToastContainer />
        <Footer/>
      </UserProvider>
    </>
  );
}

export default App;
