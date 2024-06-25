/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { environment } from "environments/environment";
import { GET_SELLERORDER_API } from "environments/apiPaths";
import { axiosInstance } from "environments/environment";

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

export default function PendingSalesDataModal({
  sellerData = null,
  handlePendingClose,
  pendingSalesModal,
  setIsRefetch = () => {},
}) {
  const [formData, setFormData] = useState({
    seller_id: "",
    received_qty: "",
    consumed_qty: "",
    rejected_qty: "",
    status: "pending",
  });
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let formData = {
        _id: sellerData._id,
        seller_id: sellerData.seller_id,
        received_qty: sellerData.received_qty,
        consumed_qty: sellerData.consumed_qty, // Fixed the key here
        rejected_qty: sellerData.rejected_qty,
        status: sellerData.status, // Fixed typo here
      };

      setFormData(formData);
    };

    if (sellerData) {
      fetchData();
    }
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
      status: formData.status,
    };
    console.log(newFormData);
    try {
      await axiosInstance.put(`${GET_SELLERORDER_API}/${formData._id}`, newFormData);

      setFormData({
        seller_id: "",
        received_qty: "",
        consumed_qty: "",
        rejected_qty: "",
      });

      window.location.reload();
      setIsRefetch(true);
      handlePendingClose();
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
      <Modal
        open={pendingSalesModal} // Corrected here
        onClose={handlePendingClose} // Corrected here
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
              id="received_qty" // Corrected here
              label="Received Quantity"
              variant="outlined"
              value={formData.received_qty}
              onChange={handleInputChange}
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
              value={formData.rejected_qty} // Corrected here
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
