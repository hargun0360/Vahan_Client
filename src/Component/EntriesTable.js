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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addEntryDialogOpen, setAddEntryDialogOpen] = useState(false);
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

  const handleEditOpen = (entry) => {
    setCurrentEntry(entry);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setCurrentEntry(null);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`${BASE_URL}${entityName}/${currentEntry.id}`, currentEntry);
      fetchEntriesAndAttributes();
      handleEditClose();
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const handleChange = (field, value) => {
    setCurrentEntry({ ...currentEntry, [field]: value });
  };

  const handleAddEntryOpen = () => {
    setAddEntryDialogOpen(true);
  };

  const handleAddEntryClose = () => {
    setAddEntryDialogOpen(false);
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
        <Button variant="contained" color="primary" onClick={handleAddEntryOpen}>
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
              {attributes?.map((attr) => (
                <TableCell key={attr.name}>{attr.name}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? (
              entries?.map((entry) => (
                <TableRow key={entry.id}>
                  {attributes?.map((attr) => (
                    <TableCell key={attr.name}>{entry[attr.name]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(entry)}>
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
                {attributes?.map((attr) => (
                  <TableCell key={attr.name}></TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent>
          {currentEntry &&
            Object.keys(currentEntry)?.map(
              (key) =>
                key !== "id" && (
                  <TextField
                    key={key}
                    label={key}
                    value={currentEntry[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    fullWidth
                    margin="dense"
                  />
                )
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addEntryDialogOpen} onClose={handleAddEntryClose}>
        <DialogTitle>Add Entry</DialogTitle>
        <DialogContent>
          <AddEntry
            entityName={entityName}
            attributes={attributes}
            onClose={handleAddEntryClose}
            onAdd={fetchEntriesAndAttributes}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddEntryClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShowEntity;
