import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MedicationsPage from "./pages/MedicationsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/medications"
          element={
            <ProtectedRoute>
              <MedicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <RoleGuard allowedRoles={["doctor", "patient"]}>
              <PrescriptionsPage />
            </RoleGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;