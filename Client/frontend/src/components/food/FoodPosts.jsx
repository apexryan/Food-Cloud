import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  LocationOn,
  AccessTime,
  Restaurant,
  Visibility,
} from "@mui/icons-material";

const FoodPosts = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [foodPosts, setFoodPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    foodtype: "",
    city: "",
    isVegetarian: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    foodId: null,
    foodTitle: "",
  });

  useEffect(() => {
    fetchFoodPosts();
  }, [filters, pagination.currentPage]);

  const fetchFoodPosts = async () => {
    try {
      setLoading(true);
      const queryParams = {
        ...filters,
        page: pagination.currentPage,
        limit: 12,
      };

      const response = await apiService.getAllFoodPosts(queryParams);
      setFoodPosts(response.foodPosts || []);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalPosts: response.pagination?.totalPosts || 0,
      });
    } catch (error) {
      setError(error.message || "Failed to fetch food posts");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleDelete = async () => {
    try {
      await apiService.deleteFoodPost(deleteDialog.foodId);
      setDeleteDialog({ open: false, foodId: null, foodTitle: "" });
      fetchFoodPosts();
    } catch (error) {
      setError(error.message || "Failed to delete food post");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
    return status === "available" ? "success" : "error";
  };

  if (loading && foodPosts.length === 0) {
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Food Posts
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/create-food")}
            >
              Create Food Post
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Food Type</InputLabel>
                <Select
                  value={filters.foodtype}
                  onChange={(e) =>
                    handleFilterChange("foodtype", e.target.value)
                  }
                  label="Food Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="prepared_food">Prepared Food</MenuItem>
                  <MenuItem value="raw_ingridients">Raw Ingredients</MenuItem>
                  <MenuItem value="packaged_food">Packaged Food</MenuItem>
                  <MenuItem value="beverages">Beverages</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder="Search by city..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Dietary Preference</InputLabel>
                <Select
                  value={filters.isVegetarian}
                  onChange={(e) =>
                    handleFilterChange("isVegetarian", e.target.value)
                  }
                  label="Dietary Preference"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Vegetarian</MenuItem>
                  <MenuItem value="false">Non-Vegetarian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Food Posts Grid */}
        <Grid container spacing={3}>
          {foodPosts.map((post) => (
            <Grid item xs={12} sm={6} lg={4} key={post._id}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {post.images && post.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.images[0].url}
                    alt={post.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getFoodTypeLabel(post.foodtype)}
                      size="small"
                      icon={<Restaurant />}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label={post.status}
                      size="small"
                      color={getStatusColor(post.status)}
                      sx={{ mr: 1, mb: 1 }}
                      variant={user?.role === "admin" ? "filled" : "outlined"}
                    />
                    {post.isVegetarian && (
                      <Chip
                        label="Vegetarian"
                        size="small"
                        color="success"
                        sx={{ mb: 1 }}
                      />
                    )}
                    {post.isVegan && (
                      <Chip
                        label="Vegan"
                        size="small"
                        color="success"
                        sx={{ mb: 1 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      display="flex"
                      alignItems="center"
                      gutterBottom
                    >
                      <LocationOn sx={{ fontSize: 16, mr: 1 }} />
                      {post.location?.address}
                    </Typography>
                    <Typography
                      variant="body2"
                      display="flex"
                      alignItems="center"
                      gutterBottom
                    >
                      <AccessTime sx={{ fontSize: 16, mr: 1 }} />
                      Available until: {formatDate(post.availableUntil)}
                    </Typography>
                    <Typography variant="body2">
                      Quantity: {post.quantity}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/food/${post._id}`)}
                    >
                      View
                    </Button>

                    {isAuthenticated &&
                      (user?.role === "admin" || post.donor === user?.id) && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => navigate(`/edit-food/${post._id}`)}
                          >
                            Edit
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                foodId: post._id,
                                foodTitle: post.title,
                              })
                            }
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

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

export default FoodPosts;
