import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
  IconButton,
} from "@mui/material";
import { GitHub, LinkedIn, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#1f252b", color: "#eaeef2", mt: 6 }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
              FoodCloud
            </Typography>
            <Typography variant="body2" sx={{ color: "#cfd8e3" }}>
              Connecting food donors with NGOs to reduce waste and fight hunger.
              Together we can make a difference.
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <IconButton size="small" color="inherit" aria-label="GitHub">
                <GitHub fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="LinkedIn">
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="Twitter">
                <Twitter fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "#cfd8e3" }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink href="/" underline="none" sx={{ color: "#eaeef2" }}>
                Home
              </MuiLink>
              <MuiLink href="/login" underline="none" sx={{ color: "#eaeef2" }}>
                Login
              </MuiLink>
              <MuiLink
                href="/register"
                underline="none"
                sx={{ color: "#eaeef2" }}
              >
                Register
              </MuiLink>
              <MuiLink href="/food" underline="none" sx={{ color: "#eaeef2" }}>
                Food Posts
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 2, color: "#cfd8e3" }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ color: "#eaeef2" }}>
              Email: info@foodcloud.com
            </Typography>
            <Typography variant="body2" sx={{ color: "#eaeef2" }}>
              Phone: +91 1234567890
            </Typography>
            <Typography variant="body2" sx={{ color: "#eaeef2" }}>
              Address: Kolkata
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#cfd8e3" }}>
            © {new Date().getFullYear()} FoodCloud. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: "#cfd8e3" }}>
            Made with ❤ for a better world
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
