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
import { FormControl, FormHelperText } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

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

export default function UserTableModal({ userId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      role: "user",
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const userData = usersResponse.data;

        const user = userData.find((user) => user._id === userId);
        if (user) {
          setValue("name", user.name);
          setValue("email", user.email);
        } else {
          reset();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      fetchData();
    } else {
      reset();
    }
  }, [userId, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      console.log("Login_User_OrgId", Login_User_OrgId);
      let formData = {
        ...data,
        org_id: Login_User_OrgId,
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
      toast.error(`${error.response.data}`);
    }
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
            <FormControl sx={{ mb: 1, width: "330px" }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "User Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextField
                      {...field}
                      id="name"
                      label="User Name"
                      variant="outlined"
                      error={!!error}
                    />
                    <FormHelperText>{error ? error.message : "Enter User Name"}</FormHelperText>
                  </>
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1, width: "330px" }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextField
                      {...field}
                      id="email"
                      label="Email"
                      variant="outlined"
                      error={!!error}
                    />
                    <FormHelperText>{error ? error.message : "Enter Email"}</FormHelperText>
                  </>
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1, width: "330px" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <OutlinedInput
                      {...field}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      error={!!error}
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
                    <FormHelperText>{error ? error.message : "Enter Password"}</FormHelperText>
                  </>
                )}
              />
            </FormControl>

            <FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ color: "white", width: "330px" }}
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
