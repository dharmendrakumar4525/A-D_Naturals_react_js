// components/LoadingOverlay.js
import React from "react";
import { Box, Typography } from "@mui/material";
import Loader from "../assets/images/Loader.gif";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const LoadingOverlay = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      fontSize: "2rem",
    }}
  >
    <MDBox mx="auto" my="auto" style={{ textAlign: "center", paddingBottom: 50 }}>
      <img src={Loader} alt="loading..." />
      <MDTypography sx={{ fontSize: 18 }}>Please Wait....</MDTypography>
    </MDBox>
  </Box>
);

export default LoadingOverlay;
