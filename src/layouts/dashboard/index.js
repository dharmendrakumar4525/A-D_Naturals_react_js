import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import HorizontalBarChart from "examples/Charts/BarCharts/HorizontalBarChart";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import PieChart from "examples/Charts/PieChart";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from "axios";
import { GET_WAREHOUSE_API } from "environments/apiPaths";
import { environment, defaultOptions, axiosInstance } from "environments/environment";
import { PurchaseChartData, WareHouseChartData, SellerChartData } from "./data/reportsBarChartData";
import {
  WareHouseChartDataBYID,
  SellerChartDataBYID,
  WeeklySalesRevenueNyWareHouse,
} from "./data/reportsBarChartData";
import {
  fetchTotalPurchase,
  fetchTotalWareHouseInventory,
  fetchTotalExpense,
  fetchTotalExpenseByWareHouseId,
  fetchTotalWareHouseInventoryByWarehouseId,
} from "./dataFunctions";
import {
  fetchFilterTotalExpense,
  fetchFilterTotalExpenseByWareHouseId,
  fetchFilterTotalPurchase,
  fetchFilterTotalWareHouseInventory,
  fetchFilterTotalWareHouseInventoryByWarehouseId,
} from "./filterFunctions";
import { useState, useEffect } from "react";
import WareHouseModal from "./WareHouseModal";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import { getWarehouseNameByID } from "layouts/Orders/utils";
import FilterModal from "./FilterModal";
import LoadingOverlay from "validatorsFunctions/LoadingOverlay"; // Import the LoadingOverlay component

function Dashboard() {
  const [purchaseOrder, setPurchaseOrder] = useState(0);
  const [warehouseOrder, setWarehouseOrder] = useState(0);
  const [sellerOrder, setSellerOrder] = useState(0);
  const [availableWarehouses, setAvailableWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [purchaseChart, setPurchaseChart] = useState({});
  const [warehouseChart, setWareHouseChart] = useState({});
  const [sellerChart, setSellerChart] = useState({});
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [user, setUser] = useState("");
  const { sales, tasks } = reportsLineChartData;
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchase = await fetchTotalPurchase();
        const warehouse = await fetchTotalWareHouseInventory();
        const expense = await fetchTotalExpense();

        setPurchaseOrder(purchase.totalOrderQuantity);
        setWarehouseOrder(warehouse.totalInventory);
        setSellerOrder(warehouse.TotalConsumed);

        let totalRevenue = warehouse.TotalConsumed * 50;
        let Profit =
          ((warehouse.TotalConsumed * 100 - purchase.totalPrice - expense.totalExpense) * 100) /
          purchase.totalPrice;

        setRevenue(totalRevenue);

        if (Profit > 0) {
          setProfit(`${parseFloat(Profit.toFixed(2))} % Profit`);
        } else {
          setProfit(`${parseFloat(-Profit.toFixed(2))} % Loss`);
        }

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //-----------------------------------------------------------------------

  useEffect(() => {
    const fetchUserAndWareHouse = async () => {
      try {
        const WareHouseResponse = await axiosInstance.get(GET_WAREHOUSE_API);
        console.log(WareHouseResponse, "response");
        const WareHouseList = WareHouseResponse.data.data;
        setAvailableWarehouses(WareHouseList);

        const roleResponse = await axiosInstance.get("/roles");
        const roleData = roleResponse.data;

        const userData = getLocalStorageData("A&D_User");
        console.log(userData, ".....");
        const role = roleData.find((role) => role._id === userData.role);
        console.log(role, "....!");
        if (role.role === "Warehouse Manager") {
          const matchingWarehouses = WareHouseList.filter(
            (warehouse) => warehouse.manager === userData._id
          );

          FilterUsingWarehouse(matchingWarehouses[0]._id);
        }

        setUser(role?.role || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndWareHouse();
  }, []);

  //------------------------------------------------------------------------

  const FilterUsingWarehouse = async (wareHouseId) => {
    console.log(wareHouseId);
    setSelectedWarehouse(wareHouseId);
    const warehouseData = await WareHouseChartDataBYID(wareHouseId);
    setWareHouseChart(warehouseData);
    console.log(warehouseData, "data");
    const sellerData = await SellerChartDataBYID(wareHouseId);
    setSellerChart(sellerData);
    const weeklyRevenue = await WeeklySalesRevenueNyWareHouse(wareHouseId);
    setWeeklyRevenue(weeklyRevenue);
    console.log(sellerData, "data");
    const warehouse = await fetchTotalWareHouseInventoryByWarehouseId(wareHouseId);
    const expense = await fetchTotalExpenseByWareHouseId(wareHouseId);

    setWarehouseOrder(warehouse.totalInventory);
    setSellerOrder(warehouse.TotalConsumed);

    let totalRevenue = warehouse.TotalConsumed * 50;
    /*let Profit =
      ((warehouse.TotalConsumed * 100 - purchase.totalPrice - expense.totalExpense) * 100) /
      purchase.totalPrice; */

    setRevenue(totalRevenue);
    setProfit("Updated Today");
  };

  //------------------------Time Filter---------------

  const FilterByTime = async ({ filterType, year, month, quarter, halfYear }) => {
    console.log(selectedWarehouse);
    if (selectedWarehouse) {
      const warehouse = await fetchFilterTotalWareHouseInventoryByWarehouseId(
        selectedWarehouse,
        filterType,
        year,
        month,
        quarter,
        halfYear
      );
      const expense = await fetchFilterTotalExpenseByWareHouseId(
        selectedWarehouse,
        filterType,
        year,
        month,
        quarter,
        halfYear
      );
      setWarehouseOrder(warehouse.totalInventory);
      setSellerOrder(warehouse.TotalConsumed);

      let totalRevenue = warehouse.TotalConsumed * 50;
      /*let Profit =
      ((warehouse.TotalConsumed * 100 - purchase.totalPrice - expense.totalExpense) * 100) /
      purchase.totalPrice; */

      setRevenue(totalRevenue);
      setProfit("Updated Today");
    } else {
      const purchase = await fetchFilterTotalPurchase(filterType, year, month, quarter, halfYear);
      const warehouse = await fetchFilterTotalWareHouseInventory(
        filterType,
        year,
        month,
        quarter,
        halfYear
      );
      const expense = await fetchFilterTotalExpense(filterType, year, month, quarter, halfYear);
      // Process and display the data as needed

      setPurchaseOrder(purchase.totalOrderQuantity);
      setWarehouseOrder(warehouse.totalInventory);
      setSellerOrder(warehouse.TotalConsumed);
      console.log(purchase, "purchase");
      let totalRevenue = warehouse.TotalConsumed * 50;
      let Profit =
        ((warehouse.TotalConsumed * 100 - purchase.totalPrice - expense.totalExpense) * 100) /
        purchase.totalPrice;

      setRevenue(totalRevenue);

      if (Profit > 0) {
        setProfit(`${parseFloat(Profit.toFixed(2))} % Profit`);
      } else {
        setProfit(`${parseFloat(-Profit.toFixed(2))} % Loss`);
      }
    }
  };

  //----------------------------------------------------------------

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const purchaseData = await PurchaseChartData();
        setPurchaseChart(purchaseData);
        console.log(purchaseData, "data");
        const warehouseData = await WareHouseChartData();
        setWareHouseChart(warehouseData);
        console.log(warehouseData, "data");
        const sellerData = await SellerChartData(purchaseData.costData);
        setSellerChart(sellerData);
        console.log(sellerData, "data");

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <DashboardLayout>
      {loading && <LoadingOverlay />} {/* Conditionally render the LoadingOverlay */}
      {!loading && (
        <>
          <DashboardNavbar />
          <MDBox>
            <MDTypography
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "95%",
                marginTop: 5,
              }}
            >
              <MDTypography sx={{ fontSize: 15, marginBottom: 3 }}>
                {user !== "Warehouse Manager" && (
                  <Button
                    onClick={() => {
                      setIsWareHouseModalOpen(true);
                    }}
                    variant="contained"
                    sx={{ marginLeft: 2, marginRight: 2 }}
                    color="dark"
                  >
                    Select WareHouse
                  </Button>
                )}
                {selectedWarehouse === ""
                  ? "Select the WareHouse*"
                  : `Warehouse : ${getWarehouseNameByID(availableWarehouses, selectedWarehouse)}`}
              </MDTypography>
              <MDTypography
                sx={{
                  fontSize: 12,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 3,
                  color: "#7b809a",
                }}
              >
                <Button
                  onClick={() => setIsFilterModalOpen(true)}
                  variant="contained"
                  sx={{ marginLeft: 2, marginRight: 2 }}
                  color="dark"
                >
                  Select Filters
                </Button>
                Filter by Month/Year
              </MDTypography>
            </MDTypography>
          </MDBox>
          <FilterModal
            open={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onFilter={FilterByTime}
          />
          <WareHouseModal
            open={isWareHouseModalOpen}
            onClose={() => setIsWareHouseModalOpen(false)}
            filterObjectsByWarehouseId={FilterUsingWarehouse}
          />

          <MDBox py={3}>
            <Grid container spacing={3}>
              {user !== "Warehouse Manager" && selectedWarehouse === "" ? (
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
              ) : (
                ""
              )}
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
                      amount: `${profit}`,
                      label: "",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
            {user !== "Warehouse Manager" && selectedWarehouse === "" ? (
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
                      <ReportsLineChart
                        color="success"
                        title="Daily sales"
                        description="Daily sales of Current Week"
                        date="updated Today"
                        chart={sellerChart}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <ReportsBarChart
                        color="secondary"
                        title="WareHouse Inventory"
                        description="Daily Warehouse Inventory per Week"
                        date="Updated Today"
                        chart={warehouseChart}
                      />
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            ) : (
              <MDBox mt={4.5}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <ReportsBarChart
                        color="info"
                        title="Warehouse Inventory"
                        description="Daily Inventory of Warehouse"
                        date="Updated Today"
                        chart={warehouseChart}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <ReportsLineChart
                        color="success"
                        title="Daily sales"
                        description="Daily sales of WareHouse"
                        date="updated Today"
                        chart={sellerChart}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <MDBox mb={3}>
                      <ReportsLineChart
                        color="secondary"
                        title="Sales Revenue"
                        description="Daily Sales Revenue"
                        date="Updated Today"
                        chart={weeklyRevenue}
                      />
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            )}
          </MDBox>
          <Footer />
        </>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
