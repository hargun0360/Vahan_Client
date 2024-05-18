import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../constant";
import moment from "moment";

const AddEntry = ({ open, onClose, entityName, attributes, onAdd, initialData }) => {
  const [entry, setEntry] = useState({});

  useEffect(() => {
    if (initialData) {
      // Format the date fields
      const formattedData = { ...initialData };
      attributes.forEach(attr => {
        if (attr.type === 'date' && initialData[attr.name]) {
          formattedData[attr.name] = moment(initialData[attr.name]).format('YYYY-MM-DD');
        }
      });
      setEntry(formattedData);
    }
  }, [initialData, attributes]);

  const handleChange = (name, value) => {
    setEntry({ ...entry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await axios.put(`${BASE_URL}${entityName}/${entry.id}`, entry);
      } else {
        await axios.post(`${BASE_URL}${entityName}`, entry);
      }
      onAdd();
      onClose();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? "Edit Entry" : "Add Entry"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {attributes?.map((attr, index) => (
            <Box key={index} sx={{ marginBottom: 2, width: "100%" }}>
              {attr.name !== "id" && (
                <TextField
                  label={attr.name}
                  type={attr.type === "date" ? "date" : attr.type === "integer" ? "number" : "text"}
                  value={initialData ? entry[attr.name] : ""}
                  onChange={(e) => handleChange(attr.name, e.target.value)}
                  fullWidth 
                  margin="normal"
                  InputLabelProps={attr.type === "date" ? { shrink: true } : {}}
                  required={attr.isRequired === "YES"}
                />
              )}
            </Box>
          ))}
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {initialData ? "Save Changes" : "Add Entry"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntry;
