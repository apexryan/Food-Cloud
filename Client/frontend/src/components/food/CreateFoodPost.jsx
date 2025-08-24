import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const CreateFoodPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    foodtype: "prepared_food",
    quantity: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    availableUntil: "",
    pickupTimePreference: "anytime",
    specialInstructions: "",
    isVegetarian: false,
    isVegan: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchFoodPost();
    }
  }, [id]);

  const fetchFoodPost = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFoodPostById(id);
      const foodPost = response.foodPost;

      setFormData({
        title: foodPost.title || "",
        description: foodPost.description || "",
        foodtype: foodPost.foodtype || "prepared_food",
        quantity: foodPost.quantity?.toString() || "",
        location: {
          address: foodPost.location?.address || "",
          city: foodPost.location?.city || "",
          state: foodPost.location?.state || "",
          zipCode: foodPost.location?.zipCode || "",
        },
        availableUntil: foodPost.availableUntil
          ? new Date(foodPost.availableUntil).toISOString().slice(0, 16)
          : "",
        pickupTimePreference: foodPost.pickupTimePreference || "anytime",
        specialInstructions: foodPost.specialInstructions || "",
        isVegetarian: foodPost.isVegetarian || false,
        isVegan: foodPost.isVegan || false,
      });
    } catch (error) {
      setError(error.message || "Failed to fetch food post");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach((key) => {
        if (key === "location") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      if (isEditMode) {
        await apiService.updateFoodPost(id, formDataToSend);
      } else {
        await apiService.createFoodPost(formDataToSend);
      }
      navigate("/food");
    } catch (error) {
      setError(error.message || "Failed to create food post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Add sx={{ fontSize: 30, color: "primary.main", mr: 2 }} />
            <Typography variant="h4" component="h1">
              {isEditMode ? "Edit Food Post" : "Create Food Post"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Food Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Food Type</InputLabel>
                  <Select
                    name="foodtype"
                    value={formData.foodtype}
                    onChange={handleInputChange}
                    label="Food Type"
                  >
                    <MenuItem value="prepared_food">Prepared Food</MenuItem>
                    <MenuItem value="raw_ingridients">Raw Ingredients</MenuItem>
                    <MenuItem value="packaged_food">Packaged Food</MenuItem>
                    <MenuItem value="beverages">Beverages</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 plates, 2 kg, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Location Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Available Until"
                  name="availableUntil"
                  type="datetime-local"
                  value={formData.availableUntil}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Pickup Time Preference</InputLabel>
                  <Select
                    name="pickupTimePreference"
                    value={formData.pickupTimePreference}
                    onChange={handleInputChange}
                    label="Pickup Time Preference"
                  >
                    <MenuItem value="morning">Morning</MenuItem>
                    <MenuItem value="afternoon">Afternoon</MenuItem>
                    <MenuItem value="evening">Evening</MenuItem>
                    <MenuItem value="anytime">Anytime</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Instructions"
                  name="specialInstructions"
                  multiline
                  rows={2}
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Dietary Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                    />
                  }
                  label="Vegetarian"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isVegan"
                      checked={formData.isVegan}
                      onChange={handleInputChange}
                    />
                  }
                  label="Vegan"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <input
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                  style={{ marginBottom: "1rem" }}
                />
                {images.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {images.length} image(s) selected
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/food")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                      ? "Update Food Post"
                      : "Create Food Post"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateFoodPost;
