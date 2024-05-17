import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { styled } from '@mui/system';
import { BASE_URL } from '../constant';

const EditForm = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const EntriesTable = ({ entityName }) => {
  const [entries, setEntries] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, [entityName]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${entityName}`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}${entityName}/${id}`);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
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
      fetchEntries();
      handleEditClose();
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleChange = (field, value) => {
    setCurrentEntry({ ...currentEntry, [field]: value });
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {entries.length > 0 && Object.keys(entries[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                {Object.keys(entry).map((key) => (
                  <TableCell key={key}>{entry[key]}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent>
          {currentEntry && Object.keys(currentEntry).map((key) => (
            key !== 'id' && (
              <TextField
                key={key}
                label={key}
                value={currentEntry[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                fullWidth
                margin="dense"
              />
            )
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EntriesTable;
