/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
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

export default function RolesTableModal({ userId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ role: "" });

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

  const handleSubmit = async () => {
    try {
      const response = await (userId
        ? axios.put(`http://localhost:3000/api/web/roles/${userId}`, formData)
        : axios.post("http://localhost:3000/api/web/roles", formData));

      setIsRefetch(true);
      handleClose();
      setFormData({ role: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {userId ? (
        <EditIcon onClick={handleOpen} />
      ) : (
        <Button variant="text" style={{ color: "white" }} onClick={handleOpen}>
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
              helperText="Enter Role"
            />
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
    </div>
  );
}
