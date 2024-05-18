import React, { useState } from "react";
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
  IconButton,
} from "@mui/material";
import Swal from 'sweetalert2';
import { Close } from "@mui/icons-material";
import { BASE_URL } from "../constant";
import { createTheme } from "@mui/material";

const theme = createTheme({
  spacing: 4,
});

const CreateEntity = () => {
  const [entityName, setEntityName] = useState("");
  const [attributes, setAttributes] = useState([
    { name: "", type: "text", isRequired: "YES" },
  ]);

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { name: "", type: "text", isRequired: "YES" },
    ]);
  };

  const handleChangeAttribute = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}entities`, {
        entityName,
        attributes,
      });
      Swal.fire('Success', response.data.message, 'success');
    } catch (error) {
      Swal.fire('Error', error.response.data.message, 'error');
    }
  };

  return (
    <>
      <div style={{ marginTop: "3%" }}>
        <Typography variant="h5">Create Entity</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Entity Name"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography variant="h6" sx={{ marginTop: "1%" }}>
            Attributes
          </Typography>
          {attributes.map((attr, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
                marginBottom: theme.spacing(2),
              }}
            >
              <TextField
                label="Name"
                value={attr.name}
                onChange={(e) =>
                  handleChangeAttribute(index, "name", e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={attr.type}
                  onChange={(e) =>
                    handleChangeAttribute(index, "type", e.target.value)
                  }
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
                  value={attr.isRequired}
                  onChange={(e) =>
                    handleChangeAttribute(index, "isRequired", e.target.value)
                  }
                  label="Is Required"
                >
                  <MenuItem value="YES">YES</MenuItem>
                  <MenuItem value="NO">NO</MenuItem>
                </Select>
              </FormControl>
              {index == 0 ? (
                <IconButton
                  onClick={() => handleRemoveAttribute(index)}
                  color="secondary"
                  sx={{ visibility: "hidden" }}
                >
                  <Close />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => handleRemoveAttribute(index)}
                  color="secondary"
                >
                  <Close />
                </IconButton>
              )}
            </Box>
          ))}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              onClick={handleAddAttribute}
              variant="outlined"
              sx={{ marginBottom: theme.spacing(2) }}
            >
              Add Attribute
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Entity
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEntity;
