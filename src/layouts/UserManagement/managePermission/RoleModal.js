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
import { GET_ROLES_API } from "environments/apiPaths";
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

const RoleModal = ({ open, onClose, filterObjectsByRoleId }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [availableRole, setAvailableRole] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await axiosInstance.get(`${GET_ROLES_API}`);
        const roleData = roleResponse.data;
        console.log(roleData);
        setAvailableRole(roleData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleChangeRole = (event) => {
    const value = event.target.value;
    setSelectedRole(event.target.value);
    console.log(value, "modal");
    filterObjectsByRoleId(value, availableRole);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Role </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <SelectRole
            availableItems={availableRole}
            handleChange={handleChangeRole}
            selectedItem={selectedRole}
            fieldName="Role"
            helperText="Select Role"
            labelKey="role"
          />
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
