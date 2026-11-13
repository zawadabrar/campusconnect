import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Notices from "./pages/Notices";
import Events from "./pages/Events";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";

export default function App() {
  return <AuthProvider><Routes>
    <Route path="/login" element={<Login/>}/>
    <Route element={<ProtectedRoute/>}>
      <Route element={<Layout/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/students" element={<Students/>}/>
        <Route path="/students/:id" element={<StudentProfile/>}/>
        <Route path="/notices" element={<Notices/>}/>
        <Route path="/events" element={<Events/>}/>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
  </Routes></AuthProvider>;
}
