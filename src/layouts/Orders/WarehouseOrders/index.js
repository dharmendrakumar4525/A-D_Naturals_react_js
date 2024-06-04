// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
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
import { GET_PURCHASEORDER_API, GET_WAREHOUSEORDER_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import { getVendorNameByID, formatDate, getWarehouseNameByID } from "../utils";
import DetailsModal from "./DetailsModal";
import FilterModal from "./FilterModal";
import WareHouseModal from "./wareHouseFilterModal";
import Loader from "../../../assets/images/Loader.gif";

function WareHouseOrderTable() {
  const [vendors, setVendors] = useState([]);
  const [warehouses, setWarehouse] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [warehouseFilterData, setWarehouseFilterData] = useState([]);
  const [rejected, setRejected] = useState(0);
  const [received, setRceived] = useState(0);
  const [loading, setLoading] = useState(true);

  const openWareHouseFilterModal = () => {
    setIsWareHouseModalOpen(true);
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (warehouseOrderID) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_WAREHOUSEORDER_API}/${warehouseOrderID}`);
      setRowData((prevData) => prevData.filter((purchase) => purchase._id !== warehouseOrderID));
      setIsFilterModalOpen(false);
    } catch (error) {
      console.error("Error deleting WareHouseOrder:", error);
    }
  };

  //----------------------------Filter Function ---------------------------------

  const handleFilter = (filterType, year, month, quarter, halfYear) => {
    let filteredData = [];

    const startYear = parseInt(year, 10);
    const startDate = new Date(startYear, 3, 1); // Start from April of the given year
    const endDate = new Date(startYear + 1, 2, 31); // End at March of the next year

    switch (filterType) {
      case "monthly":
        filteredData = warehouseFilterData.filter((order) => {
          const orderDate = parseISO(order.created_at);
          return isWithinInterval(orderDate, {
            start: startOfMonth(new Date(startYear, month - 1, 1)),
            end: endOfMonth(new Date(startYear, month - 1, 1)),
          });
        });
        break;

      case "quarterly":
        filteredData = warehouseFilterData.filter((order) => {
          const orderDate = parseISO(order.created_at);
          return isWithinInterval(orderDate, {
            start: startOfQuarter(addMonths(new Date(startYear, 3, 1), (quarter - 1) * 3)),
            end: endOfQuarter(addMonths(new Date(startYear, 3, 1), (quarter - 1) * 3)),
          });
        });
        break;

      case "halfyearly":
        if (halfYear === "1") {
          filteredData = warehouseFilterData.filter((order) => {
            const orderDate = parseISO(order.created_at);
            return isWithinInterval(orderDate, {
              start: new Date(startYear, 3, 1),
              end: new Date(startYear, 8, 30),
            });
          });
        } else {
          filteredData = warehouseFilterData.filter((order) => {
            const orderDate = parseISO(order.created_at);
            return isWithinInterval(orderDate, {
              start: new Date(startYear, 9, 1),
              end: new Date(startYear + 1, 2, 31),
            });
          });
        }
        break;

      case "yearly":
        filteredData = originalData.filter((order) => {
          const orderDate = parseISO(order.created_at);
          return isWithinInterval(orderDate, { start: startDate, end: endDate });
        });
        break;

      default:
        filteredData = originalData;
        break;
    }

    let received = 0;
    filteredData.forEach((order) => {
      received += order.received_qty;
    });

    let rejected = 0;
    filteredData.forEach((order) => {
      rejected += order.rejected_qty;
    });

    setRceived(received);
    setRejected(rejected);
    setRowData(filteredData);
  };

  //----------------------------------WareHouse Filter ------------------

  function filterObjectsByWarehouseId(warehouseId) {
    setWarehouseId(warehouseId);
    console.log(warehouseId, "here warehouse");

    // Assuming originalData is your array of objects
    const filteredObjects = originalData.filter((object) => object.warehouse === warehouseId);
    console.log(filteredObjects);
    setRowData(filteredObjects);
    setWarehouseFilterData(filteredObjects);
    let received = 0;
    filteredObjects.forEach((order) => {
      received += order.received_qty;
    });

    let rejected = 0;
    filteredObjects.forEach((order) => {
      rejected += order.rejected_qty;
    });

    setRceived(received);
    setRejected(rejected);
  }

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const warehouseOrderResponse = await axios.get(
          `${environment.api_path}${GET_WAREHOUSEORDER_API}`
        );
        const warehouseOrdersList = warehouseOrderResponse.data.data;

        console.log(warehouseOrdersList, "Here");

        const warehouseResponse = await axios.get(`${environment.api_path}/warehouse`);
        const warehouseData = warehouseResponse.data.data;
        setWarehouse(warehouseData);

        const currentDate = new Date();
        console.log(currentDate);

        const filteredByCurrentMonth = warehouseOrdersList.filter((order) => {
          const orderDate = new Date(order.created_at);
          console.log(orderDate);
          return (
            orderDate.getMonth() === currentDate.getMonth() &&
            orderDate.getFullYear() === currentDate.getFullYear()
          );
        });
        let received = 0;
        filteredByCurrentMonth.forEach((order) => {
          received += order.received_qty;
        });

        let rejected = 0;
        filteredByCurrentMonth.forEach((order) => {
          rejected += order.rejected_qty;
        });

        setRceived(received);
        setRejected(rejected);

        //console.log(filteredByCurrentMonth);
        console.log(filteredByCurrentMonth);
        setRowData(filteredByCurrentMonth);

        setOriginalData(warehouseOrdersList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isRefetch]);

  //----------------------------Row Data---------------------------------
  const data = {
    columns: [
      { Header: "PO No.", accessor: "PONo", align: "center", width: "15%" },
      { Header: "WareHouse", accessor: "WareHouse", align: "center" },
      { Header: "Received Quantity", accessor: "ReceivedQuantity", align: "center" },
      { Header: "Received Date", accessor: "date", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((orders) => ({
      PONo: <Author name={orders.po_no} />,
      WareHouse: <Author name={getWarehouseNameByID(warehouses, orders.warehouse)} />,
      ReceivedQuantity: <Author name={orders.received_qty} />,
      date: <Author name={formatDate(orders.created_at)} />,

      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography component="a" href="#" variant="caption" color="blue" fontWeight="medium">
              {warehouseId === "" ? (
                "view"
              ) : (
                <DetailsModal
                  purchaseOrderData={orders}
                  vendors={vendors}
                  warehouses={warehouses}
                  handleDelete={handleDelete}
                />
              )}
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
                <MDTypography sx={{ fontSize: 12, marginBottom: 3 }}>
                  <Button
                    onClick={openWareHouseFilterModal}
                    variant="contained"
                    sx={{ marginLeft: 2, marginRight: 2 }}
                    color="dark"
                  >
                    Select WareHouse
                  </Button>
                  Select the WareHouse*
                </MDTypography>
                <WareHouseModal
                  open={isWareHouseModalOpen}
                  onClose={() => setIsWareHouseModalOpen(false)}
                  filterObjectsByWarehouseId={filterObjectsByWarehouseId}
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

export default WareHouseOrderTable;

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
