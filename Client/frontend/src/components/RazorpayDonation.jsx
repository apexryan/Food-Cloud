import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Favorite } from "@mui/icons-material";
import apiService from "../services/apiService";

const RazorpayDonation = () => {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [razorpayKey, setRazorpayKey] = React.useState("");

  // Fetch Razorpay configuration when component mounts
  React.useEffect(() => {
    const fetchRazorpayConfig = async () => {
      try {
        const response = await apiService.getRazorpayConfig();
        setRazorpayKey(response.config.key);
      } catch (error) {
        console.error("Failed to fetch Razorpay config:", error);
        setError("Failed to load payment configuration");
      }
    };

    fetchRazorpayConfig();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDonation = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!razorpayKey) {
        setError("Payment configuration not loaded. Please try again.");
        return;
      }

      const amountInPaise = Number(amount) * 100;

      // 1) Create order on server
      const orderRes = await apiService.createRazorpayOrder(
        amountInPaise,
        "INR"
      );
      if (!orderRes?.success) {
        setError("Failed to create payment order. Please try again.");
        return;
      }

      const order = orderRes.order;

      // 2) Initialize Razorpay with key and order id
      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: "INR",
        name: "FoodCloud Connect",
        description: "Donation for NGOs",
        image:
          "https://via.placeholder.com/150x50/1976d2/ffffff?text=FoodCloud",
        order_id: order?.id,
        handler: function (response) {
          console.log("Payment successful:", response);
          alert(
            "Thank you for your donation! Payment ID: " +
              response.razorpay_payment_id
          );
          handleClose();
          setAmount("");
        },
        prefill: {
          name: "Subhojit Santra",
          email: "subhojit.santra@gmail.com",
          contact: "6289619338",
        },
        notes: {
          address: "NGO Donation via FoodCloud",
        },
        theme: {
          color: "#1976d2",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="secondary"
        startIcon={<Favorite />}
        onClick={handleOpen}
        variant="outlined"
        size="small"
      >
        Donate
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Favorite color="secondary" />
            <Typography variant="h6">Make a Donation</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your donation helps us continue our mission to reduce food waste and
            help those in need.
          </Typography>

          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="caption" color="text.secondary">
            * All donations are processed securely through Razorpay
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDonation}
            variant="contained"
            color="secondary"
            disabled={loading || !amount || !razorpayKey}
            startIcon={loading ? null : <Favorite />}
          >
            {loading ? "Processing..." : "Donate Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RazorpayDonation;
