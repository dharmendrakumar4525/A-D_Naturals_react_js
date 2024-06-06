// Your Dashboard component
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { PurchaseChartData, WareHouseChartData, SellerChartData } from "./data/reportsBarChartData";
import {
  fetchTotalPurchase,
  fetchTotalWareHouseInventory,
  fetchTotalExpense,
} from "./dataFunctions";
import { useState, useEffect } from "react";

function Dashboard() {
  const [purchaseOrder, setPurchaseOrder] = useState(0);
  const [warehouseOrder, setWarehouseOrder] = useState(0);
  const [sellerOrder, setSellerOrder] = useState(0);
  const [purchaseChart, setPurchaseChart] = useState({});
  const [warehouseChart, setWareHouseChart] = useState({});
  const [sellerChart, setSellerChart] = useState({});
  const [revenue, setRevenue] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const purchase = await fetchTotalPurchase();
      const warehouse = await fetchTotalWareHouseInventory();
      const expense = await fetchTotalExpense();
      console.log(expense, "purchase");
      setPurchaseOrder(purchase.totalOrderQuantity);
      setWarehouseOrder(warehouse.totalInventory);
      setSellerOrder(warehouse.TotalConsumed);
      let totalRevenue = warehouse.TotalConsumed * 50;
      let Profit =
        ((warehouse.TotalConsumed * 100 - purchase.totalPrice - expense.totalExpense) * 100) /
        purchase.totalPrice;
      setRevenue(totalRevenue);
      setProfit(parseFloat(Profit.toFixed(2)));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      let purchaseChart = await PurchaseChartData();
      setPurchaseChart(purchaseChart);

      let warehouseChart = await WareHouseChartData();
      setWareHouseChart(warehouseChart);

      let sellerChart = await SellerChartData();
      setSellerChart(sellerChart);
    };

    fetchChartData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Purchase"
                count={purchaseOrder}
                percentage={{
                  label: "Updated Today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Store Inventory"
                count={warehouseOrder}
                percentage={{
                  label: "Updated Today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Total Sales"
                count={sellerOrder}
                percentage={{
                  label: "Updated Today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Revenue"
                count={revenue}
                percentage={{
                  color: "success",
                  amount: `${profit}%`,
                  label: "Profit",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Vendor Purchase"
                  description="Daily Purchases of Week"
                  date="Updated Today"
                  chart={purchaseChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Warehouse Inventory"
                  description="Daily Warehouse Inventory"
                  date="Updated Today"
                  chart={warehouseChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Total Sales"
                  description="Daily Sales per Week"
                  date="Updated Today"
                  chart={sellerChart}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
