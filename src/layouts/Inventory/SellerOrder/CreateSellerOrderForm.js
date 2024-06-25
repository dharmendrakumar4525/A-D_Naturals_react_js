/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import Footer from "examples/Footer";
import PropTypes from "prop-types";
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
import {
  GET_WAREHOUSE_API,
  GET_VENDOR_API,
  GET_SELLERORDER_API,
  GET_WAREHOUSEORDER_API,
} from "environments/apiPaths";

import EditIcon from "@mui/icons-material/Edit";
import { GET_SELLER_API } from "environments/apiPaths";
import { getSellerNameByID } from "../utils";
import { axiosInstance } from "environments/environment";

//------------------------Style for main Component's Container ----------------
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

//--------------------------Select Seller Components-----------------------

export function SelectSeller({
  availableItems,
  handleChange,
  selectedItem,
  fieldName,
  helperText,
  labelKey,
  error,
  inventoryCheck,
}) {
  return (
    <FormControl variant="outlined" fullWidth error={!!error} sx={{ m: 0 }}>
      <InputLabel id="checkbox-dropdown-label">{fieldName}</InputLabel>
      <Select
        labelId="checkbox-dropdown-label"
        multiple
        value={selectedItem}
        onChange={handleChange}
        renderValue={(selected) => selected.map((item) => item.seller_name).join(", ")}
        label={fieldName}
        sx={{ height: "2.75rem", fontSize: "0.875rem" }}
        disabled={inventoryCheck}
      >
        {availableItems.map((option) => (
          <MenuItem key={option._id} value={option}>
            <Checkbox
              checked={selectedItem.indexOf(option) > -1}
              sx={{
                transform: "scale(0.75)", // Decreased checkbox size
                "& .MuiSvgIcon-root": {
                  fontSize: 18, // Decreased checkbox icon size
                },
              }}
            />
            {option.seller_name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Select Sellers to Create Seller Orders*</FormHelperText>
    </FormControl>
  );
}
//--------------------------Select Warehouse Components-----------------------

export function SelectWarehouse({
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

//---------------------Main Component-----------------------------------

export default function SellerOrderForm() {
  const [selectedWarehouse, setSelectedHouses] = useState("");
  const [selectedSeller, setSelectedSeller] = useState([]);
  const [availableSellers, setAvailableSellers] = useState([]);
  const [availableWarehouses, setAvailableWarehouses] = useState([]);
  const [sellerArray, setSellerArray] = useState([]);
  const [filteredSeller, setFilteredSeller] = useState([]);
  const [inventory, setInventory] = useState("");
  const [wareHouseOrder, setWareHouseOrder] = useState([]);
  const [sellerOrder, setSellerOrder] = useState([]);
  const [submittedSellers, setSubmittedSellers] = useState([]);
  const [inventoryCheck, setInventoryCheck] = useState(false);
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

  //-----------------------Fetch Data ----------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axiosInstance.get(`${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;
        setAvailableWarehouses(warehouseData);
        const SelllerResponse = await axiosInstance.get(`${GET_SELLER_API}`);
        const SellerData = SelllerResponse.data.data;
        console.log(SellerData);
        setAvailableSellers(SellerData);

        const wareHouseOrderResponse = await axiosInstance.get(`${GET_WAREHOUSEORDER_API}`);
        const wareHouseOrderData = wareHouseOrderResponse.data.data;
        setWareHouseOrder(wareHouseOrderData);

        const sellerOrderResponse = await axiosInstance.get(`${GET_SELLERORDER_API}`);
        const sellerOrderData = sellerOrderResponse.data.data;
        setSellerOrder(sellerOrderData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //----------------------Submit The Data to API-----------------------

  const handleSubmit = async (seller) => {
    console.log(seller, "seller");

    const diff = inventory - seller.received_qty;
    console.log(diff);
    if (diff < 0) {
      setSubmitError("Inventory Low");
      setOpenSnackbar(true);
      return;
    }
    try {
      await axiosInstance.post(`${GET_SELLERORDER_API}`, seller);
      handleError("Purchase Order Created Sucessfully");
      setInventory(inventory - seller.received_qty);
      setSubmittedSellers((prev) => [...prev, seller.seller_id]);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        handleError(error.response.data.message);
      } else {
        handleError("An error occurred while submitting the form. Please try again later.");
      }
    }
  };

  //-----------------------------Handle UpdateFunction------------------

  const handleUpdate = () => {
    if (submittedSellers.length === 0) {
      setInventory(0);
      setSelectedHouses("");
      setSelectedSeller([]);
      setSellerArray([]);
      handleError("No Order Created");
      navigate("/inventory/pending-seller-order");
    } else {
      setInventory(0);
      setSelectedHouses("");
      setSelectedSeller([]);
      setSellerArray([]);
      navigate("/inventory/pending-seller-order");
    }
  };

  //--------------------------Handle Error Display---------------------------
  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  //---------------------------Handle WareHouse Selection -------------------

  const handleSeller = (event) => {
    const {
      target: { value },
    } = event;

    const selectedSeller = typeof value === "string" ? value.split(",") : value;
    setSelectedSeller(selectedSeller);

    const updatedSellerArray = selectedSeller.map((seller) => ({
      seller_id: seller._id,
      received_qty: 0,
      consumed_qty: 0,
      rejected_qty: 0,
      status: "pending",
    }));
    setSellerArray(updatedSellerArray);
  };

  //---------------------Handle changed Warehouse -----------------------

  const handleChangeWarehouse = (event) => {
    const selectedWarehouseId = event.target.value;
    console.log(selectedWarehouseId, "id");
    setSelectedHouses(selectedWarehouseId);

    // Filter sellers that match the selected warehouseId
    const filteredSellers = availableSellers.filter(
      (seller) => seller.warehouse === selectedWarehouseId
    );
    setFilteredSeller(filteredSellers);
    // Filter warehouse orders that match the selected warehouseId
    console.log(wareHouseOrder);
    const filteredWarehouseOrders = wareHouseOrder.filter(
      (order) => order.warehouse === selectedWarehouseId
    );
    console.log(filteredWarehouseOrders, "wareHouseOrder");
    // Filter seller orders that match the filtered sellers' ids
    const filteredSellerObjects = sellerOrder.filter(
      (object) => object.seller_id.warehouse === selectedWarehouseId
    );

    // Calculate total received_qty and rejected_qty for warehouse orders
    const totalWarehouseReceivedQty = filteredWarehouseOrders.reduce(
      (sum, order) => sum + order.received_qty,
      0
    );
    const totalWarehouseRejectedQty = filteredWarehouseOrders.reduce(
      (sum, order) => sum + order.rejected_qty,
      0
    );

    // Calculate total received_qty for seller orders
    const totalSellerReceivedQty = filteredSellerObjects.reduce(
      (sum, order) => sum + order.received_qty,
      0
    );

    // Variables to store the calculated quantities
    const warehouseReceivedQuantity = totalWarehouseReceivedQty;
    const warehouseRejectedQuantity = totalWarehouseRejectedQty;
    const sellerReceivedQuantity = totalSellerReceivedQty;
    const totalInventory =
      warehouseReceivedQuantity - (warehouseRejectedQuantity + sellerReceivedQuantity);
    if (totalInventory <= 0) {
      handleError("Inventory is Empty");
      setInventoryCheck(true);
      setInventory(0);
    } else {
      setInventoryCheck(false);
      setInventory(totalInventory);
    }
  };

  //----------------Handle Quantity Channge for Seller Units ---------------------

  const handleQuantityChange = (event, warehouseId) => {
    const newQuantity = parseInt(event.target.value, 10);
    const updatedSellerArray = sellerArray.map((seller) =>
      seller.seller_id === warehouseId ? { ...seller, received_qty: newQuantity } : seller
    );
    setSellerArray(updatedSellerArray);

    console.log(updatedSellerArray, "warehouse");
  };

  //-------------------------Main Function ------------------------------

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
                  Create Seller Order
                </MDTypography>
              </MDBox>
              <MDBox pt={6} pb={3}>
                <Box sx={style}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <SelectWarehouse
                        availableItems={availableWarehouses}
                        handleChange={handleChangeWarehouse}
                        selectedItem={selectedWarehouse}
                        fieldName="Warehouse"
                        helperText="Select Warehouse"
                        labelKey="warehouse_name"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        id="warehouse_Stock"
                        label="Warehouse Inventory"
                        variant="outlined"
                        value={inventory}
                        type="number"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <FormHelperText style={{ color: "inherit" }}>
                        First Select Warehouse
                      </FormHelperText>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <SelectSeller
                        availableItems={filteredSeller}
                        handleChange={handleSeller}
                        selectedItem={selectedSeller}
                        fieldName="Seller"
                        helperText="Select Sellers"
                        labelKey="Sellers"
                        inventoryCheck={inventoryCheck}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {selectedSeller.length !== 0 && (
                        <WarehousePriceTable
                          sellerArray={sellerArray}
                          handleQuantityChange={handleQuantityChange}
                          availableSellers={availableSellers}
                          submittedSellers={submittedSellers}
                          handleSubmit={handleSubmit}
                        />
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                      sx={{
                        padding: "0.75rem",
                        fontSize: "0.875rem",
                        backgroundColor: "#3f51b5",
                        "&:hover": {
                          backgroundColor: "#303f9f",
                        },
                      }}
                    >
                      Update Seller Order
                    </Button>
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

//------------------------WareHouse Price Table Function-------------------------

function WarehousePriceTable({
  sellerArray,
  handleQuantityChange,
  availableSellers,
  submittedSellers,
  handleSubmit,
}) {
  const getSellerName = (sellerId) => {
    const seller = availableSellers.find((w) => w._id === sellerId);
    return seller ? seller.seller_name : "";
  };

  return (
    <TableContainer component={Paper} sx={{ width: "90%" }}>
      <Table>
        <TableBody>
          {sellerArray.map((seller) => (
            <TableRow key={seller.seller_id}>
              <TableCell sx={{ fontSize: 14 }}>{getSellerName(seller.seller_id)}</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  label="Qty"
                  type="number"
                  value={seller.received_qty}
                  onChange={(event) => handleQuantityChange(event, seller.seller_id)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ color: "white" }}
                  onClick={() => handleSubmit(seller)}
                  disabled={submittedSellers.includes(seller.seller_id)}
                >
                  Add Seller Order
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
