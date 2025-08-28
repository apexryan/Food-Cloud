import React from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  Restaurant,
  Person,
  AdminPanelSettings,
  VolunteerActivism,
  Business,
} from "@mui/icons-material";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return (
          <AdminPanelSettings sx={{ fontSize: 40, color: "primary.main" }} />
        );
      case "ngo":
        return <Business sx={{ fontSize: 40, color: "primary.main" }} />;
      case "volunteer":
        return (
          <VolunteerActivism sx={{ fontSize: 40, color: "primary.main" }} />
        );
      default:
        return <Person sx={{ fontSize: 40, color: "primary.main" }} />;
    }
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "ngo":
        return "NGO Representative";
      case "volunteer":
        return "Volunteer";
      default:
        return "User";
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            {getRoleIcon(user?.role)}
            <Box ml={2}>
              <Typography variant="h4" component="h1">
                Welcome, {user?.name || "User"}!
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {getRoleTitle(user?.role)} Dashboard
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" paragraph>
            Welcome to FoodCloud - a platform dedicated to reducing food
            waste and helping those in need.
          </Typography>
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Restaurant
                    sx={{ fontSize: 30, color: "primary.main", mr: 2 }}
                  />
                  <Typography variant="h6">Food Posts</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Browse available food donations or create your own food post
                  to help others.
                </Typography>
                <Button variant="contained" href="/food">
                  View Food Posts
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Person sx={{ fontSize: 30, color: "primary.main", mr: 2 }} />
                  <Typography variant="h6">Profile</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage your account settings and profile information.
                </Typography>
                <Button variant="outlined" href="/profile">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Info */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {user?.name || "Not provided"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user?.email || "Not provided"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">
                {getRoleTitle(user?.role)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                {user?.id || "Not available"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Logout Button */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="outlined"
            color="error"
            onClick={logout}
            size="large"
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
