import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Close, Chat as ChatIcon } from "@mui/icons-material";
import Chatboat from "./Chat.jsx";

const ChatDialog = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        sx={{ ml: 1 }}
        title="Chat with AI Assistant"
      >
        <ChatIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: "600px",
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ChatIcon color="primary" />
              <Typography variant="h6">AI Food Assistant</Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, height: "100%" }}>
          <Chatboat />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatDialog;
