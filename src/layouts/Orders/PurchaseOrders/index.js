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
import { GET_PURCHASEORDER_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import { getVendorNameByID, formatDate } from "../utils";
import DetailsModal from "./DetailsModal";
import FilterModal from "./FilterModal";

function PurchaseOrderTable() {
  const [vendors, setVendors] = useState([]);
  const [warehouses, setWarehouse] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [cost, setCost] = useState(0);
  const [purchase, setPurchase] = useState([0]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (purchaseOrderID) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_PURCHASEORDER_API}/${purchaseOrderID}`);
      setRowData((prevData) => prevData.filter((purchase) => purchase._id !== purchaseOrderID));
      setIsFilterModalOpen(false);
    } catch (error) {
      console.error("Error deleting PurchaseOrder:", error);
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
        filteredData = originalData.filter((order) => {
          const orderDate = parseISO(order.created_at);
          return isWithinInterval(orderDate, {
            start: startOfMonth(new Date(startYear, month - 1, 1)),
            end: endOfMonth(new Date(startYear, month - 1, 1)),
          });
        });
        break;

      case "quarterly":
        filteredData = originalData.filter((order) => {
          const orderDate = parseISO(order.created_at);
          return isWithinInterval(orderDate, {
            start: startOfQuarter(addMonths(new Date(startYear, 3, 1), (quarter - 1) * 3)),
            end: endOfQuarter(addMonths(new Date(startYear, 3, 1), (quarter - 1) * 3)),
          });
        });
        break;

      case "halfyearly":
        if (halfYear === "1") {
          filteredData = originalData.filter((order) => {
            const orderDate = parseISO(order.created_at);
            return isWithinInterval(orderDate, {
              start: new Date(startYear, 3, 1),
              end: new Date(startYear, 8, 30),
            });
          });
        } else {
          filteredData = originalData.filter((order) => {
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

    let totalOrderQuantity = 0;
    let totalPrice = 0;

    // Iterate over the warehouses array to sum up the quantities and calculate the total price
    filteredData.forEach((order) => {
      totalOrderQuantity += order.order_qty;
    });

    filteredData.forEach((order) => {
      totalPrice += order.price * order.order_qty;
    });

    setPurchase(totalOrderQuantity);
    setCost(totalPrice);

    setRowData(filteredData);
  };

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const PurchaseOrderResponse = await axios.get(
          `${environment.api_path}${GET_PURCHASEORDER_API}`
        );
        const PurchaseOrdersList = PurchaseOrderResponse.data.data;

        console.log(PurchaseOrdersList, "Here");

        const vendorResponse = await axios.get(`${environment.api_path}/vendor`);
        const vendorData = vendorResponse.data.data;
        setVendors(vendorData);

        const warehouseResponse = await axios.get(`${environment.api_path}/warehouse`);
        const warehouseData = warehouseResponse.data.data;
        console.log(warehouseData);
        setWarehouse(warehouseData);

        const currentDate = new Date();
        console.log(currentDate);

        const filteredByCurrentMonth = PurchaseOrdersList.filter((order) => {
          const orderDate = new Date(order.created_at);
          console.log(orderDate);
          return (
            orderDate.getMonth() === currentDate.getMonth() &&
            orderDate.getFullYear() === currentDate.getFullYear()
          );
        });

        let totalOrderQuantity = 0;
        let totalPrice = 0;

        // Iterate over the warehouses array to sum up the quantities and calculate the total price
        filteredByCurrentMonth.forEach((order) => {
          totalOrderQuantity += order.order_qty;
        });

        filteredByCurrentMonth.forEach((order) => {
          totalPrice += order.price * order.order_qty;
        });

        setPurchase(totalOrderQuantity);
        setCost(totalPrice);

        //console.log(filteredByCurrentMonth);
        console.log(filteredByCurrentMonth);
        setRowData(filteredByCurrentMonth);

        setOriginalData(PurchaseOrdersList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  //----------------------------Row Data---------------------------------
  const data = {
    columns: [
      { Header: "PO No.", accessor: "PONo", align: "center", width: "15%" },
      { Header: "Vendor", accessor: "vendor", align: "center" },
      { Header: "Order Quantity", accessor: "quantity", align: "center" },
      { Header: "Purchase Date", accessor: "date", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((orders) => ({
      PONo: <Author name={orders.po_no} />,
      vendor: <Author name={getVendorNameByID(vendors, orders.vendor)} />,
      quantity: <Author name={orders.order_qty} />,
      date: <Author name={formatDate(orders.created_at)} />,

      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography component="a" href="#" variant="caption" color="blue" fontWeight="medium">
              <DetailsModal
                purchaseOrderData={orders}
                vendors={vendors}
                warehouses={warehouses}
                handleDelete={handleDelete}
              />
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
                    Total Purchase: {purchase}
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
                    Total Cost: {cost}
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
                <DataTable
                  table={{ columns: data.columns, rows: data.rows }}
                  isSorted={false}
                  entriesPerPage={{ defaultValue: 10, entries: [10, 15, 20, 25] }}
                  showTotalEntries={true}
                  noEndBorder
                  pagination={{ variant: "contained", color: "info" }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PurchaseOrderTable;

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
