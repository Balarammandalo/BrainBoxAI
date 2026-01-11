import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPlan from "./pages/MyPlan";

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/my-plan" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/my-plan" replace /> : <Signup />}
        />
        <Route
          path="/my-plan"
          element={
            <RequireAuth>
              <MyPlan />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageShell>
  );
}
