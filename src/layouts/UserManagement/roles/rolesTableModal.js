/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { FormControl, FormHelperText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: "1rem",
  flexDirection: "column",
};

export default function RolesTableModal({ userId = null, permission, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ role: "" });
  const [roleError, setRoleError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get("http://localhost:3000/api/web/roles");
        const role = rolesResponse.data.find((role) => role._id === userId);
        setFormData({ role: role ? role.role : "" });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  const handleEditModal = () => {
    if (permission[2]?.isSelected === false) {
      handleError("You don't have permission to Edit");
      return;
    }
    handleOpen();
  };

  const handleAddModal = () => {
    if (permission[0]?.isSelected === false) {
      handleError("You don't have permission to Add Role");
      return;
    }
    handleOpen();
  };
  const handleSubmit = async () => {
    try {
      if (!formData.role.trim()) {
        setRoleError("Role is required");
        return; // Don't submit if there are validation errors
      }
      const response = await (userId
        ? axios.put(`http://localhost:3000/api/web/roles/${userId}`, formData)
        : axios.post("http://localhost:3000/api/web/roles", formData));

      setIsRefetch(true);
      handleClose();
      setFormData({ role: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        handleError(error.response.data.message);
      } else {
        handleError("An error occurred while submitting the form. Please try again later.");
      }
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {userId ? (
        <EditIcon onClick={handleEditModal} />
      ) : (
        <Button variant="text" style={{ color: "white" }} onClick={handleAddModal}>
          +Add Record
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl>
            <TextField
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              id="role"
              label="Role"
              variant="outlined"
            />
            <FormHelperText style={{ color: roleError ? "red" : "inherit" }}>
              {roleError || "Enter Role"}
            </FormHelperText>
          </FormControl>

          <FormControl>
            <Button
              variant="contained"
              color="primary"
              style={{ color: "white" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity="error"
        >
          {submitError}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
