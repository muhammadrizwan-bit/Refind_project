
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import LogIn from "../src/pages/LogIn";
import Signup from "../src/pages/Signup";
import Profile from "../src/pages/Profile";
import Home from "./components/Home";
import ReportLost from "./pages/ReportLost";
import BrowseItems from "./pages/BrowseItems";
import ReportFound from "../src/pages/BrowseItems";

// Protect private pages
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-blue-600 font-semibold">
          Loading your account...
        </p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-blue-600 font-semibold">
          Loading ReFind...
        </p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<Signup />} />

      {/* Browse Items */}
      <Route path="/browse" element={<BrowseItems />} />

      {/* Report Lost */}
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportLost />
          </ProtectedRoute>
        }
      />

      {/* Report Found */}
      <Route
        path="/report-found"
        element={
          <ProtectedRoute>
            <ReportFound />
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Invalid URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
