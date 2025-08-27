import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Grid,
} from '@mui/material';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function VolunteerDashboard() {
  const [foodPosts, setFoodPosts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchFoodPosts = async () => {
    try {
      const response = await apiService.getVolunteerFoodPosts();
      setFoodPosts(response);
    } catch (error) {
      console.error('Error fetching food posts:', error);
    }
  };

  useEffect(() => {
    fetchFoodPosts();
  }, []);

  const handleUpdateStatus = async (postId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
      await apiService.updateVolunteerFoodPostStatus(postId, newStatus);
      fetchFoodPosts();
    } catch (error) {
      console.error('Error updating food post status:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>
        Volunteer Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {foodPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {post.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Location: {post.location}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant={post.status === 'available' ? "contained" : "outlined"}
                    color={post.status === 'available' ? "error" : "success"}
                    onClick={() => handleUpdateStatus(post._id, post.status)}
                  >
                    Mark as {post.status === 'available' ? 'Unavailable' : 'Available'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default VolunteerDashboard;
