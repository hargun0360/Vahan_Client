import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BASE_URL } from "../constant";

const FormContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const AddEntry = ({ entityName, attributes }) => {
  const theme = useTheme();
  const [entry, setEntry] = useState({});

  const handleChange = (name, value) => {
    setEntry({ ...entry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}${entityName}`, entry);
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <FormContainer>
      <Typography variant="h5">Add Entry to {entityName}</Typography>
      <form onSubmit={handleSubmit}>
        {attributes.map((attr, index) => (
          <Box key={index} sx={{ marginBottom: theme.spacing(2) }}>
            {attr.type === "text" && (
              <TextField
                label={attr.name}
                value={entry[attr.name] || ""}
                onChange={(e) => handleChange(attr.name, e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
            {attr.type === "bigint" && (
              <TextField
                label={attr.name}
                type="number"
                value={entry[attr.name] || ""}
                onChange={(e) => handleChange(attr.name, e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
            {attr.type === "date" && (
              <TextField
                label={attr.name}
                type="date"
                value={entry[attr.name] || ""}
                onChange={(e) => handleChange(attr.name, e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
            {attr.type === "serial" && (
              <TextField
                label={attr.name}
                type="number"
                value={entry[attr.name] || ""}
                onChange={(e) => handleChange(attr.name, e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
            {attr.type === "int" && (
              <TextField
                label={attr.name}
                type="number"
                value={entry[attr.name] || ""}
                onChange={(e) => handleChange(attr.name, e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Add Entry
        </Button>
      </form>
    </FormContainer>
  );
};

export default AddEntry;
