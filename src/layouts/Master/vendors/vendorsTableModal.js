/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import { environment } from "environments/environment";
import { GET_VENDOR_API } from "environments/apiPaths";

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

export default function VendorTableModal({ vendorId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = useState({
    vendor_name: "",
    address: "",
    contact_person: "",
    email: "",
    phone_number: "",
    gst_number: "",
    pan_number: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorResponse = await axios.get(`${environment.api_path}/${GET_VENDOR_API}`);
        const vendorData = vendorResponse.data.data;

        const vendor = vendorData.find((vendor) => vendor._id === vendorId);

        setFormData({
          vendor_name: vendor ? vendor.vendor_name : "",
          contact_person: vendor ? vendor.contact_person : "",
          address: vendor ? vendor.address : "",
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
      let formData;
      if (vendorId) {
        formData = {
          vendor_name: document.getElementById("vendor_name")?.value || "",
          contact_person: document.getElementById("contact_person")?.value || "",
          address: document.getElementById("address")?.value || "",
          email: document.getElementById("email")?.value || "",
          phone_number: document.getElementById("phone_number")?.value || "",
          gst_number: document.getElementById("gst_number")?.value || "",
          pan_number: document.getElementById("pan_number")?.value || "",
        };
        await axios.put(`${environment.api_path}/${GET_VENDOR_API}/${vendorId}`, formData);
      } else {
        formData = {
          vendor_name: document.getElementById("vendor_name")?.value || "",
          contact_person: document.getElementById("contact_person")?.value || "",
          address: document.getElementById("address")?.value || "",
          email: document.getElementById("email")?.value || "",
          phone_number: document.getElementById("phone_number")?.value || "",
          gst_number: document.getElementById("gst_number")?.value || "",
          pan_number: document.getElementById("pan_number")?.value || "",
        };

        await axios.post(`${environment.api_path}/${GET_VENDOR_API}`, formData);
        window.location.reload();
      }
      setIsRefetch(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  return (
    <div>
      {vendorId ? (
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
              id="vendor_name"
              label="Vendor Name"
              variant="outlined"
              helperText="Enter Vendor Name"
              value={formData.vendor_name}
              onChange={handleInputChange}
            />
          </FormControl>
          <div style={{ display: "flex" }}>
            <FormControl style={{ marginRight: "10px" }}>
              <TextField
                id="contact_person"
                label="Contact Person"
                variant="outlined"
                helperText="Enter Contact Person "
                value={formData.contact_person}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <TextField
                id="phone_number"
                label="Contact Number "
                variant="outlined"
                helperText="Enter Contact Number "
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <FormControl>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              helperText="Enter Vendor Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="address"
              label="Address"
              variant="outlined"
              helperText="Enter Vendor Address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </FormControl>
          <div style={{ display: "flex" }}>
            <FormControl style={{ marginRight: "10px" }}>
              <TextField
                id="gst_number"
                label="GST Number "
                variant="outlined"
                helperText="Enter GST Number "
                value={formData.gst_number}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <TextField
                id="pan_number"
                label="PAN "
                variant="outlined"
                helperText="Enter PAN "
                value={formData.pan_number}
                onChange={handleInputChange}
              />
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
    </div>
  );
}
