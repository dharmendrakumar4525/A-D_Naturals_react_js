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
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { validateEmail, validatePhoneNumber } from "validatorsFunctions/contactValidators";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

export function SelectRole({ availableRoles, handleChange, selectedRole, roleError }) {
  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Roles</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedRole}
          onChange={handleChange}
          autoWidth
          label="Role"
          sx={{ height: "2.75rem", width: "330px" }}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role._id} value={role._id}>
              {role.role}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText style={{ color: roleError ? "red" : "inherit" }}>
          {roleError ? roleError : "Select Role"}
        </FormHelperText>
      </FormControl>
    </div>
  );
}

export default function UserTableModal({ userId = null, permission, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get("http://localhost:3000/api/web/roles");
        setAvailableRoles(rolesResponse.data);

        if (userId) {
          const usersResponse = await axios.get("http://localhost:3000/api/web/users");
          const user = usersResponse.data.find((user) => user._id === userId);

          setSelectedRole(user.role);
          setFormData({
            name: user ? user.name : "",
            email: user ? user.email : "",
            phone: user ? user.phone : "",
            password: "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
    setRoleError("");
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setRoleError("");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
      handleError("You don't have permission to Add User");
      return;
    }
    handleOpen();
  };

  const handleSubmit = async () => {
    try {
      if (!selectedRole) {
        setRoleError("Role is required");
      }
      if (!formData.name.trim()) {
        setNameError("Name is required");
      }
      if (!validateEmail(formData.email) || !formData.email.trim()) {
        setEmailError("Enter a valid email address");
      }
      if (!validatePhoneNumber(formData.phone)) {
        setPhoneError("Enter a valid 10-digit phone number");
      }

      if (
        !selectedRole ||
        !formData.name.trim() ||
        !validateEmail(formData.email) ||
        !validatePhoneNumber(formData.phone)
      ) {
        return; // Don't submit if there are validation errors
      }
      let formPayload;
      if (userId) {
        formPayload = {
          name: formData.name || "",
          email: formData.email || "",
          phone: formData.phone || "",
          role: selectedRole,
          password: formData.password || "",
        };
        const response = await axios.put(
          `http://localhost:3000/api/web/users/${userId}`,
          formPayload
        );
        console.log("responceccccccccccc", response);
      } else {
        if (formData.password === "") {
          formPayload = {
            name: formData.name || "",
            email: formData.email || "",
            phone: formData.phone || "",
            role: selectedRole,
          };
        } else {
          formPayload = {
            name: formData.name || "",
            email: formData.email || "",
            phone: formData.phone || "",
            role: selectedRole,
            password: formData.password || "",
          };
        }

        console.log("formPayload", formPayload);
        const response = await axios.post(
          "http://localhost:3000/api/web/users/register",
          formPayload
        );
        window.location.reload();
      }
      setIsRefetch(true);
      handleError("User Updated Successully");
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
    if (id === "phone") {
      if (!validatePhoneNumber(value)) {
        setPhoneError("Enter a valid 10-digit phone number");
      } else {
        setPhoneError("");
      }
    }
    if (id === "name") {
      if (!value.trim()) {
        setNameError("Name is required");
      } else {
        setNameError("");
      }
    }
  };

  return (
    <div>
      {userId ? (
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
          <FormControl error={!!nameError}>
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: nameError ? "red" : "inherit" }}>
              {nameError || "Enter User Name"}
            </FormHelperText>
          </FormControl>
          <FormControl error={!!emailError}>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: emailError ? "red" : "inherit" }}>
              {emailError || "Enter User Email"}
            </FormHelperText>
          </FormControl>

          <FormControl error={!!phoneError}>
            <TextField
              id="phone"
              label="Contact Number"
              variant="outlined"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <FormHelperText style={{ color: phoneError ? "red" : "inherit" }}>
              {phoneError || "Enter Contact Number"}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <SelectRole
              availableRoles={availableRoles}
              handleChange={handleChange}
              selectedRole={selectedRole}
              roleError={roleError}
            />
          </FormControl>
          <FormControl sx={{ m: 0, width: "330px" }} variant="outlined" error={!!formData.password}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            <FormHelperText style={{ color: passwordError ? "red" : "inherit" }}>
              {passwordError || "Enter Password"}
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
