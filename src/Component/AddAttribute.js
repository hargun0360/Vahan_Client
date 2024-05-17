import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { BASE_URL } from '../constant';

const AddAttribute = ({ entityName }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [isRequired, setIsRequired] = useState('YES');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}entities/add-attribute`, {
        entityName,
        attribute: { name, type, isRequired },
      });
      handleClose();
      setName('');
      setType('text');
      setIsRequired('YES');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <Button variant="contained" color="warning" onClick={handleOpen}>
        Add Attribute
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Attribute</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth />
            <TextField label="Is Required" value={isRequired} onChange={(e) => setIsRequired(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddAttribute;
