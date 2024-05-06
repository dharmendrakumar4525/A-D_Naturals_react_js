import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { GET_USERS_API, GET_ROLES_API, GET_SELLER_API } from "environments/apiPaths";
import { environment } from "environments/environment";

function MasterTables() {
  const [userCount, setUserLength] = useState([]);
  const [sellerCount, setSellerCount] = useState([]);
  const [vendorCount, setVendorCount] = useState([]);
  const [warehouseCount, setWarehouseCount] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const usersResponse = await axios.get(`${environment.api_path}/${GET_USERS_API}`);
        const sellerResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const vendorResponse = await axios.get(`${environment.api_path}/vendor`);
        const warehouseResponse = await axios.get(`${environment.api_path}/warehouse`);

        const usersData = usersResponse.data.length;
        const sellerData = sellerResponse.data.data.length;
        const vendorData = vendorResponse.data.data.length;
        const warehouseData = warehouseResponse.data.data.length;

        setUserLength(usersData);
        setSellerCount(sellerData);
        setVendorCount(vendorData);
        setWarehouseCount(warehouseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/master/location">
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Locations"
                  count={warehouseCount}
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
            <MDBox mb={31.5}>
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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MasterTables;
