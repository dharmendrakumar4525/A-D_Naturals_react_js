/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils";
import PendingSalesDataModal from "./PendingSalesDataModal";

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
  handleDelete,
  setIsRefetch = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [pendingSalesModal, setPendingSalesModal] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePendingClose = () => setPendingSalesModal(false);
  const handleEdit = () => {
    setOpen(false);
    setPendingSalesModal(true);
  };

  const deletePO = () => {
    handleDelete(purchaseOrderData._id);
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
            <>
              <Grid container spacing={1} sx={{ borderBottom: "1px solid black" }}>
                <MDTypography variant="h6" gutterBottom>
                  Seller Order Details
                </MDTypography>
              </Grid>
              <Grid container spacing={1} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Seller Name:</strong> {purchaseOrderData.seller_id.seller_name}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Received Quantity:</strong> {purchaseOrderData.received_qty} unit
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Sold Quantity:</strong> {purchaseOrderData.consumed_qty} unit
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Rejected Quantity:</strong> {purchaseOrderData.rejected_qty} unit
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography sx={{ fontSize: 13 }}>
                    <strong>Received Date:</strong> {formatDate(purchaseOrderData.created_at)}
                  </MDTypography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "space-between", gap: 2, marginTop: 2 }}
                >
                  <Button
                    onClick={deletePO}
                    variant="contained"
                    color="primary"
                    style={{ color: "white", width: "45%" }}
                  >
                    Delete Order
                  </Button>
                  <Button
                    onClick={handleEdit}
                    variant="contained"
                    color="primary"
                    style={{ color: "white", width: "45%" }}
                  >
                    Edit Order
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Modal>

      <PendingSalesDataModal
        sellerData={purchaseOrderData}
        handlePendingClose={handlePendingClose}
        pendingSalesModal={pendingSalesModal}
      />
    </div>
  );
}
