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
  MenuItem,
} from "@mui/material";
import { BASE_URL } from "../constant";

const UpdateAttribute = ({ entityName, onAttributeUpdated }) => {
  const [open, setOpen] = useState(false);
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("text");
  const [newIsRequired, setNewIsRequired] = useState("YES");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOldName("");
    setNewName("");
    setNewType("text");
    setNewIsRequired("YES");
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}entities/update-attribute`, {
        entityName,
        oldAttribute: { name: oldName },
        newAttribute: {
          name: newName,
          type: newType,
          isRequired: newIsRequired,
        },
      });
      handleClose();
      setOldName("");
      setNewName("");
      setNewType("text");
      setNewIsRequired("YES");
      onAttributeUpdated();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <Button variant="contained" color="success" onClick={handleOpen}  disabled={!entityName}
        sx={{
          backgroundColor: !entityName ? "#ccc" : "#4caf50",
          color: "#fff",
          "&:hover": { backgroundColor: !entityName ? "#ccc" : "#388e3c" },
        }}>
        Update Attribute
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Attribute</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Old Name"
              value={oldName}
              onChange={(e) => setOldName(e.target.value)}
              fullWidth
            />
            <TextField
              label="New Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>New Type</InputLabel>
              <Select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                label="New Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="bigint">BigInt</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="int">Int</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>New Is Required</InputLabel>
              <Select
                value={newIsRequired}
                onChange={(e) => setNewIsRequired(e.target.value)}
                label="New Is Required"
              >
                <MenuItem value="YES">YES</MenuItem>
                <MenuItem value="NO">NO</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateAttribute;
