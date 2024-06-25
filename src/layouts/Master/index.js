import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  GET_SELLER_API,
  GET_VENDOR_API,
  GET_LOCATION_API,
  GET_EXPENSE_API,
  GET_WAREHOUSE_API,
} from "environments/apiPaths";
import { environment } from "environments/environment";
import { axiosInstance } from "environments/environment";
import LoadingOverlay from "validatorsFunctions/LoadingOverlay";

function MasterTables() {
  const [locationCount, setLocationCount] = useState([]);
  const [sellerCount, setSellerCount] = useState([]);
  const [vendorCount, setVendorCount] = useState([]);
  const [expenseCount, setExpenseCount] = useState([]);
  const [warehouseCount, setWarehouseCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const locationResponse = await axiosInstance.get(`${GET_LOCATION_API}`);
        const sellerResponse = await axiosInstance.get(`${GET_SELLER_API}`);
        const vendorResponse = await axiosInstance.get(`${GET_VENDOR_API}`);
        const warehouseResponse = await axiosInstance.get(`${GET_WAREHOUSE_API}`);
        const expenseResponse = await axiosInstance.get(`${GET_EXPENSE_API}`);

        const locationData = locationResponse.data.data.length;
        const sellerData = sellerResponse.data.data.length;
        const vendorData = vendorResponse.data.data.length;
        const warehouseData = warehouseResponse.data.data.length;
        const expenseData = expenseResponse.data.data.length;

        setLocationCount(locationData);
        setSellerCount(sellerData);
        setVendorCount(vendorData);
        setWarehouseCount(warehouseData);
        setExpenseCount(expenseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <DashboardLayout>
      {loading && <LoadingOverlay />}
      {!loading && (
        <>
          <DashboardNavbar />
          <MDBox py={3} sx={{ minHeight: "75vh" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/master/location">
                    <ComplexStatisticsCard
                      color="success"
                      icon="store"
                      title="Locations"
                      count={locationCount}
                      percentage={{
                        color: "success",
                        label: "Locations Table",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/master/warehouse">
                    <ComplexStatisticsCard
                      color="dark"
                      icon="weekend"
                      title="Warehouses"
                      count={warehouseCount}
                      percentage={{
                        color: "success",
                        label: "Warehouses",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/master/vendors">
                    <ComplexStatisticsCard
                      icon="leaderboard"
                      title="Vendors"
                      count={vendorCount}
                      percentage={{
                        color: "success",
                        // amount: "+3%",
                        label: "Vendor Table",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/master/sellers">
                    <ComplexStatisticsCard
                      color="primary"
                      icon="person_add"
                      title="Sellers"
                      count={sellerCount}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Sellers Table",
                      }}
                      z
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/master/expenses">
                    <ComplexStatisticsCard
                      color="primary"
                      icon="person_add"
                      title="Expenses"
                      count={expenseCount}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Expenses Table",
                      }}
                      z
                    />
                  </Link>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          <Footer />
        </>
      )}
    </DashboardLayout>
  );
}

export default MasterTables;
