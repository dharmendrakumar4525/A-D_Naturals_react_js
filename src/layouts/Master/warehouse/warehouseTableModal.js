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
import { environment } from "environments/environment";
import { GET_WAREHOUSE_API, GET_LOCATION_API } from "environments/apiPaths";

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
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </div>
  );
}

export default function SellerTableModal({ warehouseId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [availableLoacations, setAvailableLoacations] = useState([]);
  const [formData, setFormData] = useState({
    warehouse: "",
    location: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await axios.get(`${environment.api_path}/${GET_LOCATION_API}`);
        const locationData = locationResponse.data.data;
        setAvailableLoacations(locationData);

        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;
        // setAvailableWarehouses(warehouseData);

        const warehouse = warehouseData.find((warehouse) => warehouse._id === warehouseId);

        setFormData({
          warehouse_name: warehouse ? warehouse.warehouse_name : "",
          location: warehouse ? warehouse.location_name : "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [warehouseId]);

  const handleChangeLoacations = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      let formData;
      if (warehouseId) {
        formData = {
          warehouse_name: document.getElementById("warehouse_name")?.value || "",
          location: selectedLocation,
        };
        await axios.put(`${environment.api_path}/warehouse/${warehouseId}`, formData);
      } else {
        formData = {
          warehouse_name: document.getElementById("warehouse_name")?.value || "",
          location: selectedLocation,
        };

        await axios.post(`${environment.api_path}/warehouse`, formData);

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
      {warehouseId ? (
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
              id="warehouse_name"
              label="Warehouse Name"
              variant="outlined"
              helperText="Enter Warehouse Name"
              value={formData.warehouse_name}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl>
            <SelectRole
              availableItems={availableLoacations}
              handleChange={handleChangeLoacations}
              selectedItem={selectedLocation}
              fieldName={"Location"}
              helperText={"Select Location"}
              labelKey={"location_name"}
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
