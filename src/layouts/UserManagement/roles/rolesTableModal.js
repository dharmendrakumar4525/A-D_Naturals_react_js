/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { useForm, Controller } from "react-hook-form";

import { FormControl } from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MenuItem from "@mui/material/MenuItem";
import { FormHelperText } from "@mui/material";
import Select from "@mui/material/Select";

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
        <InputLabel id="demo-simple-select-autowidth-label">Company</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={selectedRole}
          onChange={handleChange}
          autoWidth
          label="Company"
          sx={{ height: "2.75rem", width: "330px" }}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role._id} value={role._id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select Company</FormHelperText>
      </FormControl>
    </div>
  );
}

export default function RolesTableModal({ userId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { handleSubmit, control, setValue, reset } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(`http://localhost:3000/api/web/company`);
        const companyData = rolesResponse.data.data.filter((user) => user.parent_id === null);
        setAvailableRoles(companyData);

        const usersResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const userData = usersResponse.data;
        const user = userData.find((user) => user._id === userId);

        if (user) {
          setValue("name", user.name);
          setValue("email", user.email);
        } else {
          reset({
            name: "",
            email: "",
            password: "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        role: "superadmin",
        org_id: selectedRole,
      };

      if (userId) {
        await axios.put(`http://localhost:3000/api/web/users/${userId}`, formData);
      } else {
        await axios.post(`http://localhost:3000/api/web/users/register`, formData);
        window.location.reload();
      }

      setIsRefetch(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ mb: 1 }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Name is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <TextField
                      {...field}
                      id="name"
                      label="Admin Name"
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : "Enter Admin Name"}
                      style={{ width: "330px" }}
                    />
                  </>
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <SelectRole
                availableRoles={availableRoles}
                handleChange={handleRoleChange}
                selectedRole={selectedRole}
              />
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: "Email is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <TextField
                      {...field}
                      id="email"
                      label="Email"
                      variant="outlined"
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : "Enter Admin Email"}
                      style={{ width: "330px" }}
                    />
                  </>
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1, width: "330px" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Password is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <OutlinedInput
                      {...field}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      error={!!fieldState.error}
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
                    <FormHelperText error={!!fieldState.error}>
                      {fieldState.error ? fieldState.error.message : "Enter Password"}
                    </FormHelperText>
                  </>
                )}
              />
            </FormControl>
            <FormControl sx={{ mb: 1 }}>
              <Button
                variant="contained"
                color="primary"
                style={{ color: "white", width: "330px" }}
                type="submit"
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
