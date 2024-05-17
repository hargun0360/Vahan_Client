import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../constant";

const AddEntry = ({ entityName, attributes, onClose, onAdd }) => {
  const [entry, setEntry] = useState({});

  const handleChange = (name, value) => {
    setEntry({ ...entry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}${entityName}`, entry);
      alert(response.data.message);
      onAdd();
      onClose();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {attributes?.map((attr, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <TextField
            label={attr.name}
            type={attr.type === "date" ? "date" : "text"}
            value={entry[attr.name] || ""}
            onChange={(e) => handleChange(attr.name, e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={attr.type === "date" ? { shrink: true } : {}}
            required={attr.isRequired === "YES"}
          />
        </Box>
      ))}
      <Button type="submit" variant="contained" color="primary">
        Add Entry
      </Button>
    </form>
  );
};

export default AddEntry;
