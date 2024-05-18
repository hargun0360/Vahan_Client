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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { BASE_URL } from "../constant";

const AddAttribute = ({ entityName, onAttributeAdded }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("text");
  const [isRequired, setIsRequired] = useState("YES");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setType("text");
    setIsRequired("YES");
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}entities/add-attribute`, {
        entityName,
        attribute: { name, type, isRequired },
      });
      handleClose();
      onAttributeAdded(); // Call the callback after successful attribute addition
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Add Attribute
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Attribute</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="bigint">BigInt</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="int">Int</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Is Required</InputLabel>
              <Select
                value={isRequired}
                onChange={(e) => setIsRequired(e.target.value)}
                label="Is Required"
              >
                <MenuItem value="YES">YES</MenuItem>
                <MenuItem value="NO">NO</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddAttribute;
