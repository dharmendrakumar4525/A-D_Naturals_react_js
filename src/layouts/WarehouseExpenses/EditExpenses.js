/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Table,
  TableBody,
  TableCell,
  FormHelperText,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import { getWarehouseNameByID, formatDate } from "layouts/Orders/utils";
import { environment } from "environments/environment";
import {
  GET_WAREHOUSE_API,
  GET_EXPENSE_API,
  GET_WAREHOUSE_EXPENSE_API,
} from "environments/apiPaths";

const style = {
  position: "relative",
  width: "95%",
  maxWidth: "95%",
  bgcolor: "background.paper",
  left: "5%",
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: "1rem",
  flexDirection: "column",
};

export function SelectWarehouse({
  availableItems,
  handleChange,
  selectedItem,
  fieldName,
  helperText,
  labelKey,
  error,
}) {
  return (
    <FormControl sx={{ m: 0, width: "100%" }}>
      <InputLabel id="checkbox-dropdown-label">Select Warehouses</InputLabel>
      <Select
        labelId="checkbox-dropdown-label"
        multiple
        value={selectedItem}
        onChange={handleChange}
        renderValue={(selected) => selected.map((item) => item.expense_name).join(", ")}
        autoWidth
        sx={{ height: "2.75rem", fontSize: "0.875rem" }}
      >
        {availableItems.map((option) => (
          <MenuItem key={option._id} value={option}>
            <Checkbox
              checked={selectedItem.some((item) => item._id === option._id)}
              sx={{
                transform: "scale(0.75)",
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                },
              }}
            />
            {option.expense_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function EditExpense() {
  const location = useLocation();
  const wareHouseExpense = location.state?.wareHouseExpense;
  const [selectedExpense, setSelectedExpense] = useState([]);
  const [expenseOrder, setExpenseOrder] = useState([]);
  const [availableExpense, setAvailableExpense] = useState([]);
  const [availableWarehouses, setAvailableWarehouses] = useState([]);
  const [wareHouse, setWarehouse] = useState("");
  const [expenseArray, setExpenseArray] = useState([]);
  const [formData, setFormData] = useState({
    warehouse: "",
    expense: "",
    date: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  console.log(wareHouseExpense);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;

        const expenseResponse = await axios.get(`${environment.api_path}/${GET_EXPENSE_API}`);
        const expenseData = expenseResponse.data.data;
        console.log(expenseData);
        setAvailableExpense(expenseData);
        setAvailableWarehouses(warehouseData);
      } catch (error) {
        console.error("Error fetch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (wareHouseExpense) {
      setFormData({
        _id: wareHouseExpense._id,
        warehouse: wareHouseExpense.warehouse,
        expense: wareHouseExpense.expense,
        date: wareHouseExpense.date,
      });

      setWarehouse(getWarehouseNameByID(availableWarehouses, wareHouseExpense.warehouse));

      const matchedExpenses = wareHouseExpense.expense
        .map((w) => availableExpense.find((aw) => aw._id === w.category))
        .filter(Boolean);
      setSelectedExpense(matchedExpenses);
      const updatedWarehouseArray = wareHouseExpense.expense.map((expenses) => ({
        category: expenses.category,
        amount: expenses.amount,
      }));

      setExpenseArray(updatedWarehouseArray);
    }
  }, [expenseOrder]);

  const handleSubmit = async () => {
    try {
      let NewformData = {
        warehouse: formData.warehouse,
        date: formData.date,
        expense: expenseArray,
      };

      console.log(NewformData);
      await axios.put(
        `${environment.api_path}/${GET_WAREHOUSE_EXPENSE_API}/${formData._id}`,
        NewformData
      );

      setSubmitError("Expense Updated Successfully");
      setFormData({
        warehouse: "",
        date: "",
      });

      setSelectedExpense("");
      setSelectedExpense([]);
      setExpenseArray([]);
      navigate("/Warehouse-Expenses");
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        handleError(error.response.data.message);
      } else {
        handleError("An error occurred while submitting the form. Please try again later.");
      }
    }
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  const handleExpenses = (event) => {
    const {
      target: { value },
    } = event;
    const selectedExpense = typeof value === "string" ? value.split(",") : value;
    setSelectedExpense(selectedExpense);

    const updatedExpensesArray = selectedExpense.map((expense) => ({
      category: expense._id,
      amount: expenseArray.find((item) => item.category === expense._id)?.amount || 0,
    }));
    setExpenseArray(updatedExpensesArray);
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuantityChange = (event, category) => {
    const newQuantity = parseInt(event.target.value, 10);
    const updatedExpenseArray = expenseArray.map((expense) =>
      expense.category === category ? { ...expense, amount: newQuantity } : expense
    );
    setExpenseArray(updatedExpenseArray);

    console.log(updatedExpenseArray, "expense");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography
                  variant="h6"
                  color="white"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  Edit Expenses
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Box sx={style}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Warehouse"
                        name="warehouse"
                        value={wareHouse}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date"
                        name="date"
                        value={formatDate(formData.date)}
                        onChange={handleFormDataChange}
                        disabled={true}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={2} style={{ marginTop: "20px" }}>
                        <Grid item xs={12} md={6}>
                          <SelectWarehouse
                            availableItems={availableExpense}
                            handleChange={handleExpenses}
                            selectedItem={selectedExpense}
                            fieldName="Select Expense Category"
                            helperText="Please select Category"
                            labelKey="expense_name"
                            error={false}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <ExpensePriceTable
                            expenseArray={expenseArray}
                            handleQuantityChange={handleQuantityChange}
                            availableExpense={availableExpense}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{
                          padding: "0.75rem",
                          fontSize: "0.875rem",
                          backgroundColor: "#3f51b5", // Primary color
                          "&:hover": {
                            backgroundColor: "#303f9f", // Darker shade of the primary color
                          },
                        }}
                      >
                        Update
                      </Button>
                    </Grid>
                  </Grid>
                  <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                  >
                    <MuiAlert
                      elevation={6}
                      variant="filled"
                      onClose={() => setOpenSnackbar(false)}
                      severity={
                        submitError === "Purchase Order Created Successfully" ? "success" : "error"
                      }
                    >
                      {submitError}
                    </MuiAlert>
                  </Snackbar>
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

function ExpensePriceTable({ expenseArray, handleQuantityChange, availableExpense }) {
  const getExpenseName = (expenseId) => {
    const expense = availableExpense.find((w) => w._id === expenseId);
    return expense ? expense.expense_name : "";
  };

  return (
    <TableContainer component={Paper} sx={{ width: "90%" }}>
      <Table>
        <TableBody>
          {expenseArray.map((expense) => (
            <TableRow key={expense.category}>
              <TableCell>{getExpenseName(expense.category)}</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  value={expense.amount}
                  onChange={(event) => handleQuantityChange(event, expense.category)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
