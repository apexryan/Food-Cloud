import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import {
  Restaurant,
  VolunteerActivism,
  Business,
  AdminPanelSettings,
  ArrowForward,
} from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Restaurant sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Food Donations",
      description:
        "Share surplus food with those in need. Reduce waste and help your community.",
    },
    {
      icon: <VolunteerActivism sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Volunteer Network",
      description:
        "Connect with volunteers who can help distribute food to those who need it most.",
    },
    {
      icon: <Business sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "NGO Partnerships",
      description:
        "Work with NGOs to ensure food reaches the most vulnerable populations.",
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Admin Management",
      description:
        "Comprehensive admin tools to manage users, food posts, and system operations.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.800",
          color: "white",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,.3)",
          }}
        />
        <Container maxWidth="xl">
          <Box
            sx={{
              position: "relative",
              py: { xs: 8, md: 12 },
              px: { xs: 2, md: 4 },
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
            >
              FoodCloud
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Connecting food donors with those in need. Together we can reduce
              food waste and help communities thrive.
            </Typography>
            <Box sx={{ mt: 4 }}>
              {!isAuthenticated ? (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/register")}
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/food")}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Browse Food Posts
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/food")}
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    View Food Posts
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/create-food")}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Create Food Post
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{ mb: 4 }}
        >
          How It Works
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h6" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Paper sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Make a Difference?
            </Typography>
            <Typography variant="h6" paragraph>
              Join our community of food donors, volunteers, and NGOs working
              together to reduce food waste and help those in need.
            </Typography>
            <Box sx={{ mt: 3 }}>
              {!isAuthenticated ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Join Now
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Go to Dashboard
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home;
