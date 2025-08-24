import React, { useState } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import { Send } from "@mui/icons-material";
import styles from "./Controls.module.css";

export const Controls = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className={styles.controlsContainer}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        multiline
        maxRows={4}
        className={styles.inputField}
        InputProps={{
          endAdornment: (
            <IconButton
              type="submit"
              disabled={!inputValue.trim()}
              className={styles.sendButton}
            >
              <Send />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};
