import { Route, Routes } from "react-router-dom";
import Login from "../../features/user/login/Presentation/pages/Login";

export function RoutesAccessibleWithoutAuth() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div>Register</div>} />
      <Route path="/forgot-password" element={<div>Forgot Password</div>} />
      {
      //<Route path="/" element={<LandingPage/>} />
      }
    </Routes>
  )
}