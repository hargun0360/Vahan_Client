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

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const ShowEntity = () => {
  const [entityName, setEntityName] = useState("");
  const [entries, setEntries] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const fetchEntriesAndAttributes = async (name) => {
    if (abortController) {
      abortController.abort();
    }
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    try {
      const response = await axios.get(`${BASE_URL}${name}`, {
        signal: newAbortController.signal,
      });
      setEntries(response.data.entries);
      setAttributes(response.data.attributes);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error("Error fetching entries and attributes:", error);
      }
    }
  };

  const debouncedFetchEntriesAndAttributes = debounce(
    fetchEntriesAndAttributes,
    500
  );

  useEffect(() => {
    if (entityName) {
      debouncedFetchEntriesAndAttributes(entityName);
    }
  }, [entityName]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}${entityName}/${id}`);
      fetchEntriesAndAttributes(entityName);
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

  const handleEntityNameChange = (e) => {
    setEntityName(e.target.value);
  };

  return (
    <div>
      <TextField
        label="Entity Name"
        value={entityName}
        onChange={handleEntityNameChange}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEntryDialogOpen()}
        >
          Add Entry
        </Button>
        <AddAttribute 
          entityName={entityName} 
          onAttributeAdded={() => fetchEntriesAndAttributes(entityName)} 
        />
        <DeleteAttribute 
          entityName={entityName} 
          onAttributeDeleted={() => fetchEntriesAndAttributes(entityName)} 
        />
        <UpdateAttribute 
          entityName={entityName} 
          onAttributeUpdated={() => fetchEntriesAndAttributes(entityName)} 
        />
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {attributes.map((attr) => (
                <TableCell key={attr.name}>{attr.name}</TableCell>
              ))}
              {attributes.length ? <TableCell>Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  {attributes.map((attr) => (
                    <TableCell key={attr.name}>{entry[attr.name]}</TableCell>
                  ))}
                  <TableCell sx={{display : "flex"}}>
                    <IconButton color="primary"  onClick={() => handleEntryDialogOpen(entry)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(entry.id)}>
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
        onAdd={() => fetchEntriesAndAttributes(entityName)}
        initialData={currentEntry}
      />
    </div>
  );
};

export default ShowEntity;
