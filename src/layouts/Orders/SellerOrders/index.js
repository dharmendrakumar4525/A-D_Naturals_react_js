import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  addMonths,
  addYears,
  parseISO,
} from "date-fns";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { environment } from "environments/environment";
import DetailsModal from "./DetailsModal";
import FilterModal from "./FilterModal";
import WareHouseModal from "./WareHouseModal";
import SellerModal from "./sellerModal";
import { GET_SELLERORDER_API, GET_WAREHOUSEORDER_API, GET_SELLER_API } from "environments/apiPaths";
import { getVendorNameByID, formatDate, getWarehouseNameByID } from "../utils";
import Loader from "../../../assets/images/Loader.gif";

function SellerOrderTable() {
  const [warehouses, setWarehouse] = useState([]);
  const [seller, setSeller] = useState([]);
  const [availableSeller, setAvailableSeller] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [warehouseFilterData, setWarehouseFilterData] = useState([]);
  const [rejected, setRejected] = useState(0);
  const [received, setReceived] = useState(0);
  const [sold, setSold] = useState(0);
  const [loading, setLoading] = useState(true);

  // Track applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    year: null,
    month: null,
    quarter: null,
    halfYear: null,
    warehouseId: null,
    sellerId: null,
  });

  const openWareHouseFilterModal = () => {
    setIsWareHouseModalOpen(true);
  };

  const openSellerFilterModal = () => {
    setIsSellerModalOpen(true);
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (sellerOrderID) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_SELLERORDER_API}/${sellerOrderID}`);
      setRowData((prevData) => prevData.filter((purchase) => purchase._id !== sellerOrderID));
      setIsFilterModalOpen(false);
    } catch (error) {
      console.error("Error deleting WareHouseOrder:", error);
    }
  };

  const resetFilters = () => {
    setAppliedFilters({
      year: null,
      month: null,
      quarter: null,
      halfYear: null,
      warehouseId: null,
      sellerId: null,
    });
    setRowData(originalData);
    calculateTotals(originalData);
  };

  const applyFilters = (filters) => {
    let filteredData = originalData;

    if (filters.year) {
      const startYear = parseInt(filters.year, 10);
      const startDate = new Date(startYear, 3, 1);
      const endDate = new Date(startYear + 1, 2, 31);

      filteredData = filteredData.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return isWithinInterval(orderDate, { start: startDate, end: endDate });
      });
    }

    if (filters.month) {
      filteredData = filteredData.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return isWithinInterval(orderDate, {
          start: startOfMonth(new Date(filters.year, filters.month - 1, 1)),
          end: endOfMonth(new Date(filters.year, filters.month - 1, 1)),
        });
      });
    }

    if (filters.quarter) {
      filteredData = filteredData.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return isWithinInterval(orderDate, {
          start: startOfQuarter(addMonths(new Date(filters.year, 3, 1), (filters.quarter - 1) * 3)),
          end: endOfQuarter(addMonths(new Date(filters.year, 3, 1), (filters.quarter - 1) * 3)),
        });
      });
    }

    if (filters.halfYear) {
      if (filters.halfYear === "1") {
        filteredData = filteredData.filter((order) => {
          const orderDate = parseISO(order.created_at);
          return isWithinInterval(orderDate, {
            start: new Date(filters.year, 3, 1),
            end: new Date(filters.year, 8, 30),
          });
        });
      } else {
        filteredData = filteredData.filter((order) => {
          const orderDate = parseISO(order.created_at);
          return isWithinInterval(orderDate, {
            start: new Date(filters.year, 9, 1),
            end: new Date(filters.year + 1, 2, 31),
          });
        });
      }
    }

    if (filters.warehouseId) {
      filteredData = filteredData.filter(
        (order) => order.seller_id.warehouse === filters.warehouseId
      );
    }

    if (filters.sellerId) {
      filteredData = filteredData.filter((order) => order.seller_id?._id === filters.sellerId);
    }

    setRowData(filteredData);
    calculateTotals(filteredData);
  };

  const calculateTotals = (data) => {
    let received = 0;
    let rejected = 0;
    let consumed = 0;

    data.forEach((order) => {
      received += order.received_qty;
      rejected += order.rejected_qty;
      consumed += order.consumed_qty;
    });

    setReceived(received);
    setRejected(rejected);
    setSold(consumed);
  };

  const handleFilter = (filterType, year, month, quarter, halfYear) => {
    const newFilters = { ...appliedFilters };

    switch (filterType) {
      case "monthly":
        newFilters.year = year;
        newFilters.month = month;
        break;
      case "quarterly":
        newFilters.year = year;
        newFilters.quarter = quarter;
        break;
      case "halfyearly":
        newFilters.year = year;
        newFilters.halfYear = halfYear;
        break;
      case "yearly":
        newFilters.year = year;
        break;
      default:
        break;
    }

    setAppliedFilters(newFilters);
    applyFilters(newFilters);
  };

  const filterObjectsByWarehouseId = (warehouseId) => {
    const newFilters = { ...appliedFilters, warehouseId };
    setAppliedFilters(newFilters);
    applyFilters(newFilters);
  };

  const filterObjectsBySellerId = (sellerId) => {
    const newFilters = { ...appliedFilters, sellerId };
    setAppliedFilters(newFilters);
    applyFilters(newFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sellerOrderResponse = await axios.get(
          `${environment.api_path}${GET_SELLERORDER_API}`
        );
        const SellerOrderResponseList = sellerOrderResponse.data.data;
        const sellerOrderList = SellerOrderResponseList.filter(
          (item) => item.status === "completed"
        );

        const warehouseResponse = await axios.get(`${environment.api_path}/warehouse`);
        const warehouseData = warehouseResponse.data.data;
        const sellerResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const sellerData = sellerResponse.data.data;

        setAvailableSeller(sellerData);
        setWarehouse(warehouseData);

        const currentDate = new Date();
        console.log(currentDate);

        const filteredByCurrentMonth = sellerOrderList.filter((order) => {
          const orderDate = new Date(order.created_at);
          console.log(orderDate);
          return (
            orderDate.getMonth() === currentDate.getMonth() &&
            orderDate.getFullYear() === currentDate.getFullYear()
          );
        });

        //console.log(filteredByCurrentMonth);
        console.log(filteredByCurrentMonth);
        setRowData(filteredByCurrentMonth);
        setOriginalData(sellerOrderList);
        //calculateTotals(filteredByCurrentMonth);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isRefetch]);

  const data = {
    columns: [
      { Header: "Seller", accessor: "seller", align: "center", width: "15%" },
      { Header: "Received Quantity", accessor: "ReceivedQuantity", align: "center" },
      { Header: "Sold Quantity", accessor: "SoldQuantity", align: "center" },
      { Header: "Received Date", accessor: "date", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((orders) => ({
      seller: <Author name={orders.seller_id.seller_name} />,
      ReceivedQuantity: <Author name={orders.received_qty} />,
      SoldQuantity: <Author name={orders.consumed_qty} />,
      date: <Author name={formatDate(orders.created_at)} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography component="a" href="#" variant="caption" color="blue" fontWeight="medium">
              <DetailsModal
                purchaseOrderData={orders}
                warehouses={warehouses}
                handleDelete={handleDelete}
              />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };

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
                  <MDTypography
                    color="white"
                    style={{
                      fontSize: 13,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Total Received: {received}
                  </MDTypography>
                  <MDTypography
                    color="white"
                    style={{
                      display: "flex",
                      fontSize: 13,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Total Damaged: {rejected}
                  </MDTypography>
                  <MDTypography
                    color="white"
                    style={{
                      display: "flex",
                      fontSize: 13,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Total Sales: {sold}
                  </MDTypography>
                  <Button onClick={openFilterModal} variant="contained" color="white">
                    Filters
                  </Button>
                  <FilterModal
                    open={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    onFilter={handleFilter}
                  />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDTypography
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "95%",
                  }}
                >
                  <MDTypography
                    sx={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 3,
                      color: "#7b809a",
                    }}
                  >
                    <Button
                      onClick={openWareHouseFilterModal}
                      variant="contained"
                      sx={{ marginLeft: 2, marginRight: 2 }}
                      color="dark"
                    >
                      Select WareHouse
                    </Button>
                    Filter by WareHouse Name
                  </MDTypography>
                  <MDTypography
                    sx={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 3,
                      color: "#7b809a",
                    }}
                  >
                    <Button
                      onClick={openSellerFilterModal}
                      variant="contained"
                      sx={{ marginLeft: 2, marginRight: 2 }}
                      color="dark"
                    >
                      Select Seller
                    </Button>
                    Filter by Seller Name
                  </MDTypography>
                  <MDTypography
                    sx={{
                      fontSize: 10,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 3,
                      color: "#7b809a",
                    }}
                  >
                    <Button
                      onClick={resetFilters}
                      variant="contained"
                      sx={{ marginLeft: 2, marginRight: 2 }}
                      color="dark"
                    >
                      Reset
                    </Button>
                    Reset the Filters
                  </MDTypography>
                </MDTypography>
                <WareHouseModal
                  open={isWareHouseModalOpen}
                  onClose={() => setIsWareHouseModalOpen(false)}
                  filterObjectsByWarehouseId={filterObjectsByWarehouseId}
                />
                <SellerModal
                  open={isSellerModalOpen}
                  onClose={() => setIsSellerModalOpen(false)}
                  filterObjectsBySellerId={filterObjectsBySellerId}
                />
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
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SellerOrderTable;

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
