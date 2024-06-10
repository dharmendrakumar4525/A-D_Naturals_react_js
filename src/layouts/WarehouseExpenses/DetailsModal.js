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
import { getWarehouseNameByID, getMonthName, getExpenseNameByID } from "../Orders/utils";
import { useNavigate } from "react-router-dom";
import { BorderBottom } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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
  purchaseOrderData,
  expenses = null,
  warehouses,
  handleDelete,
  permission,
  setIsRefetch = () => {},
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [ieditable, setIeditable] = useState(true);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  console.log(purchaseOrderData);

  const deletePO = () => {
    handleDelete(purchaseOrderData._id);
    handleClose();
  };

  const handleEdit = () => {
    if (permission[2]?.isSelected === false) {
      handleError("You don't have permission to Edit");
      return;
    }
    navigate("/Warehouse-Expenses/edit-wareHouse-expense", {
      state: { wareHouseExpense: purchaseOrderData },
    });
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

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
              <Grid container spacing={1} sx={{ borderBottom: "1px solid black" }}>
                <MDTypography variant="h6" gutterBottom>
                  Expense Details
                </MDTypography>
              </Grid>
              <Grid container spacing={1} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>WareHouse:</strong>{" "}
                    {getWarehouseNameByID(warehouses, purchaseOrderData.warehouse)}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Month:</strong>{" "}
                    {`${getMonthName(purchaseOrderData.date)}, ${new Date(
                      purchaseOrderData.date
                    ).getFullYear()}`}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Expenses Details:</strong>
                  </MDTypography>
                  <TableContainer component={Paper} sx={{ width: "60%" }}>
                    <Table size="small" aria-label="warehouse table">
                      <TableBody>
                        {purchaseOrderData?.expense?.map((expense, index) => (
                          <TableRow key={index}>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ fontSize: 12, fontWeight: "medium" }}
                            >
                              {getExpenseNameByID(expenses, expense.category)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: 12, fontWeight: "regular" }}>
                              {expense.amount} INR
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ flexDirection: "row", justifyContent: "space-between", gap: 2 }}
                >
                  <Button
                    onClick={deletePO}
                    variant="contained"
                    color="primary"
                    style={{ color: "white", width: "45%", marginTop: 20, alignSelf: "center" }}
                  >
                    Delete Expenses
                  </Button>

                  <Button
                    onClick={handleEdit}
                    variant="contained"
                    color="primary"
                    style={{
                      color: "white",
                      width: "45%",
                      marginLeft: 20,
                      marginTop: 20,
                      alignSelf: "center",
                    }}
                    disabled={!ieditable}
                  >
                    Update Expenses
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
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
