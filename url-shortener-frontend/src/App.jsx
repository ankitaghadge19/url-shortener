import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./components/RegisterPage";
import DashboardLayout from "./components/Dashboard/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
