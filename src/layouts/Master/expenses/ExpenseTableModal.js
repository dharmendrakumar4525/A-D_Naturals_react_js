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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { environment } from "environments/environment";
import { GET_LOCATION_API, GET_EXPENSE_API } from "environments/apiPaths";

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

export default function ExpenseTableModal({
  expenseId = null,
  permission,
  setIsRefetch = () => {},
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    expense_name: "",
  });
  const [expenseError, setExpenseError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseResponse = await axios.get(`${environment.api_path}/${GET_EXPENSE_API}`);
        const expenseData = expenseResponse.data.data;

        const expense = expenseData.find((expense) => expense._id === expenseId);

        setFormData({
          expense_name: expense ? expense.expense_name : "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [expenseId]);

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
      handleError("You don't have permission to Add Expense");
      return;
    }
    handleOpen();
  };

  const handleSubmit = async () => {
    try {
      let formData;
      if (expenseId) {
        formData = {
          expense_name: document.getElementById("expense_name")?.value || "",
        };
        await axios.put(`${environment.api_path}/${GET_EXPENSE_API}/${expenseId}`, formData);
      } else {
        formData = {
          expense_name: document.getElementById("expense_name")?.value || "",
        };

        await axios.post(`${environment.api_path}/${GET_EXPENSE_API}`, formData);
        window.location.reload();
      }
      setIsRefetch(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        handleError(error.response.data.message);
      } else {
        handleError("An error occurred while submitting the form. Please try again later.");
      }
    }
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  return (
    <div>
      {expenseId ? (
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
          <FormControl>
            <TextField
              id="expense_name"
              label="Expense Name"
              variant="outlined"
              helperText="Enter Expense"
              value={formData.expense_name}
              onChange={handleInputChange}
            />
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
