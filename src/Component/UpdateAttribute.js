import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { BASE_URL } from '../constant';

const UpdateAttribute = ({ entityName }) => {
  const [open, setOpen] = useState(false);
  const [oldName, setOldName] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('text');
  const [newIsRequired, setNewIsRequired] = useState('YES');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}entities/update-attribute`, {
        entityName,
        oldAttribute: { name: oldName },
        newAttribute: { name: newName, type: newType, isRequired: newIsRequired },
      });
      handleClose();
      setOldName('');
      setNewName('');
      setNewType('text');
      setNewIsRequired('YES');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <Button variant="contained" color="success" onClick={handleOpen}>
        Update Attribute
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Attribute</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Old Name" value={oldName} onChange={(e) => setOldName(e.target.value)} fullWidth />
            <TextField label="New Name" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth />
            <TextField label="New Type" value={newType} onChange={(e) => setNewType(e.target.value)} fullWidth />
            <TextField label="New Is Required" value={newIsRequired} onChange={(e) => setNewIsRequired(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateAttribute;
