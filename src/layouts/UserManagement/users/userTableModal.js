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

export function SelectRole({ availableRoles, handleChange, selectedRole }) {
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
        <FormHelperText>Select Role</FormHelperText>
      </FormControl>
    </div>
  );
}

export default function UserTableModal({ userId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get("http://localhost:3000/api/web/roles");
        setAvailableRoles(rolesResponse.data);

        const usersResponse = await axios.get("http://localhost:3000/api/web/users");
        const user = usersResponse.data.find((user) => user._id === userId);
        setFormData({
          name: user ? user.name : "",
          email: user ? user.email : "",
          phone: user ? user.phone : 0,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    try {
      let formData;
      if (userId) {
        formData = {
          name: document.getElementById("name")?.value || "",
          email: document.getElementById("email")?.value || "",
          phone: document.getElementById("phone")?.value || "",
          role: selectedRole,
          password: document.getElementById("password")?.value || "",
        };
        const response = await axios.put(`http://localhost:3000/api/web/users/${userId}`, formData);
      } else {
        formData = {
          name: document.getElementById("name")?.value || "",
          email: document.getElementById("email")?.value || "",
          phone: document.getElementById("phone")?.value || "",
          role: selectedRole,
          password: document.getElementById("password")?.value || "",
        };
        console.log("Form Data", formData);
        const response = await axios.post("http://localhost:3000/api/web/users/register", formData);
        console.log("response", response);
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
    console.log("handleInputChange", formData);
  };

  return (
    <div>
      {userId ? (
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
              id="name"
              label="Name"
              variant="outlined"
              helperText="Enter User Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              helperText="Enter User Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              id="phone"
              label="Contact Number "
              variant="outlined"
              helperText="Enter Contact Number "
              value={formData.phone}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <SelectRole
              availableRoles={availableRoles}
              handleChange={handleChange}
              selectedRole={selectedRole}
            />
          </FormControl>
          <FormControl sx={{ m: 0, width: "330px" }} variant="outlined">
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
            <FormHelperText>Enter Password</FormHelperText>
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
