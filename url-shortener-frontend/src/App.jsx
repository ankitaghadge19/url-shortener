import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/common/Footer";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/auth/LoginPage";
import Navbar from "./components/common/Navbar";
import RegisterPage from "./components/auth/RegisterPage";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import AnalyticsPage from "./components/dashboard/AnalyticsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/analytics/:id" element={<AnalyticsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
