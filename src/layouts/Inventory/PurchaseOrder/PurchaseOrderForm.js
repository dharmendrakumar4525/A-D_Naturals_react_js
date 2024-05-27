/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText,
  FormControl,
  Typography,
} from "@mui/material";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { environment } from "environments/environment";
import { GET_WAREHOUSE_API, GET_VENDOR_API, GET_PURCHASEORDER_API } from "environments/apiPaths";

import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "relative",
  width: "95%", // Ensure it fits within the parent
  maxWidth: "95%", // Ensure it fits within the parent
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
    <div>
      <FormControl sx={{ m: 0, width: "100%" }}>
        <InputLabel id="checkbox-dropdown-label">Select Warehouses</InputLabel>
        <Select
          labelId="checkbox-dropdown-label"
          multiple
          value={selectedItem}
          onChange={handleChange}
          renderValue={(selected) => selected.map((item) => item.warehouse_name).join(", ")}
          autoWidth
          sx={{ height: "2.75rem", fontSize: "0.875rem" }}
        >
          {availableItems.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                checked={selectedItem.indexOf(option) > -1}
                sx={{
                  transform: "scale(0.75)", // Decreased checkbox size
                  "& .MuiSvgIcon-root": {
                    fontSize: 18, // Decreased checkbox icon size
                  },
                }}
              />
              {option.warehouse_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
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
    <div>
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
          {availableItems.map((Loacations) => (
            <MenuItem key={Loacations._id} value={Loacations._id}>
              {Loacations[labelKey]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText style={{ color: "inherit" }}>{helperText}</FormHelperText>
      </FormControl>
    </div>
  );
}

export default function PurchaseOrderForm() {
  const [selectedWarehouse, setSelectedHouses] = useState([]);
  const [selectedVendor, setSelectedVedor] = useState("");
  const [availableVendors, setAvailableVendor] = useState([]);
  const [availableWarehouses, setAvailableWarehouses] = useState([]);
  const [warehouseArray, setWarehouseArray] = useState([]);
  const [formData, setFormData] = useState({
    order_qty: 0,
    warehouses: [],
    po_no: "",
    vendor: "",
    price: 0,
    resale: {
      qty: "",
      price: "",
    },
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;

        const vendorResponse = await axios.get(`${environment.api_path}/${GET_VENDOR_API}`);
        const vendorData = vendorResponse.data.data;

        const purchaseOrderResponse = await axios.get(
          `${environment.api_path}/${GET_PURCHASEORDER_API}`
        );
        const purchaseOrderData = purchaseOrderResponse.data.data;

        console.log(purchaseOrderData);
        setFormData((prevData) => ({
          ...prevData,
          po_no: (purchaseOrderData?.length || 0) + 1,
        }));
        setAvailableWarehouses(warehouseData);
        setAvailableVendor(vendorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    console.log(formData);
    const totalQuantity = warehouseArray.reduce((sum, item) => sum + item.qty, 0);
    const diff = formData.order_qty - formData.resale.qty - totalQuantity;
    console.log(diff);
    if (diff < 0) {
      setSubmitError("Assigned Quantity Exeeds");
      setOpenSnackbar(true);
      return;
    }
    try {
      let NewformData;

      NewformData = {
        order_qty: parseInt(formData.order_qty),
        warehouses: warehouseArray,
        po_no: formData.po_no.toString(),
        vendor: selectedVendor,
        price: parseInt(formData.price),
        resale: {
          qty: formData.resale.qty,
          price: formData.resale.price,
        },
      };
      console.log(NewformData);
      await axios.post(`${environment.api_path}/${GET_PURCHASEORDER_API}`, NewformData);
      setSubmitError("Purchase Order Created Sucessfully");
      setFormData({
        order_qty: 0,
        warehouses: [],
        po_no: "",
        vendor: "",
        price: 0,
        resale: {
          qty: "",
          price: "",
        },
      });

      setSelectedVedor("");
      setSelectedHouses([]);
      setWarehouseArray([]);
      navigate("/view-orders/purchase-orders");
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

  const handleWareHouse = (event) => {
    const {
      target: { value },
    } = event;

    // Parse the selected value
    const selectedWarehouses = typeof value === "string" ? value.split(",") : value;

    // Update the selected warehouses state
    setSelectedHouses(selectedWarehouses);

    // Update the warehouseArray state based on selection
    const updatedWarehouseArray = selectedWarehouses.map((warehouseId) => ({
      warehouse: warehouseId._id,
      qty: 0,
    }));
    setWarehouseArray(updatedWarehouseArray);
  };

  useEffect(() => {
    const updatedWarehouseArray = selectedWarehouse.map((warehouseId) => ({
      warehouse: warehouseId._id,
      qty: 0,
    }));
    setWarehouseArray(updatedWarehouseArray);
    console.log(warehouseArray);
  }, [selectedWarehouse]);

  const handleChangeVendor = (event) => {
    setSelectedVedor(event.target.value);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleReSellValueChange = (event) => {
    const { id, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      resale: {
        ...prevData.resale,
        [id]: value,
      },
    }));
  };

  const handleQuantityChange = (warehouseId, value) => {
    setWarehouseArray((prevArray) =>
      prevArray.map((item) =>
        item.warehouse === warehouseId ? { ...item, qty: parseInt(value, 10) || 0 } : item
      )
    );
  };

  const WarehousePriceTable = ({ warehouses }) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {warehouses.map((warehouse, index) => (
              <TableRow key={index}>
                <TableCell
                  align="center"
                  sx={{ fontSize: "0.875rem", fontWeight: "bold", width: "60%" }}
                >
                  {warehouse.warehouse_name}
                </TableCell>
                <TableCell align="center" sx={{ height: 20 }}>
                  <TextField
                    id={`qty-${index}`}
                    name={`Quantity-${index}`}
                    type="number"
                    variant="outlined"
                    inputProps={{ min: 0 }}
                    label="Qty"
                    sx={{ width: "100%" }}
                    value={warehouseArray.find((w) => w.warehouse === warehouse._id)?.qty || ""}
                    onChange={(e) => handleQuantityChange(warehouse._id, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  return (
    <MDBox pt={6} pb={3}>
      <Grid container spacing={6}>
        <Box sx={style}>
          <Box
            sx={{
              flexDirection: "row",
              display: "flex",
              width: "70%",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ m: 0, width: "100%" }}>
              <TextField
                id="order_qty"
                label="Order Quantity"
                variant="outlined"
                value={formData.order_qty}
                onChange={handleInputChange}
                type="number"
              />
              <FormHelperText style={{ color: "inherit" }}>
                {"Enter Purchased Order Quantity"}
              </FormHelperText>
            </FormControl>
            <FormControl sx={{ width: "47%" }}>
              <TextField
                id="po_no"
                label="PO Number"
                variant="outlined"
                value={formData.po_no}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: true,
                }}
              />
              <FormHelperText style={{ color: "inherit" }}>{"Enter PO Number"}</FormHelperText>
            </FormControl>
          </Box>
          <Box
            sx={{
              flexDirection: "row",
              width: "70%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormControl style={{ width: "47%" }}>
              <SelectVendor
                availableItems={availableVendors}
                handleChange={handleChangeVendor}
                selectedItem={selectedVendor}
                fieldName={"Vendor"}
                helperText={"Select Vendor"}
                labelKey={"vendor_name"}
              />
            </FormControl>
            <FormControl sx={{ width: "47%" }}>
              <TextField
                id="price"
                label="Enter Price"
                variant="outlined"
                value={formData.price}
                onChange={handleInputChange}
                type="number"
              />
              <FormHelperText style={{ color: "inherit" }}>
                {"Enter Cost Price per item"}
              </FormHelperText>
            </FormControl>
          </Box>
          <Box
            sx={{
              flexDirection: "row",
              width: "70%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: "47%" }}>
              <SelectWarehouse
                availableItems={availableWarehouses}
                handleChange={handleWareHouse}
                selectedItem={selectedWarehouse}
                fieldName={"Warehouse"}
                helperText={"Select Warehouses"}
                labelKey={"warehouses"}
              />
            </FormControl>

            <FormControl sx={{ width: "47%" }}>
              {selectedWarehouse.length !== 0 ? (
                <WarehousePriceTable warehouses={selectedWarehouse} />
              ) : (
                ""
              )}
            </FormControl>
          </Box>

          <CustomDivider text="ReSelling Details" />

          <Box
            sx={{
              flexDirection: "row",
              width: "70%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: "47%" }}>
              <TextField
                id="qty"
                label="Enter Quantity"
                variant="outlined"
                value={formData.resale.qty}
                onChange={handleReSellValueChange}
              />
              <FormHelperText style={{ color: "inherit" }}>
                {"Enter Resell Quantity"}
              </FormHelperText>
            </FormControl>
            <FormControl sx={{ width: "47%" }}>
              <TextField
                id="price"
                label="Resell Price"
                variant="outlined"
                value={formData.resale.price}
                onChange={handleReSellValueChange}
              />
              <FormHelperText style={{ color: "inherit" }}>{"Enter Price per Item"}</FormHelperText>
            </FormControl>
          </Box>
          <FormControl>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{ color: "white" }}
            >
              Submit
            </Button>
          </FormControl>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setOpenSnackbar(false)}
            severity="error"
          >
            {submitError}
          </MuiAlert>
        </Snackbar>
      </Grid>
    </MDBox>
  );
}

const CustomDivider = ({ text }) => (
  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
    <Typography variant="body1" sx={{ whiteSpace: "nowrap", mr: 1, fontSize: "0.875rem" }}>
      {text}
    </Typography>
    <Divider sx={{ flexGrow: 1, borderWidth: 1, borderColor: "rgba(0, 0, 0, 1)" }} />
  </Box>
);
