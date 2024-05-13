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
import { GET_SELLER_API, GET_WAREHOUSE_API, GET_LOCATION_API } from "environments/apiPaths";
import { validatePhoneNumber, validateAadhar } from "validatorsFunctions/contactValidators";

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

export function SelectRole({
  availableItems,
  handleChange,
  selectedItem,
  fieldName,
  helperText,
  labelKey,
  error,
}) {
  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">{fieldName}</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedItem}
          onChange={handleChange}
          autoWidth
          sx={{ height: "2.75rem", width: "330px" }}
        >
          {availableItems.map((Loacations) => (
            <MenuItem key={Loacations._id} value={Loacations._id}>
              {Loacations[labelKey]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText style={{ color: error ? "red" : "inherit" }}>
          {error ? error : helperText}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default function SellerTableModal({ sellerId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availableLoacations, setAvailableLoacations] = useState([]);

  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [availableWarehouses, setAvailableWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    seller_name: "",
    seller_location: "",
    phone: "",
    warehouse: "",
    aadhar_number: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [wareHouseError, setWareHouseError] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    if (sellerId) {
      try {
        const sellersResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const sellerData = sellersResponse.data.data;

        const seller = sellerData.find((seller) => seller._id === sellerId);
        setSelectedWarehouse(seller ? seller.warehouse : "");
        setFormData({
          seller_name: seller ? seller.seller_name : "",
          seller_location: seller ? seller.seller_location : "",
          phone: seller ? seller.phone : "",
          warehouse: seller ? seller.warehouse : "",
          aadhar_number: seller ? seller.aadhar_number : "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // Clear form data if there is no sellerId
      setFormData({
        seller_name: "",
        seller_location: "",
        phone: "",
        warehouse: "",
        aadhar_number: "",
      });
    }
  };

  // useEffect to fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (sellerId) {
        try {
          const locationResponse = await axios.get(`${environment.api_path}/${GET_LOCATION_API}`);
          const locationData = locationResponse.data.data;
          setAvailableLoacations(locationData);

          const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
          const warehouseData = warehouseResponse.data.data;
          setAvailableWarehouses(warehouseData);

          const sellersResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
          const sellerData = sellersResponse.data.data;

          const seller = sellerData.find((seller) => seller._id === sellerId);
          setSelectedWarehouse(seller ? seller.warehouse : "");
          setFormData({
            seller_name: seller ? seller.seller_name : "",
            seller_location: seller ? seller.seller_location : "",
            phone: seller ? seller.phone : "",
            warehouse: seller ? seller.warehouse : "",
            aadhar_number: seller ? seller.aadhar_number : "",
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [sellerId]);

  const handleClose = () => {
    setOpen(false);
    setFormData({
      seller_name: "",
      seller_location: "",
      phone: "",
      warehouse: "",
      aadhar_number: "",
    });
    setSelectedWarehouse("");
    setAadharError("");
    setLocationError("");
    setNameError("");
    setPhoneError("");
    setSubmitError("");
    setWareHouseError("");
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  const handleChangeWarehouse = (event) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.seller_location.trim()) {
        console.log(selectedLocation, "Location");
        setLocationError("Location is required");
      }
      if (!formData.seller_name.trim()) {
        setNameError("Seller Name is required");
      }
      if (!validateAadhar(formData.aadhar_number)) {
        setAadharError("Enter a valid 12 digit Aadhar Number");
      }
      if (!validatePhoneNumber(formData.phone)) {
        setPhoneError("Enter a valid 10-digit phone number");
      }
      if (!selectedWarehouse) {
        setWareHouseError("Warehouse Name is required");
      }

      if (
        !formData.seller_location.trim() ||
        !formData.seller_name.trim() ||
        !selectedWarehouse ||
        !validateAadhar(formData.aadhar_number) ||
        !validatePhoneNumber(formData.phone)
      ) {
        return; // Don't submit if there are validation errors
      }
      let payloadformData;
      if (sellerId) {
        payloadformData = {
          seller_name: formData.seller_name || "",
          aadhar_number: formData.aadhar_number || "",
          phone: formData.phone || "",
          warehouse: selectedWarehouse,
          seller_location: formData.seller_location || "",
        };
        await axios.put(`${environment.api_path}/${GET_SELLER_API}/${sellerId}`, payloadformData);
      } else {
        payloadformData = {
          seller_name: formData.seller_name || "",
          aadhar_number: formData.aadhar_number || "",
          phone: formData.phone || "",
          warehouse: selectedWarehouse,
          seller_location: formData.seller_location || "",
        };

        await axios.post(`${environment.api_path}/${GET_SELLER_API}`, payloadformData);
        window.location.reload();
      }
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
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    if (id === "phone") {
      if (!validatePhoneNumber(value)) {
        setPhoneError("Enter a valid 10-digit phone number");
      } else {
        setPhoneError("");
      }
    }
    if (id === "aadhar_number") {
      if (!validateAadhar(value)) {
        setAadharError("Enter a valid 12-digit Aadhar number");
      } else {
        setAadharError("");
      }
    }
  };

  return (
    <div>
      {sellerId ? (
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
              id="seller_name"
              label="Seller Name"
              variant="outlined"
              value={formData.seller_name}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: nameError ? "red" : "inherit" }}>
              {nameError || "Enter Seller Name"}
            </FormHelperText>
          </FormControl>

          <FormControl>
            <TextField
              id="seller_location"
              label="Seller Location"
              variant="outlined"
              value={formData.seller_location}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: locationError ? "red" : "inherit" }}>
              {locationError || "Enter Seller Location"}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <TextField
              id="phone"
              label="Contact Number "
              variant="outlined"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: phoneError ? "red" : "inherit" }}>
              {phoneError || "Enter Contact Number"}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <TextField
              id="aadhar_number"
              label="Aadhaar Number "
              variant="outlined"
              value={formData.aadhar_number}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: aadharError ? "red" : "inherit" }}>
              {aadharError || "Enter Aadhaar Number"}
            </FormHelperText>
          </FormControl>
          {/* <FormControl>
            <SelectRole
              availableItems={availableLoacations}
              handleChange={handleChangeLoacations}
              selectedItem={selectedLocation}
              fieldName={"Location"}
              helperText={"Select Location"}
              labelKey={"location_name"}
            />
          </FormControl> */}
          <FormControl>
            <SelectRole
              availableItems={availableWarehouses}
              handleChange={handleChangeWarehouse}
              selectedItem={selectedWarehouse}
              fieldName={"Warehouse"}
              helperText={"Select Warehouse"}
              labelKey={"warehouse_name"}
              error={wareHouseError}
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
