import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";

// Import components
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/Dashboard";
import FoodPosts from "./components/food/FoodPosts";
import CreateFoodPost from "./components/food/CreateFoodPost";
import FoodPostDetail from "./components/food/FoodPostDetail";
import Profile from "./components/Profile";
import Footer from "./components/Footer";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          width: "100%",
          maxWidth: "100% !important",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" style={{ width: "100%", minHeight: "100vh" }}>
            <Navigation />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/food" element={<FoodPosts />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create-food"
                element={
                  <ProtectedRoute>
                    <CreateFoodPost />
                  </ProtectedRoute>
                }
              />

              <Route path="/food/:id" element={<FoodPostDetail />} />

              <Route
                path="/edit-food/:id"
                element={
                  <ProtectedRoute>
                    <CreateFoodPost />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
