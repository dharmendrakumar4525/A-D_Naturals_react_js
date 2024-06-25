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
import Loader from "../../../assets/images/Loader.gif";
import { useNavigate } from "react-router-dom";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import { axiosInstance } from "environments/environment";

function WarehouseOrder() {
  const [vendors, setVendors] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [user, setUser] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const openFilterModal = () => {
    setIsWareHouseModalOpen(true);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (purchaseOrderID) => {
    try {
      await axiosInstance.delete(`${GET_PURCHASEORDER_API}/${purchaseOrderID}`);
      setRowData((prevData) => prevData.filter((purchase) => purchase._id !== purchaseOrderID));
    } catch (error) {
      console.error("Error deleting PurchaseOrder:", error);
    }
  };

  //----------------------------Filter Function ---------------------------------

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const PurchaseOrderResponse = await axiosInstance.get(`${GET_PURCHASEORDER_API}`);
        let PurchaseOrdersList = PurchaseOrderResponse.data.data;
        setOriginalData(PurchaseOrdersList);
        console.log(PurchaseOrdersList, "Here");

        const vendorResponse = await axiosInstance.get(`/vendor`);
        const vendorData = vendorResponse.data.data;
        setVendors(vendorData);
        const roleResponse = await axiosInstance.get(`/roles`);
        const roleData = roleResponse.data;
        const warehouseResponse = await axiosInstance.get(`/warehouse`);
        const warehouseData = warehouseResponse.data.data;
        //setWarehouseArray(warehouseData);
        console.log(warehouseData);

        const userData = getLocalStorageData("A&D_User");
        console.log(userData);

        const role = roleData.filter((role) => role._id === userData.role);
        console.log(role[0].role, "role");

        setUser(role[0].role);
        var filteredObjects = PurchaseOrdersList;
        if (role[0].role === "Warehouse Manager") {
          const matchingWarehouses = warehouseData.filter(
            (warehouse) => warehouse.manager === userData._id
          );

          console.log(matchingWarehouses);

          filteredObjects = filteredObjects.filter((object) =>
            object.warehouses.some(
              (warehouse) =>
                warehouse.warehouse === matchingWarehouses[0]._id && warehouse.status == "pending"
            )
          );
        }

        setRowData(filteredObjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
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
    console.log(originalData);
    console.log(warehouseId, "here warehouse");
    const filteredObjects = originalData.filter((object) =>
      object.warehouses.some(
        (warehouse) => warehouse.warehouse === warehouseId && warehouse.status == "pending"
      )
    );
    console.log(filteredObjects);
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
        <Grid container spacing={6} sx={{ minHeight: "75vh" }}>
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
                  {user !== "Warehouse Manager" ? (
                    <Button onClick={openFilterModal} variant="contained" color="white">
                      Select WareHouse
                    </Button>
                  ) : (
                    ""
                  )}
                  <WareHouseModal
                    open={isWareHouseModalOpen}
                    onClose={() => setIsWareHouseModalOpen(false)}
                    filterObjectsByWarehouseId={filterObjectsByWarehouseId}
                  />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <MDBox mx="auto" my="auto" style={{ textAlign: "center", paddingBottom: 50 }}>
                    <img src={Loader} alt="loading..." />
                    <MDTypography sx={{ fontSize: 12 }}>Please Wait....</MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: data.columns, rows: data.rows }}
                    isSorted={false}
                    entriesPerPage={{ defaultValue: 10, entries: [10, 15, 20, 25] }}
                    showTotalEntries={true}
                    noEndBorder
                    pagination={{ variant: "contained", color: "info" }}
                  />
                )}
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
