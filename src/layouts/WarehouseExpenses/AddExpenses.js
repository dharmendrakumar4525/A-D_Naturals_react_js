import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
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
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import { environment } from "environments/environment";
import { GET_WAREHOUSE_API, GET_EXPENSE_API } from "environments/apiPaths";
import { formatDate } from "layouts/Inventory/utils";
import { GET_WAREHOUSE_EXPENSE_API } from "environments/apiPaths";

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

const datePickerStyle = {
  width: "100%",
  borderRadius: "4px",
  border: "1px solid #ced4da",
  padding: "0.375rem 0.75rem",
  fontSize: "0.875rem",
  lineHeight: "1.5",
  color: "#495057",
  backgroundColor: "#fff",
  backgroundImage: "none",
  boxShadow: "inset 0 1px 1px rgba(0,0,0,.075)",
  transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
  "&:focus": {
    outline: "none",
    borderColor: "#80bdff",
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
  },
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

export function SelectVendor({
  availableItems,
  handleChange,
  selectedItem,
  fieldName,
  helperText,
  labelKey,
}) {
  return (
    <FormControl sx={{ m: 0, width: "100%" }}>
      <InputLabel id="demo-simple-select-autowidth-label">{fieldName}</InputLabel>
      <Select
        label={fieldName}
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={selectedItem}
        onChange={handleChange}
        autoWidth
        sx={{ height: "2.75rem" }}
      >
        {availableItems.map((Locations) => (
          <MenuItem key={Locations._id} value={Locations._id}>
            {Locations[labelKey]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function AddExpense() {
  const [selectedExpense, setSelectedExpense] = useState([]);
  const [availableExpense, setAvailableExpense] = useState([]);
  const [availableWarehouses, setAvailableWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWareHouses] = useState([]);
  const [expenseArray, setExpenseArray] = useState([]);
  const [value, setValue] = React.useState(dayjs(new Date()));
  const [formData, setFormData] = useState({
    warehouse: "",
    date: new Date(),
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;

        const expenseResponse = await axios.get(`${environment.api_path}/${GET_EXPENSE_API}`);
        const expenseData = expenseResponse.data.data;
        setAvailableExpense(expenseData);
        setAvailableWarehouses(warehouseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      let NewformData = {
        warehouse: selectedWarehouse,
        date: value,
        expense: expenseArray,
      };

      console.log(NewformData);
      const response = await axios.post(
        `${environment.api_path}/${GET_WAREHOUSE_EXPENSE_API}`,
        NewformData
      );

      //handleError(response);
      console.log(response, "respobse");
      setFormData({
        warehouse: "",
        date: new Date(),
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

  const handleChangeVendor = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedWareHouses(value);
  };

  const handleQuantityChange = (event, category) => {
    const newAmount = parseInt(event.target.value, 10);
    const updatedExpenseArray = expenseArray.map((expense) =>
      expense.category === category ? { ...expense, amount: newAmount } : expense
    );
    setExpenseArray(updatedExpenseArray);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Add Expenses
                  </MDTypography>
                </MDBox>
                <MDBox p={2}>
                  <Box sx={style}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <SelectVendor
                          availableItems={availableWarehouses}
                          handleChange={handleChangeVendor}
                          selectedItem={selectedWarehouse}
                          fieldName="Warehouse"
                          helperText="Please select a WareHouse"
                          labelKey="warehouse_name"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          fullWidth
                          label="Date"
                          value={value}
                          onChange={(newValue) => setValue(newValue)}
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
                            color: "white",

                            "&:hover": {
                              backgroundColor: "#303f9f", // Darker shade of the primary color
                            },
                          }}
                        >
                          Submit
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
                          submitError === "Purchase Order Created Successfully"
                            ? "success"
                            : "error"
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
    </LocalizationProvider>
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

ExpensePriceTable.propTypes = {
  expenseArray: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  availableExpense: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      expense_name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

SelectWarehouse.propTypes = {
  availableItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      expense_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedItem: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      expense_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  fieldName: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  labelKey: PropTypes.string.isRequired,
  error: PropTypes.bool,
};

SelectVendor.propTypes = {
  availableItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      expense_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedItem: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      expense_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  fieldName: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  labelKey: PropTypes.string.isRequired,
  error: PropTypes.bool,
};
