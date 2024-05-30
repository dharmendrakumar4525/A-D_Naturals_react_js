// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Button } from "@mui/material";
import {
  format,
  isWithinInterval,
  startOfQuarter,
  endOfQuarter,
  startOfMonth,
  endOfMonth,
  parseISO,
  addMonths,
  addYears,
} from "date-fns";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "environments/environment";
import { GET_PURCHASEORDER_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import { getVendorNameByID, formatDate } from "../utils";
import WareHouseModal from "./WareHouseModal";
import { useNavigate } from "react-router-dom";

function WarehouseOrder() {
  const [vendors, setVendors] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const openFilterModal = () => {
    setIsWareHouseModalOpen(true);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (purchaseOrderID) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_PURCHASEORDER_API}/${purchaseOrderID}`);
      setRowData((prevData) => prevData.filter((purchase) => purchase._id !== purchaseOrderID));
    } catch (error) {
      console.error("Error deleting PurchaseOrder:", error);
    }
  };

  //----------------------------Filter Function ---------------------------------

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const PurchaseOrderResponse = await axios.get(
          `${environment.api_path}${GET_PURCHASEORDER_API}`
        );
        let PurchaseOrdersList = PurchaseOrderResponse.data.data;

        console.log(PurchaseOrdersList, "Here");

        const vendorResponse = await axios.get(`${environment.api_path}/vendor`);
        const vendorData = vendorResponse.data.data;
        setVendors(vendorData);

        // Filter PurchaseOrdersList based on the status of warehouse objects
        PurchaseOrdersList = PurchaseOrdersList.filter((order) => {
          return order.warehouses.some((warehouse) => warehouse.status === "pending");
        });

        setRowData(PurchaseOrdersList);
        setOriginalData(PurchaseOrdersList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  //------------------------------handle Create Form navigation----

  const handleCreateForm = (orders, warehouse, index) => {
    let quantity = null; // Initialize the variable to store the quantity

    const warehouses = orders.warehouses;
    for (let i = 0; i < warehouses.length; i++) {
      if (warehouses[i].warehouse === warehouse) {
        quantity = warehouses[i].qty;
        break; // Exit the loop once the match is found
      }
    }
    if (warehouse === "") {
      setSubmitError("First Select the WareHouse");
      setOpenSnackbar(true);
    } else {
      navigate("/inventory/warehouse-order/create-warehouse-order", {
        state: { purchaseOrder: orders, warehouseId: warehouse, quantity: quantity },
      });
      console.log(index);
    }
  };

  //-----------------------Filter WareHouse---------------

  function filterObjectsByWarehouseId(warehouseId) {
    setWarehouse(warehouseId);
    console.log(warehouseId, "jere warehouse");
    const filteredObjects = originalData.filter((object) =>
      object.warehouses.some(
        (warehouse) => warehouse.warehouse === warehouseId && warehouse.status == "pending"
      )
    );

    setRowData(filteredObjects);
  }

  //----------------------------Row Data---------------------------------
  const data = {
    columns: [
      { Header: "PO No.", accessor: "PONo", align: "center", width: "15%" },
      { Header: "Vendor", accessor: "vendor", align: "center" },
      { Header: "Order Quantity", accessor: "quantity", align: "center" },
      { Header: "Purchase Date", accessor: "date", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((orders, index) => ({
      PONo: <Author name={orders.po_no} />,
      vendor: <Author name={getVendorNameByID(vendors, orders.vendor)} />,
      quantity: <Author name={orders.order_qty} />,
      date: <Author name={formatDate(orders.created_at)} />,

      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography component="a" href="#" variant="caption" color="blue" fontWeight="medium">
              <Button onClick={() => handleCreateForm(orders, warehouse, index)}>
                Receive Order
              </Button>
            </MDTypography>
          </div>
        </>
      ),
    })),
  };
  //----------------------------Main Component---------------------------------

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
                  Pending Warehouse Order Table
                  <Button onClick={openFilterModal} variant="contained" color="white">
                    Filters
                  </Button>
                  <WareHouseModal
                    open={isWareHouseModalOpen}
                    onClose={() => setIsWareHouseModalOpen(false)}
                    filterObjectsByWarehouseId={filterObjectsByWarehouseId}
                  />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: data.columns, rows: data.rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>

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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default WarehouseOrder;

const Author = ({ name }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" sx={{ fontWeight: "regular", fontSize: 12 }}>
        {name}
      </MDTypography>
    </MDBox>
  </MDBox>
);

Author.propTypes = {
  name: PropTypes.string.isRequired,
};
