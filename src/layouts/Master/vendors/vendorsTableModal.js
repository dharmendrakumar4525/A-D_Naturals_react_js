/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { FormControl, FormHelperText } from "@mui/material";
import { environment } from "environments/environment";
import { GET_VENDOR_API } from "environments/apiPaths";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  validatePhoneNumber,
  validateEmail,
  validateGSTNumber,
  validatePANNumber,
} from "validatorsFunctions/contactValidators";
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

export default function VendorTableModal({ vendorId = null, permission, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [formData, setFormData] = useState({
    vendor_name: "",
    address: "",
    contact_person: "",
    email: "",
    phone_number: "",
    gst_number: "",
    pan_number: "",
  });
  const [vendorNameError, setVendorNameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [gstError, setGstError] = useState("");
  const [panError, setPanError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorResponse = await axios.get(`${environment.api_path}/${GET_VENDOR_API}`);
        const vendorData = vendorResponse.data.data;

        const vendor = vendorData.find((vendor) => vendor._id === vendorId);

        setFormData({
          vendor_name: vendor ? vendor.vendor_name : "",
          contact_person: vendor ? vendor.contact_person : "",
          address: vendor ? vendor?.address?.street_address : "",
          email: vendor ? vendor.email : "",
          phone_number: vendor ? vendor.phone_number : 0,
          gst_number: vendor ? vendor.gst_number : "",
          pan_number: vendor ? vendor.pan_number : "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [vendorId]);

  const handleSubmit = async () => {
    try {
      if (!formData.vendor_name.trim()) {
        setVendorNameError("Vendor Name is required");
      }
      if (!formData.contact_person.trim()) {
        setNameError("Person Name is required");
      }

      if (!validateEmail(formData.email) || !formData.email.trim()) {
        setEmailError("Enter a valid email address");
      }
      if (!validatePhoneNumber(formData.phone_number)) {
        setPhoneError("Enter a valid 10-digit phone number");
      }
      if (!validateGSTNumber(formData.gst_number)) {
        setGstError("Enter a valid GST number");
      }
      if (!validatePANNumber(formData.pan_number)) {
        setPanError("Enter a valid PAN number");
      }

      if (
        !formData.vendor_name.trim() ||
        !formData.contact_person.trim() ||
        !validateEmail(formData.email) ||
        !validatePhoneNumber(formData.phone_number) ||
        !validateGSTNumber(formData.gst_number) ||
        !validatePANNumber(formData.pan_number)
      ) {
        console.log("are we here?");
        return; // Don't submit if there are validation errors
      }
      console.log("here");

      let newFormData = {
        vendor_name: formData.vendor_name,
        address: {
          street_address: formData.address,
          street_address2: "",
          state: "",
          city: "",
          zip_code: "",
          country: "",
        },
        contact_person: formData.contact_person,
        email: formData.email,
        phone_number: formData.phone_number,
        gst_number: formData.gst_number,
        pan_number: formData.pan_number,
      };
      if (vendorId) {
        await axios.put(`${environment.api_path}/${GET_VENDOR_API}/${vendorId}`, newFormData);
      } else {
        await axios.post(`${environment.api_path}/${GET_VENDOR_API}`, newFormData);
        window.location.reload();
      }
      handleError("Vendor Updated Successfully");
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
      handleError("You don't have permission to Add Vendors");
      return;
    }
    handleOpen();
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    if (id === "email") {
      if (!validateEmail(value)) {
        setEmailError("Enter a valid email address");
      } else {
        setEmailError("");
      }
    }
    if (id === "phone_number") {
      if (!validatePhoneNumber(value)) {
        setPhoneError("Enter a valid 10-digit phone number");
      } else {
        setPhoneError("");
      }
    }
    if (id === "gst_number") {
      if (!validateGSTNumber(value)) {
        setGstError("Enter a valid GST Number");
      } else {
        setGstError("");
      }
    }
    if (id === "pan_number") {
      if (!validatePANNumber(value)) {
        setPanError("Enter a valid PAN Number");
      } else {
        setPanError("");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAddressError("");
    setEmailError("");
    setGstError("");
    setNameError("");
    setPanError("");
    setPhoneError("");
    setVendorNameError("");
    if (!vendorId) {
      setFormData({
        vendor_name: "",
        address: "",
        contact_person: "",
        email: "",
        phone_number: "",
        gst_number: "",
        pan_number: "",
      });
    }
  };

  return (
    <div>
      {vendorId ? (
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
              id="vendor_name"
              label="Vendor Name"
              variant="outlined"
              value={formData.vendor_name}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: vendorNameError ? "red" : "inherit" }}>
              {vendorNameError || "Enter Vendor Name"}
            </FormHelperText>
          </FormControl>
          <div style={{ display: "flex" }}>
            <FormControl style={{ marginRight: "10px" }}>
              <TextField
                id="contact_person"
                label="Contact Person"
                variant="outlined"
                value={formData.contact_person}
                onChange={handleInputChange}
              />
              <FormHelperText style={{ color: nameError ? "red" : "inherit" }}>
                {nameError || "Enter Contact Person"}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                id="phone_number"
                label="Contact Number "
                variant="outlined"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
              <FormHelperText style={{ color: phoneError ? "red" : "inherit" }}>
                {phoneError || "Enter Contact Number"}
              </FormHelperText>
            </FormControl>
          </div>
          <FormControl>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: emailError ? "red" : "inherit" }}>
              {emailError || "Enter Vendor Email"}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <TextField
              id="address"
              label="Address"
              variant="outlined"
              value={formData.address}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: addressError ? "red" : "inherit" }}>
              {addressError || "Enter Vendor Address"}
            </FormHelperText>
          </FormControl>
          <div style={{ display: "flex" }}>
            <FormControl style={{ marginRight: "10px" }}>
              <TextField
                id="gst_number"
                label="GST Number "
                variant="outlined"
                value={formData.gst_number}
                onChange={handleInputChange}
              />
              <FormHelperText style={{ color: gstError ? "red" : "inherit" }}>
                {gstError || "Enter GST Number "}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                id="pan_number"
                label="PAN "
                variant="outlined"
                value={formData.pan_number}
                onChange={handleInputChange}
              />
              <FormHelperText style={{ color: panError ? "red" : "inherit" }}>
                {panError || "Enter PAN"}
              </FormHelperText>
            </FormControl>
          </div>
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
