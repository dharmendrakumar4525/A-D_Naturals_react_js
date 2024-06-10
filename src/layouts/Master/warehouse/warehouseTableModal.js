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
import { GET_WAREHOUSE_API, GET_LOCATION_API, GET_USERS_API } from "environments/apiPaths";

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
          label={fieldName}
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

export default function SellerTableModal({
  warehouseId = null,
  permission,
  setIsRefetch = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availableLoacations, setAvailableLoacations] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [availableUser, setAvailableUsers] = useState("");
  const [formData, setFormData] = useState({
    warehouse_name: "",
    location_name: "",
    address: {
      street_address: "",
      state: "",
      city: "",
      zip_code: "",
    },
  });
  const [locationError, setLocationError] = useState("");
  const [wareHouseError, setWareHouseError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [zipError, setZipError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    if (warehouseId) {
      try {
        const locationResponse = await axios.get(`${environment.api_path}/${GET_LOCATION_API}`);
        const locationData = locationResponse.data.data;
        setAvailableLoacations(locationData);

        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;
        const userResponse = await axios.get(`${environment.api_path}/${GET_USERS_API}`);
        const userData = userResponse.data;
        console.log(userData);

        setAvailableUsers(userData);

        const warehouse = warehouseData.find((warehouse) => warehouse._id === warehouseId);
        console.log(warehouse);
        setSelectedLocation(warehouse ? warehouse.location : "");
        setSelectedUser(warehouse ? warehouse.manager : "");

        setFormData({
          warehouse_name: warehouse ? warehouse.warehouse_name : "",
          location_name: warehouse ? warehouse.location_name : "",
          address: {
            street_address: warehouse ? warehouse.address?.street_address : "",
            state: "",
            city: "",
            zip_code: warehouse ? warehouse.address?.zip_code : "",
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // Clear form data if there is no warehouseId
      setFormData({
        warehouse_name: "",
        location_name: "",
      });
    }
  };

  // useEffect to fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await axios.get(`${environment.api_path}/${GET_LOCATION_API}`);
        const locationData = locationResponse.data.data;
        setAvailableLoacations(locationData);

        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;
        const userResponse = await axios.get(`${environment.api_path}/${GET_USERS_API}`);
        const userData = userResponse.data;
        console.log(userData);

        setAvailableUsers(userData);

        const warehouse = warehouseData.find((warehouse) => warehouse._id === warehouseId);
        setSelectedUser(warehouse ? warehouse.manager : "");

        console.log(warehouse);
        setSelectedLocation(warehouse ? warehouse.location : "");
        setFormData({
          warehouse_name: warehouse ? warehouse.warehouse_name : "",
          location_name: warehouse ? warehouse.location_name : "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [warehouseId]);

  const handleEditModal = () => {
    if (permission[2]?.isSelected === false) {
      handleError("You don't have permission to Edit");
      return;
    }
    handleOpen();
  };

  const handleAddModal = () => {
    if (permission[0]?.isSelected === false) {
      handleError("You don't have permission to Add Warehouse");
      return;
    }
    handleOpen();
  };

  const handleChangeLoacations = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleChangeUser = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      warehouse_name: "",
      location_name: "",
      address: {
        street_address: "",
        state: "",
        city: "",
        zip_code: "",
      },
    });
    setSelectedLocation("");
    setLocationError("");
    setWareHouseError("");
    setAddressError("");
    setZipError("");
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      if (!formData.warehouse_name.trim()) {
        setWareHouseError("Warehouse Name is required");
      }
      if (!selectedLocation) {
        setLocationError("Location is required");
      }
      if (!formData?.address?.street_address.trim()) {
        setAddressError("Address is required");
      }
      if (!formData?.address?.zip_code.trim()) {
        setZipError("ZIP Code is required");
      }

      if (
        !formData.warehouse_name.trim() ||
        !formData?.address?.zip_code.trim() ||
        !formData?.address?.street_address.trim() ||
        !selectedLocation
      ) {
        return; // Don't submit if there are validation errors
      }
      let NewformData;
      if (warehouseId) {
        NewformData = {
          warehouse_name: formData.warehouse_name || "",
          location: selectedLocation,
          address: formData.address,
          manager: selectedUser,
        };
        console.log(NewformData);
        await axios.put(`${environment.api_path}/warehouse/${warehouseId}`, NewformData);
      } else {
        NewformData = {
          warehouse_name: formData.warehouse_name || "",
          location: selectedLocation,
          address: formData.address,
          manager: selectedUser,
        };

        await axios.post(`${environment.api_path}/warehouse`, NewformData);
      }

      setIsRefetch(true);
      window.location.reload();
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

    if (["street_address", "state", "city", "zip_code"].includes(id)) {
      // Update the address object within formData
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [id]: value,
        },
      }));
    } else {
      // Update the main formData object
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  return (
    <div>
      {warehouseId ? (
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
              id="warehouse_name"
              label="Warehouse Name"
              variant="outlined"
              value={formData.warehouse_name}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: wareHouseError ? "red" : "inherit" }}>
              {wareHouseError || "Enter Warehouse Name"}
            </FormHelperText>
          </FormControl>

          <FormControl>
            <SelectRole
              availableItems={availableLoacations}
              handleChange={handleChangeLoacations}
              selectedItem={selectedLocation}
              fieldName={"Location"}
              helperText={"Select Location"}
              labelKey={"location_name"}
              error={locationError}
            />
          </FormControl>
          <FormControl>
            <SelectRole
              availableItems={availableUser}
              handleChange={handleChangeUser}
              selectedItem={selectedUser}
              fieldName={"Manager"}
              helperText={"Select Warehouse Manager"}
              labelKey={"name"}
              error={locationError}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="street_address"
              label="Warehouse Address"
              variant="outlined"
              value={formData.address?.street_address}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: addressError ? "red" : "inherit" }}>
              {addressError || "Enter Warehouse Address"}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <TextField
              id="zip_code"
              label="ZIP Code"
              variant="outlined"
              value={formData.address?.zip_code}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: zipError ? "red" : "inherit" }}>
              {zipError || "Enter ZIP Code"}
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
