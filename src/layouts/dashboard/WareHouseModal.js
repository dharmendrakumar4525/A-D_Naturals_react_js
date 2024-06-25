/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import { environment } from "environments/environment";
import { GET_WAREHOUSE_API } from "environments/apiPaths";
import axios from "axios";
import { axiosInstance } from "environments/environment";

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
      <FormControl sx={{ m: 1, minWidth: 250 }}>
        <InputLabel id="demo-simple-select-label">{fieldName}</InputLabel>
        <Select
          label={fieldName}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedItem}
          onChange={handleChange}
          autoWidth
          sx={{ height: "2.75rem" }}
        >
          {availableItems.map((Loacations) => (
            <MenuItem key={Loacations._id} value={Loacations._id}>
              {Loacations[labelKey]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText style={{ color: "inherit" }}>{helperText}</FormHelperText>
      </FormControl>
    </div>
  );
}

const WareHouseModal = ({ open, onClose, filterObjectsByWarehouseId }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [availableWarehouses, setAvailableWarehouses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axiosInstance.get(`${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;
        console.log(warehouseData);
        setAvailableWarehouses(warehouseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangeWarehouse = (event) => {
    const value = event.target.value;
    setSelectedWarehouse(value);
    console.log(value, "modal");
    filterObjectsByWarehouseId(value);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select warehouse </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <SelectRole
            availableItems={availableWarehouses}
            handleChange={handleChangeWarehouse}
            selectedItem={selectedWarehouse}
            fieldName="Warehouse"
            helperText="Select Warehouse"
            labelKey="warehouse_name"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

WareHouseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filterObjectsByWarehouseId: PropTypes.func.isRequired,
};

export default WareHouseModal;
