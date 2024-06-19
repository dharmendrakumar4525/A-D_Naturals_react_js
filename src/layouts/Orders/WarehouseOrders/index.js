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
import {
  GET_PURCHASEORDER_API,
  GET_WAREHOUSEORDER_API,
  GET_PERMISSION,
} from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import { getVendorNameByID, formatDate, getWarehouseNameByID } from "../utils";
import DetailsModal from "./DetailsModal";
import FilterModal from "./FilterModal";
import WareHouseModal from "./wareHouseFilterModal";
import Loader from "../../../assets/images/Loader.gif";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import { Margin } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { axiosInstance } from "environments/environment";

function WareHouseOrderTable() {
  const [vendors, setVendors] = useState([]);
  const [warehouses, setWarehouse] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [user, setUser] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [warehouseFilterData, setWarehouseFilterData] = useState([]);
  const [rejected, setRejected] = useState(0);
  const [received, setRceived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const openWareHouseFilterModal = () => {
    setIsWareHouseModalOpen(true);
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (warehouseOrderID) => {
    if (permission[3]?.isSelected === false) {
      handleError("You don't have permission to delete");
      return;
    }
    try {
      await axiosInstance.delete(`${GET_WAREHOUSEORDER_API}/${warehouseOrderID}`);
      setRowData((prevData) => prevData.filter((purchase) => purchase._id !== warehouseOrderID));
      setIsFilterModalOpen(false);
    } catch (error) {
      console.error("Error deleting WareHouseOrder:", error);
    }
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
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

    if (warehouseId) {
      filteredData = filteredData.filter((order) => order.warehouse === warehouseId);
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
        const warehouseOrderResponse = await axiosInstance.get(`${GET_WAREHOUSEORDER_API}`);
        const warehouseOrdersList = warehouseOrderResponse.data.data;

        console.log(warehouseOrdersList, "Here");

        const warehouseResponse = await axiosInstance.get(`/warehouse`);
        const warehouseData = warehouseResponse.data.data;
        setWarehouse(warehouseData);

        const roleResponse = await axiosInstance.get(`/roles`);
        const roleData = roleResponse.data;

        const userData = getLocalStorageData("A&D_User");
        console.log(userData);

        const role = roleData.filter((role) => role._id === userData.role);
        console.log(role[0].role, "role");

        setUser(role[0].role);

        var filteredObjects = warehouseOrdersList;

        if (role[0].role == "Warehouse Manager") {
          const matchingWarehouses = warehouseData.filter(
            (warehouse) => warehouse.manager === userData._id
          );

          console.log(matchingWarehouses);

          filteredObjects = filteredObjects.filter(
            (object) => object.warehouse === matchingWarehouses[0]._id
          );
        }

        const currentDate = new Date();
        console.log(currentDate);

        const filteredByCurrentMonth = filteredObjects.filter((order) => {
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
        const modulePermission = permissionData.find((item) => item.moduleName === "SellerOrder");

        // If found, save that object in the permission state
        if (modulePermission) {
          setPermission(modulePermission.childList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPermissionData();
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
              <DetailsModal
                purchaseOrderData={orders}
                vendors={vendors}
                warehouses={warehouses}
                handleDelete={handleDelete}
                permission={permission}
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
                  <Button
                    onClick={openFilterModal}
                    variant="contained"
                    color="white"
                    disabled={permission[1]?.isSelected === true ? false : true}
                  >
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
                {user !== "Warehouse Manager" ? (
                  <MDTypography sx={{ fontSize: 12, marginBottom: 3 }}>
                    <Button
                      onClick={openWareHouseFilterModal}
                      variant="contained"
                      sx={{ marginLeft: 2, marginRight: 2 }}
                      color="dark"
                      disabled={permission[1]?.isSelected === true ? false : true}
                    >
                      Select WareHouse
                    </Button>
                    Select the WareHouse*
                  </MDTypography>
                ) : (
                  ""
                )}
                <WareHouseModal
                  open={isWareHouseModalOpen}
                  onClose={() => setIsWareHouseModalOpen(false)}
                  filterObjectsByWarehouseId={filterObjectsByWarehouseId}
                />
                {permission[1]?.isSelected === true ? (
                  loading ? (
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
                  )
                ) : (
                  <MDTypography
                    sx={{
                      margin: 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Permission not Granted to View the WareHouse Orders
                    <MDTypography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      Contact the Admin for Access
                    </MDTypography>
                  </MDTypography>
                )}
              </MDBox>
            </Card>
          </Grid>
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
