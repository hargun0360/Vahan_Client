import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { BASE_URL } from "../constant";
import AddEntry from "./AddEntry";
import AddAttribute from "./AddAttribute";
import DeleteAttribute from "./DeleteAttribute";
import UpdateAttribute from "./UpdateAttribute";

const ShowEntity = () => {
  const [entityName, setEntityName] = useState("");
  const [entries, setEntries] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  useEffect(() => {
    if (entityName) {
      fetchEntriesAndAttributes();
    }
  }, [entityName]);

  const fetchEntriesAndAttributes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${entityName}`);
      setEntries(response.data.entries);
      setAttributes(response.data.attributes);
    } catch (error) {
      console.error("Error fetching entries and attributes:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}${entityName}/${id}`);
      fetchEntriesAndAttributes();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleEntryDialogOpen = (entry = null) => {
    setCurrentEntry(entry);
    setEntryDialogOpen(true);
  };

  const handleEntryDialogClose = () => {
    setEntryDialogOpen(false);
    setCurrentEntry(null);
  };

  return (
    <div>
      <TextField
        label="Entity Name"
        value={entityName}
        onChange={(e) => setEntityName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleEntryDialogOpen()}>
          Add Entry
        </Button>
        <AddAttribute entityName={entityName} />
        <DeleteAttribute entityName={entityName} />
        <UpdateAttribute entityName={entityName} />
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {attributes.map((attr) => (
                <TableCell key={attr.name}>{attr.name}</TableCell>
              ))}
             {attributes.length ?  <TableCell>Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  {attributes.map((attr) => (
                    <TableCell key={attr.name}>{entry[attr.name]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleEntryDialogOpen(entry)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(entry.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {attributes.map((attr) => (
                  <TableCell key={attr.name}></TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddEntry
        open={entryDialogOpen}
        onClose={handleEntryDialogClose}
        entityName={entityName}
        attributes={attributes}
        onAdd={fetchEntriesAndAttributes}
        initialData={currentEntry}
      />
    </div>
  );
};

export default ShowEntity;
