import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack,
  LocationOn,
  AccessTime,
  Restaurant,
  Person,
  Phone,
  Email,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";

const FoodPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [foodPost, setFoodPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    foodId: null,
    foodTitle: "",
  });

  useEffect(() => {
    fetchFoodPost();
  }, [id]);

  const fetchFoodPost = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFoodPostById(id);
      setFoodPost(response.foodPost);
    } catch (error) {
      setError(error.message || "Failed to fetch food post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteFoodPost(deleteDialog.foodId);
      setDeleteDialog({ open: false, foodId: null, foodTitle: "" });
      navigate("/food");
    } catch (error) {
      setError(error.message || "Failed to delete food post");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFoodTypeLabel = (type) => {
    const labels = {
      prepared_food: "Prepared Food",
      raw_ingridients: "Raw Ingredients",
      packaged_food: "Packaged Food",
      beverages: "Beverages",
      other: "Other",
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "success",
      unavailable: "error",
      accepted: "warning",
      picked_up: "info",
      delivered: "success",
      canceled: "error",
    };
    return colors[status] || "default";
  };

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!foodPost) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Food post not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate("/food")} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {foodPost.title}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              {/* Images */}
              {foodPost.images && foodPost.images.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="400"
                      image={foodPost.images[0].url}
                      alt={foodPost.title}
                      sx={{ objectFit: "cover" }}
                    />
                  </Card>
                </Box>
              )}

              {/* Description */}
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {foodPost.description || "No description provided"}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Food Details */}
              <Typography variant="h6" gutterBottom>
                Food Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Food Type
                  </Typography>
                  <Chip
                    label={getFoodTypeLabel(foodPost.foodtype)}
                    icon={<Restaurant />}
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body1">{foodPost.quantity}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={foodPost.status}
                    color={getStatusColor(foodPost.status)}
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pickup Preference
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {foodPost.pickupTimePreference}
                  </Typography>
                </Grid>
              </Grid>

              {/* Dietary Information */}
              {(foodPost.isVegetarian || foodPost.isVegan) && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Dietary Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {foodPost.isVegetarian && (
                      <Chip label="Vegetarian" color="success" sx={{ mr: 1 }} />
                    )}
                    {foodPost.isVegan && <Chip label="Vegan" color="success" />}
                  </Box>
                </>
              )}

              {/* Allergen Information */}
              {foodPost.allergenInfo && foodPost.allergenInfo.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Allergen Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {foodPost.allergenInfo.map((allergen, index) => (
                      <Chip
                        key={index}
                        label={allergen}
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </>
              )}

              {/* Special Instructions */}
              {foodPost.specialInstructions && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Special Instructions
                  </Typography>
                  <Typography variant="body1">
                    {foodPost.specialInstructions}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              {/* Location */}
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  gutterBottom
                >
                  <LocationOn sx={{ fontSize: 16, mr: 1 }} />
                  {foodPost.location?.address}
                </Typography>
                {foodPost.location?.city && (
                  <Typography variant="body2" color="text.secondary">
                    {foodPost.location.city}
                    {foodPost.location.state && `, ${foodPost.location.state}`}
                    {foodPost.location.zipCode &&
                      ` ${foodPost.location.zipCode}`}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Availability */}
              <Typography variant="h6" gutterBottom>
                Availability
              </Typography>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                gutterBottom
              >
                <AccessTime sx={{ fontSize: 16, mr: 1 }} />
                Available until: {formatDate(foodPost.availableUntil)}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Donor Information */}
              <Typography variant="h6" gutterBottom>
                Donor Information
              </Typography>
              {foodPost.donor && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center"
                    gutterBottom
                  >
                    <Person sx={{ fontSize: 16, mr: 1 }} />
                    {foodPost.donor.name}
                  </Typography>
                  {foodPost.donor.phone && (
                    <Typography
                      variant="body2"
                      display="flex"
                      alignItems="center"
                      gutterBottom
                    >
                      <Phone sx={{ fontSize: 16, mr: 1 }} />
                      {foodPost.donor.phone}
                    </Typography>
                  )}
                  {foodPost.donor.email && (
                    <Typography
                      variant="body2"
                      display="flex"
                      alignItems="center"
                      gutterBottom
                    >
                      <Email sx={{ fontSize: 16, mr: 1 }} />
                      {foodPost.donor.email}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Contact Information */}
              {foodPost.contactInfo && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {foodPost.contactInfo.phone && (
                      <Typography
                        variant="body2"
                        display="flex"
                        alignItems="center"
                        gutterBottom
                      >
                        <Phone sx={{ fontSize: 16, mr: 1 }} />
                        {foodPost.contactInfo.phone}
                      </Typography>
                    )}
                    {foodPost.contactInfo.alternatePhone && (
                      <Typography
                        variant="body2"
                        display="flex"
                        alignItems="center"
                        gutterBottom
                      >
                        <Phone sx={{ fontSize: 16, mr: 1 }} />
                        Alt: {foodPost.contactInfo.alternatePhone}
                      </Typography>
                    )}
                    {foodPost.contactInfo.email && (
                      <Typography
                        variant="body2"
                        display="flex"
                        alignItems="center"
                        gutterBottom
                      >
                        <Email sx={{ fontSize: 16, mr: 1 }} />
                        {foodPost.contactInfo.email}
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              {/* Action Buttons */}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {isAuthenticated &&
                  (user?.role === "admin" ||
                    foodPost.donor?._id === user?.id) && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/edit-food/${foodPost._id}`)}
                        fullWidth
                      >
                        Edit Post
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            foodId: foodPost._id,
                            foodTitle: foodPost.title,
                          })
                        }
                        fullWidth
                      >
                        Delete Post
                      </Button>
                    </>
                  )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() =>
            setDeleteDialog({ open: false, foodId: null, foodTitle: "" })
          }
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{deleteDialog.foodTitle}"? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setDeleteDialog({ open: false, foodId: null, foodTitle: "" })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default FoodPostDetail;
