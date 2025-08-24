import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // ==================== AUTHENTICATION ENDPOINTS ====================

  // POST /api/auth/login - for login (users/ngo/volunteer)
  // POST /api/admin/login - for admin login
  async login(email, password, userType = "user") {
    try {
      let response;

      if (userType === "admin") {
        // Use admin-specific login endpoint
        response = await api.post("/admins/login", {
          email,
          password,
        });

        // Transform admin response to match user response format
        if (response.data.token) {
          const adminUser = {
            id: response.data.admin?._id,
            name: response.data.admin?.name || "Admin",
            email: email,
            userType: "admin",
            role: "admin",
          };

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(adminUser));

          return {
            message: response.data.message,
            token: response.data.token,
            user: adminUser,
          };
        }
      } else {
        // Use regular auth login for other user types
        response = await api.post("/auth/login", {
          email,
          password,
          userType,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // POST /api/auth/register - for register (users/ngo/volunteer/admin)
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // POST /api/auth/forgot-password - for (users/ngo/volunteer/admin)
  async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // POST /api/auth/reset-password - for (users/ngo/volunteer/admin)
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // PUT /api/auth/change-password - for (users/ngo/volunteer/admin)
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Admin-specific password change
  async changeAdminPassword(currentPassword, newPassword) {
    try {
      const response = await api.put("/admins/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // ==================== USER MANAGEMENT ENDPOINTS ====================

  // POST /api/users - for CREATING NEW USERS BY ADMIN (users/ngo/volunteer/admin)
  async createUser(userData) {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // GET /api/users - TO VIEW ALL USERS BY ADMIN
  async getAllUsers() {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // PUT /api/users - TO UPDATE USER BY ADMIN
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // ==================== FOOD POST ENDPOINTS ====================

  // POST /api/food - to create new food
  async createFoodPost(formData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/food`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // GET /api/food - to view all food posts same to admin also
  async getAllFoodPosts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/food?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // GET /api/food/:id - to view single food post
  async getFoodPostById(foodId) {
    try {
      const response = await api.get(`/food/${foodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // PUT /api/food/:id - to update
  async updateFoodPost(foodId, formData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/food/${foodId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // DELETE /api/food/:id - to delete
  async deleteFoodPost(foodId) {
    try {
      const response = await api.delete(`/food/${foodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // PUT /api/food/:id/unavailable - Admin mark as unavailable
  async markFoodAsUnavailable(foodId) {
    try {
      const response = await api.put(`/food/${foodId}/unavailable`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // PUT /api/food/:id/available - Admin mark as available
  async markFoodAsAvailable(foodId) {
    try {
      const response = await api.put(`/food/${foodId}/available`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // ==================== UTILITY METHODS ====================

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  // Get Razorpay configuration
  async getRazorpayConfig() {
    try {
      const response = await api.get("/razorpay/config");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default new ApiService();
