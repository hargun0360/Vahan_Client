import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./Component/Navbar";
import CreateEntity from "./Component/CreateEntity";
import ShowEntity from "./Component/EntriesTable";

function App() {
  return (
    <Router>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<CreateEntity />} />
          <Route path="/show-entity" element={<ShowEntity />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
