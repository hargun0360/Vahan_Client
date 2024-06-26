import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { BASE_URL } from "../constant";

const DeleteAttribute = ({ entityName, onAttributeDeleted }) => {
  const [open, setOpen] = useState(false);
  const [attributeName, setAttributeName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAttributeName("");
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}entities/delete-attribute`, {
        entityName,
        attributeName,
      });
      handleClose();
      setAttributeName("");
      onAttributeDeleted();
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Button variant="contained" color="error" onClick={handleOpen} disabled={!entityName}
        sx={{
          backgroundColor: !entityName ? "#ccc" : "#f44336",
          color: "#fff",
          "&:hover": { backgroundColor: !entityName ? "#ccc" : "#d32f2f" },
        }}>
        Delete Attribute
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Attribute</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Attribute Name"
              value={attributeName}
              onChange={(e) => setAttributeName(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAttribute;
