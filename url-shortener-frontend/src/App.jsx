import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/auth/LoginPage";
import Navbar from "./components/common/Navbar";
import RegisterPage from "./components/auth/RegisterPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AnalyticsPage from "./components/dashboard/AnalyticsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />
      <Routes>
        {/* Public routes (Pages anyone can access) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes (Pages accessible only to logged-in users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/analytics/:id" element={<AnalyticsPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
