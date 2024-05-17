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
import { useTheme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import { BASE_URL } from "../constant";

const FormContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const CreateEntity = () => {
  const theme = useTheme();
  const [entityName, setEntityName] = useState("");
  const [attributes, setAttributes] = useState([{ name: "", type: "text" }]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: "", type: "text" }]);
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
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <FormContainer>
      <Typography variant="h5">Create Entity</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Entity Name"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography variant="h6">Attributes</Typography>
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
                <MenuItem value="serial">Serial</MenuItem>
                <MenuItem value="int">Int</MenuItem>
              </Select>
            </FormControl>
            {index !== 0 && (
              <IconButton
                onClick={() => handleRemoveAttribute(index)}
                color="secondary"
              >
                <Close />
              </IconButton>
            )}
          </Box>
        ))}
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
      </form>
    </FormContainer>
  );
};

export default CreateEntity;
