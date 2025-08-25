import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  Restaurant,
  Person,
  AdminPanelSettings,
  Business,
  VolunteerActivism,
  Logout,
  AccountCircle,
} from "@mui/icons-material";
// Removed RazorpayDonation
import ChatDialog from "./Chat/ChatDialog";
import apiService from "../services/apiService";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRzpReady, setIsRzpReady] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/login");
  };

  // Load Razorpay script once
  React.useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      setIsRzpReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRzpReady(true);
    script.onerror = () => setIsRzpReady(false);
    document.body.appendChild(script);
  }, []);

  const openRazorpayCheckout = async (amountInRupees = 199) => {
    try {
      const amountInPaise = Math.max(1, Math.floor(amountInRupees * 100));
      if (!isRzpReady || typeof window.Razorpay === "undefined") {
        alert("Payment service not ready. Please wait a moment and try again.");
        return;
      }

      // Get public key from server and create order using secret on backend
      const cfg = await apiService.getRazorpayConfig();
      const keyId = cfg?.config?.key;
      if (!keyId) {
        alert("Payment configuration missing on server.");
        return;
      }

      const orderRes = await apiService.createRazorpayOrder(
        amountInPaise,
        "INR"
      );
      if (!orderRes?.success) {
        alert("Failed to create payment order. Try again.");
        return;
      }

      const options = {
        key: keyId,
        amount: amountInPaise,
        currency: "INR",
        name: "FoodCloud Connect",
        description: "Support our platform",
        image: "/vite.svg",
        order_id: orderRes.order?.id,
        handler: function (response) {
          alert(
            `Payment successful! Payment ID: ${response.razorpay_payment_id}`
          );
          navigate("/dashboard");
        },
        prefill: {
          name: user?.name || "Subhojit Santra",
          email: user?.email || "raj@example.com",
        },
        notes: {
          purpose: "Donation/Support",
        },
        theme: {
          color: "#1976d2",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Payment initialization failed. Check server keys and try again.");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <AdminPanelSettings />;
      case "ngo":
        return <Business />;
      case "volunteer":
        return <VolunteerActivism />;
      default:
        return <Person />;
    }
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "ngo":
        return "NGO";
      case "volunteer":
        return "Volunteer";
      default:
        return "User";
    }
  };

  const navItems = [
    { text: "Home", path: "/", icon: <Home /> },
    { text: "Food Posts", path: "/food", icon: <Restaurant /> },
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" color="primary">
          FoodCloud Connect
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem>
          <ChatDialog />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ width: "100%" }}>
        <Toolbar sx={{ width: "100%" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            FoodCloud Connect
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor:
                      location.pathname === item.path
                        ? "rgba(255, 255, 255, 0.1)"
                        : "transparent",
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ChatDialog />
            <Button
              color="inherit"
              onClick={() => openRazorpayCheckout(199)}
              disabled={!isRzpReady}
              sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
            >
              Donate
            </Button>
            {isAuthenticated ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getRoleIcon(user?.role)}
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    {getRoleTitle(user?.role)}
                  </Typography>
                </Box>
                <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      handleProfileMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleProfileMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/register")}
                  sx={{ color: "white" }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
