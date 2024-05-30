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
import { environment } from "environments/environment";
import {
  GET_WAREHOUSE_API,
  GET_VENDOR_API,
  GET_PURCHASEORDER_API,
  GET_WAREHOUSEORDER_API,
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
        renderValue={(selected) => selected.map((item) => item.warehouse_name).join(", ")}
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
            {option.warehouse_name}
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

export default function EditPurchaseOrder() {
  const location = useLocation();
  const purchaseOrder = location.state?.purchaseOrder;
  const [selectedWarehouse, setSelectedHouses] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [wareHouseOrder, setWareHouseOrder] = useState([]);
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
        const orderResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSEORDER_API}`);
        const orderData = orderResponse.data.data;

        setAvailableWarehouses(warehouseData);
        setAvailableVendor(vendorData);
        setWareHouseOrder(orderData);
      } catch (error) {
        console.error("Error fetch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (purchaseOrder && availableWarehouses.length > 0) {
      setFormData({
        _id: purchaseOrder._id,
        order_qty: purchaseOrder.order_qty,
        warehouses: purchaseOrder.warehouses,
        po_no: purchaseOrder.po_no,
        vendor: purchaseOrder.vendor,
        price: purchaseOrder.price,
        resale: {
          qty: purchaseOrder.resale.qty,
          price: purchaseOrder.resale.price,
        },
      });
      setSelectedVendor(purchaseOrder.vendor);
      const matchedWarehouses = purchaseOrder.warehouses
        .map((w) => availableWarehouses.find((aw) => aw._id === w.warehouse))
        .filter(Boolean);
      setSelectedHouses(matchedWarehouses);
      const updatedWarehouseArray = purchaseOrder.warehouses.map((warehouse) => ({
        warehouse: warehouse.warehouse,
        qty: warehouse.qty,
        status: warehouse.status,
      }));

      setWarehouseArray(updatedWarehouseArray);
    }
  }, [purchaseOrder, availableWarehouses]);

  const handleSubmit = async () => {
    const totalQuantity = warehouseArray.reduce((sum, item) => sum + item.qty, 0);
    const diff = formData.order_qty - formData.resale.qty - totalQuantity;
    console.log(warehouseArray, "here warehouse");
    if (diff < 0) {
      setSubmitError("Assigned Quantity Exceeds");
      setOpenSnackbar(true);
      return;
    }
    try {
      let NewformData = {
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
      console.log(purchaseOrder._id);
      await axios.put(
        `${environment.api_path}/${GET_PURCHASEORDER_API}/${formData._id}`,
        NewformData
      );

      setSubmitError("Purchase Order Updated Successfully");
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

      setSelectedVendor("");
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

    const selectedWarehouses = typeof value === "string" ? value.split(",") : value;
    setSelectedHouses(selectedWarehouses);

    const updatedWarehouseArray = selectedWarehouses.map((warehouse) => ({
      warehouse: warehouse._id,
      qty: warehouseArray.find((item) => item.warehouse === warehouse._id)?.qty || 0,
      status: "pending",
    }));
    setWarehouseArray(updatedWarehouseArray);
  };

  const handleChangeVendor = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedVendor(value);
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResaleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      resale: {
        ...prevData.resale,
        [name]: value,
      },
    }));
  };

  const handleQuantityChange = (event, warehouseId) => {
    const newQuantity = parseInt(event.target.value, 10);
    const updatedWarehouseArray = warehouseArray.map((warehouse) =>
      warehouse.warehouse === warehouseId ? { ...warehouse, qty: newQuantity } : warehouse
    );
    setWarehouseArray(updatedWarehouseArray);

    console.log(updatedWarehouseArray, "warehouse");
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
                  Edit Purchase Order
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Box sx={style}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Order Quantity"
                        name="order_qty"
                        value={formData.order_qty}
                        onChange={handleFormDataChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PO Number"
                        name="po_no"
                        value={formData.po_no}
                        onChange={handleFormDataChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SelectVendor
                        availableItems={availableVendors}
                        handleChange={handleChangeVendor}
                        selectedItem={selectedVendor}
                        fieldName="Vendor"
                        helperText="Please select a vendor"
                        labelKey="vendor_name"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        value={formData.price}
                        onChange={handleFormDataChange}
                      />
                      <FormHelperText style={{ color: "inherit" }}>
                        {"Enter Cost Price per item"}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Resale Quantity"
                            name="qty"
                            value={formData.resale.qty}
                            onChange={handleResaleChange}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Resale Price"
                            name="price"
                            value={formData.resale.price}
                            onChange={handleResaleChange}
                          />
                          <FormHelperText style={{ color: "inherit" }}>
                            {"Enter Cost Price per item"}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} style={{ marginTop: "20px" }}>
                        <Grid item xs={12} md={6}>
                          <SelectWarehouse
                            availableItems={availableWarehouses}
                            handleChange={handleWareHouse}
                            selectedItem={selectedWarehouse}
                            fieldName="Select Warehouses"
                            helperText="Please select warehouses"
                            labelKey="warehouse_name"
                            error={false}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <WarehousePriceTable
                            warehouseArray={warehouseArray}
                            handleQuantityChange={handleQuantityChange}
                            availableWarehouses={availableWarehouses}
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

function WarehousePriceTable({ warehouseArray, handleQuantityChange, availableWarehouses }) {
  const getWarehouseName = (warehouseId) => {
    const warehouse = availableWarehouses.find((w) => w._id === warehouseId);
    return warehouse ? warehouse.warehouse_name : "";
  };

  return (
    <TableContainer component={Paper} sx={{ width: "90%" }}>
      <Table>
        <TableBody>
          {warehouseArray.map((warehouse) => (
            <TableRow key={warehouse.warehouse}>
              <TableCell>{getWarehouseName(warehouse.warehouse)}</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  type="number"
                  value={warehouse.qty}
                  onChange={(event) => handleQuantityChange(event, warehouse.warehouse)}
                  disabled={warehouse.status === "completed"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
