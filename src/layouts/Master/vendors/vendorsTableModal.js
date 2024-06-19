/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { FormControl, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
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

export default function VendorTableModal({ vendorId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorResponse = await axios.get(`http://localhost:3000/api/web/company`);
        const vendorData = vendorResponse.data.data;

        const vendor = vendorData.find((vendor) => vendor._id === vendorId);

        if (vendor) {
          setValue("name", vendor.name);
        } else {
          reset();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (vendorId) {
      fetchData();
    } else {
      reset();
    }
  }, [vendorId, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      let formData = {
        ...data,
        parent_id: Login_User_OrgId,
      };

      if (vendorId) {
        await axios.put(`http://localhost:3000/api/web/company/${vendorId}`, formData);
      } else {
        await axios.post(`http://localhost:3000/api/web/company`, formData);
        window.location.reload();
      }
      setIsRefetch(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`${error.response.data.message}`);
    }
  };

  return (
    <div>
      {vendorId ? (
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <FormControl sx={{ mb: 1 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Entity Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextField
                      {...field}
                      id="name"
                      label="Entity Name"
                      variant="outlined"
                      error={!!error}
                      helperText={error ? error.message : "Enter Entity Name"}
                    />
                  </>
                )}
              />
            </FormControl>
            <FormControl>
              <Button type="submit" variant="contained" color="primary" style={{ color: "white" }}>
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
