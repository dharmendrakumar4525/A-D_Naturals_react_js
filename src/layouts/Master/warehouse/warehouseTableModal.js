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

export default function SellerTableModal({ warehouseId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get(`http://localhost:3000/api/web/company`);
        const warehouseData = warehouseResponse.data.data;

        const warehouse = warehouseData.find((warehouse) => warehouse._id === warehouseId);

        if (warehouse) {
          setValue("name", warehouse.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (warehouseId) {
      fetchData();
    } else {
      reset({ name: "" });
    }
  }, [warehouseId, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (warehouseId) {
        await axios.put(`http://localhost:3000/api/web/company/${warehouseId}`, {
          name: data.name,
          parent_id: null,
        });
      } else {
        await axios.post(`http://localhost:3000/api/web/company`, {
          name: data.name,
          parent_id: null,
        });
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <FormControl error={Boolean(errors.name)} style={{ marginBottom: "1rem" }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Company Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="name"
                    label="Company Name"
                    variant="outlined"
                    error={Boolean(errors.name)}
                    helperText={errors.name ? errors.name.message : "Enter Company Name"}
                  />
                )}
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ color: "white", alignSelf: "flex-end", width: "332px" }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
