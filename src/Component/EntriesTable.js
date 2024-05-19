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
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
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
  const [loading, setLoading] = useState(false);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [abortController, setAbortController] = useState(null);

  const disableButtons = !entityName || attributes.length === 0;

  const fetchEntriesAndAttributes = async (name) => {
    if (abortController) {
      abortController.abort();
    }
    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${name}`, {
        signal: newAbortController.signal,
      });
      if (response.status === 200) {
        setEntries(response.data.entries);
        setAttributes(response.data.attributes);
      } else {
        setEntries([]);
        setAttributes([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setEntries([]);
      setAttributes([]);
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}${entityName}/${id}`);
        fetchEntriesAndAttributes(entityName);
        Swal.fire("Deleted!", "Entry has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete entry", "error");
      }
    }
  };

  const handleEntryDialogOpen = async (entry = null) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: !entry ? "Do you want to add entry?" : "Do you want to modify this entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: !entry ? "Yes, Add" : "Yes, modify it!",
      cancelButtonText: !entry ? "No" : "No, keep it",
    });

    if (result.isConfirmed) {
      setCurrentEntry(entry);
      setEntryDialogOpen(true);
    }
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
          disabled={disableButtons}
          sx={{
            backgroundColor: disableButtons ? "#ccc" : "#3f51b5",
            color: "#fff",
            "&:hover": { backgroundColor: disableButtons ? "#ccc" : "#303f9f" },
          }}
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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
                    <TableCell sx={{ display: "flex" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEntryDialogOpen(entry)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(entry.id)}
                      >
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
      )}

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
