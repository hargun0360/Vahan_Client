import React, { useState } from "react";
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  TextField,
  Button,
} from "@mui/material";
import CreateEntity from "./Component/CreateEntity";
// import AddAttribute from './components/AddAttribute';
// import DeleteAttribute from './components/DeleteAttribute';
// import UpdateAttribute from './components/UpdateAttribute';
import EntriesTable from "./Component/EntriesTable";

function App() {
  const [entityName, setEntityName] = useState("");
  const [showEntries, setShowEntries] = useState(false);

  const handleShowEntries = () => {
    setShowEntries(true);
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Headless CMS</Typography>
        </Toolbar>
      </AppBar>
      <CreateEntity />
      {/* <AddAttribute />
      <DeleteAttribute />
      <UpdateAttribute /> */}
      <TextField
        label="Entity Name"
        value={entityName}
        onChange={(e) => setEntityName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleShowEntries}>
        Show Entries
      </Button>
      {showEntries && <EntriesTable entityName={entityName} />}
    </Container>
  );
}

export default App;
