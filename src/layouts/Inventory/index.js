import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { environment } from "environments/environment";
import { GET_PERMISSION } from "environments/apiPaths";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { axiosInstance } from "environments/environment";
import LoadingOverlay from "validatorsFunctions/LoadingOverlay";

function InventoryTable() {
  const [createPurchase, setCreatePurchase] = useState({});
  const [createWarehouse, setCreateWarehouse] = useState({});
  const [createSeller, setCreateSeller] = useState({});
  const [isRefetch, setIsRefetch] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);

  //-------------------------------- GET PERMISSION Array ------------------------
  useEffect(() => {
    const fetchPermissionData = async () => {
      const data = getLocalStorageData("A&D_User");
      console.log(data, "permission");
      try {
        const permissionResponse = await axiosInstance.get(`${GET_PERMISSION}${data._id}`);
        const permissionData = permissionResponse.data.data.permissions[0].ParentChildchecklist;
        console.log(permissionData);
        // Check if the permission data contains an object with module name "users"
        let modulePermission = permissionData.find((item) => item.moduleName === "PurchaseOrder");
        setCreatePurchase(modulePermission ? modulePermission.childList : {});
        modulePermission = permissionData.find((item) => item.moduleName === "WarehouseOrder");
        setCreateWarehouse(modulePermission ? modulePermission.childList : {});
        modulePermission = permissionData.find((item) => item.moduleName === "SellerOrder");
        setCreateSeller(modulePermission ? modulePermission.childList : {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchPermissionData();
  }, [isRefetch]);

  const handleError = (order, permission) => {
    if (permission[0].isSelected === false) {
      setSubmitError(`You don't have permission to Create ${order}`);
      setOpenSnackbar(true);
    } else {
      return true;
    }
  };

  return (
    <DashboardLayout>
      {loading && <LoadingOverlay />}
      {!loading && (
        <>
          <DashboardNavbar />
          <MDBox py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link
                    to="/inventory/purchase-order"
                    onClick={(e) => {
                      if (!handleError("Purchase Order", createPurchase)) e.preventDefault();
                    }}
                  >
                    <ComplexStatisticsCard
                      color="dark"
                      icon="weekend"
                      title="Purchase Order"
                      percentage={{
                        color: "success",
                        label: "Add Purchase Order ",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link
                    to="/inventory/warehouse-order"
                    onClick={(e) => {
                      if (!handleError("Warehouse Order", createWarehouse)) e.preventDefault();
                    }}
                  >
                    <ComplexStatisticsCard
                      icon="store"
                      title="Warehouse Order"
                      percentage={{
                        color: "success",
                        label: "Add Warehouse Order",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link
                    to="/inventory/pending-seller-order"
                    onClick={(e) => {
                      if (!handleError("Seller Order", createSeller)) e.preventDefault();
                    }}
                  >
                    <ComplexStatisticsCard
                      icon="leaderboard"
                      title="Seller Order"
                      percentage={{
                        color: "success",
                        label: "Add Seller Order",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
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
          <Footer />
        </>
      )}
    </DashboardLayout>
  );
}

export default InventoryTable;
