/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import MDTypography from "components/MDTypography";
import { getVendorNameByID, getWarehouseNameByID } from "../utils";

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

export default function DetailsModal({
  purchaseOrderData = null,
  vendors = null,
  warehouses,
  setIsRefetch = () => {},
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(warehouses);
  return (
    <div>
      <Button variant="text" style={{ color: "#3791ed" }} onClick={handleOpen}>
        View
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {purchaseOrderData && (
            <div>
              <MDTypography variant="h6" gutterBottom>
                Purchase Order Details
              </MDTypography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>PO Number:</strong> {purchaseOrderData.po_no}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Vendor:</strong> {getVendorNameByID(vendors, purchaseOrderData.vendor)}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Order Quantity:</strong> {purchaseOrderData.order_qty}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Price:</strong> {purchaseOrderData.price}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Resale Quantity:</strong> {purchaseOrderData?.resale?.qty}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Resale Price:</strong> {purchaseOrderData.resale?.price}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Created At:</strong>{" "}
                    {new Date(purchaseOrderData.created_at).toLocaleString()}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Warehouses Details:</strong>
                  </MDTypography>
                  <TableContainer component={Paper} sx={{ width: "60%" }}>
                    <Table size="small" aria-label="warehouse table">
                      <TableBody>
                        {purchaseOrderData?.warehouses?.map((warehouse, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row" sx={{ fontSize: 12 }}>
                              {getWarehouseNameByID(warehouses, warehouse.warehouse)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: 12 }}>
                              {warehouse.qty}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
