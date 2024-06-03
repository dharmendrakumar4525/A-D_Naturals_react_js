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
import { GET_WAREHOUSE_API, GET_SELLER_API } from "environments/apiPaths";
import axios from "axios";

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

const SellerModal = ({ open, onClose, filterObjectsBySellerId }) => {
  const [selectedSeller, setSelectedSeller] = useState("");
  const [availableSeller, setAvailableSeller] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const SellerResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const SellerData = SellerResponse.data.data;
        console.log(SellerData);
        setAvailableSeller(SellerData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangeSeller = (event) => {
    const value = event.target.value;
    setSelectedSeller(event.target.value);
    console.log(value, "modal");
    filterObjectsBySellerId(value);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Seller </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <SelectRole
            availableItems={availableSeller}
            handleChange={handleChangeSeller}
            selectedItem={selectedSeller}
            fieldName="Seller"
            helperText="Select Seller"
            labelKey="seller_name"
          />
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

SellerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  filterObjectsBySellerId: PropTypes.func.isRequired,
};

SelectRole.propTypes = {
  availableItems: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedItem: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
};
export default SellerModal;
