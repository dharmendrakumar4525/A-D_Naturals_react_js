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
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  GET_PURCHASEORDER_API,
  GET_WAREHOUSEORDER_API,
} from "environments/apiPaths";
import { getWarehouseNameByID } from "../utils";
import { axiosInstance } from "environments/environment";

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

export default function EditWareHouseOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { warehouseOrder } = location.state || {};
  const [warehouse, setWarehouse] = useState("");
  const [formData, setFormData] = useState({
    warehouse: warehouseOrder?.warehouse || "",
    po_no: warehouseOrder?.po_no || "",
    received_qty: warehouseOrder?.received_qty,
    rejected_qty: warehouseOrder?.rejected_qty,
    _id: warehouseOrder?._id,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);

  console.log(location.state, "state");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axiosInstance.get(`${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;
        const warehouseName = getWarehouseNameByID(warehouseData, formData.warehouse);
        console.log(warehouseName);
        setWarehouse(warehouseName);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (warehouseOrder) {
      fetchData();
    }
  }, [warehouseOrder, navigate]);

  const handleSubmit = async () => {
    let newFormData = {
      warehouse: formData.warehouse,
      po_no: formData.po_no,
      received_qty: parseInt(formData.received_qty),
      rejected_qty: parseInt(formData.rejected_qty),
    };

    try {
      await axiosInstance.put(`${GET_WAREHOUSEORDER_API}/${formData._id}`, newFormData);
      setSubmitError("WareHouse Order Created Sucessfully");
      setFormData({
        warehouse: "",
        po_no: "",
        received_qty: 0,
        rejected_qty: 0,
      });
      navigate("/view-orders/warehouse-orders");
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

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
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
              <MDBox p={2}>
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
                        <FormControl sx={{ width: "47%" }}>
                          <TextField
                            id="warehouse"
                            label="WareHouse"
                            variant="outlined"
                            value={warehouse}
                            onChange={handleInputChange}
                            InputProps={{
                              readOnly: true,
                            }}
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
                          <FormHelperText style={{ color: "inherit" }}>
                            {"Enter PO Number"}
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
                          <TextField
                            id="received_qty"
                            label="Received Quantity"
                            variant="outlined"
                            value={formData.received_qty}
                            onChange={handleInputChange}
                            type="number"
                          />
                          <FormHelperText style={{ color: "inherit" }}>
                            {"Enter Received Quantity"}
                          </FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: "47%" }}>
                          <TextField
                            id="rejected_qty"
                            label="Rejected Quantity"
                            variant="outlined"
                            value={formData.rejected_qty}
                            onChange={handleInputChange}
                            type="number"
                          />
                          <FormHelperText style={{ color: "inherit" }}>
                            {"Enter Damaged Qunatity"}
                          </FormHelperText>
                        </FormControl>
                      </Box>

                      <FormControl>
                        <Button
                          onClick={handleSubmit}
                          variant="contained"
                          color="primary"
                          style={{
                            color: "white",
                            width: "40%",
                            marginTop: 20,
                            alignSelf: "center",
                          }}
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
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
