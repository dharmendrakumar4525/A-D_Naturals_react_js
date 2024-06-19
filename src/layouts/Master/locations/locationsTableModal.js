/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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

export default function LocationsTableModal({ locationId = null, setIsRefetch = () => {} }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      dept: "",
      particular: "",
      risk: "",
      date: null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await axios.get(`http://localhost:3000/api/web/compliance`);
        const locationData = locationResponse.data.data;

        const location = locationData.find((location) => location._id === locationId);

        if (location) {
          setValue("dept", location.dept);
          setValue("particular", location.particular);
          setValue("risk", location.risk);
          setValue("date", location.date ? dayjs(location.date) : null);
        } else {
          reset();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (locationId) {
      fetchData();
    } else {
      reset();
    }
  }, [locationId, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        date: data.date ? dayjs(data.date).utc().add(1, "day").format("DD-MM-YYYY") : null,
      };
      console.log("date", data.date);
      console.log("00000000formData00000000", formData);

      if (locationId) {
        await axios.put(`http://localhost:3000/api/web/compliance/${locationId}`, formData);
      } else {
        await axios.post(`http://localhost:3000/api/web/compliance`, formData);
        window.location.reload();
      }
      setIsRefetch(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      {locationId ? (
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
                name="dept"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="dept"
                    label="Department"
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : "Enter Department"}
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <Controller
                name="particular"
                control={control}
                rules={{ required: "Particular is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="particular"
                    label="Particular"
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : "Enter Particular"}
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <Controller
                name="risk"
                control={control}
                rules={{ required: "Risk is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="risk"
                    label="Risk"
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : "Enter Risk"}
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Date"
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        console.log("hhhh", date);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!error}
                          helperText={error ? error.message : "Enter Date"}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
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
