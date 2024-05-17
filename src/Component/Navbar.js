import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Headless CMS
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{ fontWeight: location.pathname === "/" ? "Bold" : "none" }}
          >
            Create Entity
          </Button>
          <Button
            component={Link}
            to="/show-entity"
            color="inherit"
            sx={{ fontWeight: location.pathname === "/show-entity" ? "Bold" : "none" }}
          >
            Show Entity
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
