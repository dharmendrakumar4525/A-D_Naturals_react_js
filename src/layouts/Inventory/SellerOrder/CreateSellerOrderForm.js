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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;
        setAvailableWarehouses(warehouseData);
        const SelllerResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const SellerData = SelllerResponse.data.data;
        console.log(SellerData);
        setAvailableSellers(SellerData);

        const wareHouseOrderResponse = await axios.get(
          `${environment.api_path}/${GET_WAREHOUSEORDER_API}`
        );
        const wareHouseOrderData = wareHouseOrderResponse.data.data;
        setWareHouseOrder(wareHouseOrderData);

        const sellerOrderResponse = await axios.get(
          `${environment.api_path}/${GET_SELLERORDER_API}`
        );
        const sellerOrderData = sellerOrderResponse.data.data;
        setSellerOrder(sellerOrderData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      await axios.post(`${environment.api_path}/${GET_SELLERORDER_API}`, seller);
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

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  const handleSeller = (event) => {
    const {
      target: { value },
    } = event;

    // Parse the selected value
    const selectedSellers = typeof value === "string" ? value.split(",") : value;

    // Update the selected warehouses state
    setSelectedSeller(selectedSellers);

    // Update the warehouseArray state based on selection
    const updatedSellerArray = selectedSeller.map((sellerId) => ({
      seller_id: sellerId._id,
      received_qty: 0,
      consumed_qty: 0,
      rejected_qty: 0,
    }));
    setSellerArray(updatedSellerArray);
  };

  useEffect(() => {
    const updatedSellerArray = selectedSeller.map((sellerId) => ({
      seller_id: sellerId._id,
      received_qty: 0,
      consumed_qty: 0,
      rejected_qty: 0,
    }));
    setSellerArray(updatedSellerArray);
    console.log(sellerArray);
  }, [selectedSeller]);

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

  const handleQuantityChange = (event, sellerId) => {
    const newQuantity = parseInt(event.target.value, 10);
    const updatedSellerArray = sellerArray.map((seller) =>
      seller.seller_id === sellerId ? { ...seller, received_qty: newQuantity } : seller
    );
    setSellerArray(updatedSellerArray);

    console.log(updatedSellerArray, "warehouse");
  };

  function WarehousePriceTable({ sellerArray, handleQuantityChange }) {
    return (
      <TableContainer component={Paper} sx={{ width: "90%" }}>
        <Table>
          <TableBody>
            {sellerArray.map((seller) => (
              <TableRow key={seller._id}>
                <TableCell>{getSellerNameByID(availableSellers, seller.seller_id)}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    type="number"
                    value={seller.received_qty}
                    onChange={(event) => handleQuantityChange(event, seller.seller_id)}
                  />
                  <FormHelperText>Enter the Receiving Quantity</FormHelperText>
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

  WarehousePriceTable.propTypes = {
    sellerArray: PropTypes.PropTypes.array.isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
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
                  Create WareHouse Order
                </MDTypography>
              </MDBox>

              <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                  <Box sx={style}>
                    <Box
                      sx={{
                        flexDirection: "row",
                        display: "flex",
                        width: "80%",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControl sx={{ m: 0, width: "47%" }}>
                        <SelectWarehouse
                          availableItems={availableWarehouses}
                          handleChange={handleChangeWarehouse}
                          selectedItem={selectedWarehouse}
                          fieldName={"Warehouse"}
                          helperText={"Select Warehouse"}
                          labelKey={"warehouse_name"}
                        />
                      </FormControl>
                      <FormControl sx={{ m: 0, width: "47%" }}>
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
                          {"First Select Warehouse"}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        flexDirection: "row",
                        width: "70%",
                        display: "flex",
                        marginTop: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControl sx={{ width: "47%" }}>
                        <SelectSeller
                          availableItems={availableSellers}
                          handleChange={handleSeller}
                          selectedItem={selectedSeller}
                          fieldName={"Seller"}
                          helperText={"Select Sellers"}
                          labelKey={"Sellers"}
                          inventoryCheck={inventoryCheck}
                        />
                      </FormControl>
                    </Box>

                    <Box
                      sx={{
                        flexDirection: "row",
                        width: "90%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControl sx={{ width: "80%" }}>
                        {selectedSeller.length !== 0 ? (
                          <WarehousePriceTable
                            sellerArray={sellerArray}
                            handleQuantityChange={handleQuantityChange}
                          />
                        ) : (
                          ""
                        )}
                      </FormControl>
                    </Box>

                    <FormControl>
                      <Button
                        onClick={handleUpdate}
                        variant="contained"
                        color="primary"
                        style={{ color: "white", width: "40%", marginTop: 20, alignSelf: "center" }}
                      >
                        Done
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
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

SelectSeller.propTypes = {
  availableItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      seller_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedItem: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      seller_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  fieldName: PropTypes.string,
  helperText: PropTypes.string,
  labelKey: PropTypes.string,
  error: PropTypes.bool,
  inventoryCheck: PropTypes.bool,
};

SelectWarehouse.propTypes = {
  availableItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      [PropTypes.string]: PropTypes.string, // Dynamic key
    })
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fieldName: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  labelKey: PropTypes.string.isRequired,
};
