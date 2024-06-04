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
import { GET_WAREHOUSE_API, GET_SELLERORDER_API } from "environments/apiPaths";
import { getSellerNameByID, getWarehouseNameByID, formatDate } from "../utils";
import WareHouseModal from "./WareHouseModal";
import PendingSalesDataModal from "./PendingSalesDataModal";
import Loader from "../../../assets/images/Loader.gif";
import { useNavigate } from "react-router-dom";

function PendingSellerOrder() {
  const [warehouse, setWarehouse] = useState("");
  const [warehouseArray, setWarehouseArray] = useState([]);
  const [seller, setSeller] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const openFilterModal = () => {
    setIsWareHouseModalOpen(true);
  };

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const SellerOrderResponse = await axios.get(
          `${environment.api_path}${GET_SELLERORDER_API}`
        );
        let SellerOrderResponseList = SellerOrderResponse.data.data;

        const warehouseResponse = await axios.get(`${environment.api_path}${GET_WAREHOUSE_API}`);
        let warehouseList = warehouseResponse.data.data;
        console.log(warehouseList);
        setWarehouseArray(warehouseList);

        //Filter PurchaseOrdersList based on the status of warehouse objects
        const SellerOrderList = SellerOrderResponseList.filter((item) => item.status === "pending");

        console.log(SellerOrderList);
        setRowData(SellerOrderList);
        setOriginalData(SellerOrderList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isRefetch]);

  //------------------------------handle Create Form navigation----

  const handleCreateForm = (orders, warehouse, index) => {
    navigate("/inventory/pending-seller-order/create-seller-order");
  };

  //-----------------------Filter WareHouse---------------

  function filterObjectsByWarehouseId(warehouseId) {
    setWarehouse(warehouseId);
    console.log(warehouseId, "here warehouse");

    const filteredObjects = originalData.filter(
      (object) => object.seller_id.warehouse === warehouseId
    );

    setRowData(filteredObjects);
  }

  //----------------------------Row Data---------------------------------
  const data = {
    columns: [
      { Header: "WareHouse", accessor: "warehouse", align: "center" },
      { Header: "Seller", accessor: "seller", align: "center" },
      { Header: "Received Quantity", accessor: "order_quantity", align: "center" },
      { Header: "Order Date", accessor: "order_date", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((orders, index) => ({
      warehouse: <Author name={getWarehouseNameByID(warehouseArray, orders.seller_id.warehouse)} />,
      seller: <Author name={orders.seller_id.seller_name} />,
      order_quantity: <Author name={orders.received_qty} />,
      order_date: <Author name={formatDate(orders.created_at)} />,

      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography component="a" href="#" variant="caption" color="blue" fontWeight="medium">
              <PendingSalesDataModal sellerData={orders} />
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
                  Pending Seller Order Table
                  <Button onClick={openFilterModal} variant="contained" color="white">
                    Select WareHouse
                  </Button>
                  <WareHouseModal
                    open={isWareHouseModalOpen}
                    onClose={() => setIsWareHouseModalOpen(false)}
                    filterObjectsByWarehouseId={filterObjectsByWarehouseId}
                  />
                </MDTypography>
              </MDBox>
              <Button
                onClick={handleCreateForm}
                variant="contained"
                color="white"
                sx={{ width: "90%", alignSelf: "center", margin: 5 }}
              >
                Create New Seller Order
              </Button>
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

export default PendingSellerOrder;

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
