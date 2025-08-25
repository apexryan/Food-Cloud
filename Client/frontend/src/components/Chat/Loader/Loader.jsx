import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import styles from "./Loader.module.css";

export const Loader = () => {
  return (
    <Box className={styles.loaderContainer}>
      <CircularProgress size={24} className={styles.spinner} />
      <Typography variant="body2" className={styles.loadingText}>
        AI is thinking...
      </Typography>
    </Box>
  );
};

