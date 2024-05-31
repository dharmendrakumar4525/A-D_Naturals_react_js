/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, FormHelperText } from "@mui/material";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { environment } from "environments/environment";
import { GET_SELLERORDER_API } from "environments/apiPaths";

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

export default function PendingSalesDataModal({ sellerData = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    seller_id: "",
    received_qty: "",
    consumed_qty: "",
    rejected_qty: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let formData = {
        _id: sellerData._id,
        seller_id: sellerData.seller_id,
        received_qty: sellerData.received_qty,
        consumed_qty: sellerData.rejected_qty,
        rejected_qty: sellerData.rejected_qty,
      };

      setFormData(formData);
    };

    fetchData();
  }, [sellerData]);

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {
    let newFormData = {
      seller_id: formData.seller_id._id,
      received_qty: formData.received_qty,
      consumed_qty: parseInt(formData.consumed_qty),
      rejected_qty: parseInt(formData.rejected_qty),
    };
    console.log(newFormData);
    try {
      await axios.put(
        `${environment.api_path}/${GET_SELLERORDER_API}/${formData._id}`,
        newFormData
      );

      setFormData({
        seller_id: "",
        received_qty: "",
        consumed_qty: "",
        rejected_qty: "",
      });

      window.location.reload();
      setIsRefetch(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        handleError(error.response.data.message);
      } else {
        handleError("An error occurred while submitting the form. Please try again later.");
      }
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [event.target.id]: value });
  };

  return (
    <div>
      <Button variant="text" style={{ color: "#2f89ec" }} onClick={handleOpen}>
        +Add Sales Record
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl>
            <TextField
              id="seller_name"
              label="Seller Name"
              variant="outlined"
              value={formData.seller_id.seller_name}
              onChange={handleInputChange}
              InputProps={{
                readOnly: true,
              }}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="receivedQuantity"
              label="Received Quantity"
              variant="outlined"
              value={formData.received_qty}
              onChange={handleInputChange}
              InputProps={{
                readOnly: true,
              }}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="consumed_qty"
              label="Consumed Quantity"
              variant="outlined"
              helperText="Enter Consumed Quantity"
              value={formData.consumed_qty}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="rejected_qty"
              label="Rejected Quantity"
              variant="outlined"
              helperText="Enter Rejected Quantity"
              value={formData.location_name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <Button
              variant="contained"
              color="primary"
              style={{ color: "white" }}
              onClick={handleSubmit}
            >
              Update
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
