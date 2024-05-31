import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";

function InventoryTable() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/inventory/purchase-order">
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
              <Link to="/inventory/warehouse-order">
                <ComplexStatisticsCard
                  icon="store"
                  title="Warehouse Order"
                  percentage={{
                    color: "success",
                    // amount: "+3%",
                    label: "Add Warehouse Order",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={31.5}>
              <Link to="/inventory/pending-seller-order">
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Seller Order"
                  percentage={{
                    color: "success",
                    // amount: "+3%",
                    label: "Add Seller Order",
                  }}
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

export default InventoryTable;
