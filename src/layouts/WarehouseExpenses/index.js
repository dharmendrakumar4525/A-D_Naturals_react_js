import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import {
  isWithinInterval,
  startOfQuarter,
  endOfQuarter,
  startOfMonth,
  endOfMonth,
  parseISO,
  addMonths,
} from "date-fns";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DetailsModal from "./DetailsModal";
import FilterModal from "./FilterModal";
import WareHouseModal from "./wareHouseFilterModal";
import Loader from "../../assets/images/Loader.gif";
import { useNavigate } from "react-router-dom";
import { environment } from "environments/environment";
import {
  GET_WAREHOUSEORDER_API,
  GET_WAREHOUSE_EXPENSE_API,
  GET_PERMISSION,
} from "environments/apiPaths";
import { getVendorNameByID, formatDate, getMonthName, getWarehouseNameByID } from "../Orders/utils";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import { Margin } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const WareHouseExpenseTable = () => {
  const [vendors, setVendors] = useState([]);
  const [warehouses, setWarehouse] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isWareHouseModalOpen, setIsWareHouseModalOpen] = useState(false);
  const [warehouseFilterData, setWarehouseFilterData] = useState([]);
  const [totalexpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [permission, setPermission] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [user, setUser] = useState("");

  const openWareHouseFilterModal = () => {
    setIsWareHouseModalOpen(true);
  };

  const openFilterModal = () => {
    if (warehouseId) {
      setIsFilterModalOpen(true);
    } else {
      setError("Please select a warehouse before applying filters.");
    }
  };

  const handleDelete = async (warehouseOrderID) => {
    if (permission[3]?.isSelected === false) {
      handleError("You don't have permission to delete");
      return;
    }
    try {
      await axios.delete(
        `${environment.api_path}/${GET_WAREHOUSE_EXPENSE_API}/${warehouseOrderID}`
      );

      // Logging before and after state update to check the flow
      console.log("Before updating state:", rowData);

      setRowData((prevData) => {
        const updatedData = prevData.filter(
          (purchase) => purchase.detailObject._id !== warehouseOrderID
        );

        // Log the updated state
        console.log("Updated state:", updatedData);

        return updatedData;
      });
    } catch (error) {
      console.error("Error deleting Warehouse Order:", error);
    }
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  //----------------------------Handle Filters ---------------------------

  const handleFilter = (filterType, year, month, quarter, halfYear) => {
    if (!warehouseId) {
      setError("Please select a warehouse before applying filters.");
      return;
    }
    setError("");

    let filteredData = [];
    const startYear = parseInt(year, 10);
    const startDate = new Date(startYear, 3, 1);
    const endDate = new Date(startYear + 1, 2, 31);

    switch (filterType) {
      case "monthly":
        filteredData = originalData.filter((order) => {
          const orderDate = parseISO(order.date);
          return isWithinInterval(orderDate, {
            start: startOfMonth(new Date(startYear, month - 1, 1)),
            end: endOfMonth(new Date(startYear, month - 1, 1)),
          });
        });
        break;
      case "quarterly":
        filteredData = originalData.filter((order) => {
          const orderDate = parseISO(order.date);
          return isWithinInterval(orderDate, {
            start: startOfQuarter(addMonths(new Date(startYear, 3, 1), (quarter - 1) * 3)),
            end: endOfQuarter(addMonths(new Date(startYear, 3, 1), (quarter - 1) * 3)),
          });
        });
        break;
      case "halfyearly":
        if (halfYear === "1") {
          filteredData = originalData.filter((order) => {
            const orderDate = parseISO(order.date);
            return isWithinInterval(orderDate, {
              start: new Date(startYear, 3, 1),
              end: new Date(startYear, 8, 30),
            });
          });
        } else {
          filteredData = originalData.filter((order) => {
            const orderDate = parseISO(order.date);
            return isWithinInterval(orderDate, {
              start: new Date(startYear, 9, 1),
              end: new Date(startYear + 1, 2, 31),
            });
          });
        }
        break;
      case "yearly":
        filteredData = originalData.filter((order) => {
          const orderDate = parseISO(order.date);
          return isWithinInterval(orderDate, { start: startDate, end: endDate });
        });
        break;
      default:
        filteredData = originalData;
        break;
    }

    const filteredObjects = filteredData.filter((object) => object.warehouse === warehouseId);
    const newArray = filteredObjects.map((entry) => {
      const totalAmount = entry.expense.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        warehouse: entry.warehouse,
        date: entry.date,
        totalExpense: totalAmount,
        detailObject: entry,
      };
    });
    const totalExpense = newArray.reduce((sum, expense) => sum + expense.totalExpense, 0);
    setTotalExpenses(totalExpense);
    setWarehouseFilterData(newArray);
    setRowData(newArray);
  };

  //-------------------------------- FILTER BY WAREHOUSE

  const filterObjectsByWarehouseId = (warehouseId) => {
    setWarehouseId(warehouseId);
    setError("");

    const filteredObjects = originalData.filter((object) => object.warehouse === warehouseId);
    const newArray = filteredObjects.map((entry) => {
      const totalAmount = entry.expense.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        warehouse: entry.warehouse,
        date: entry.date,
        totalExpense: totalAmount,
        detailObject: entry,
      };
    });

    const totalExpense = newArray.reduce((sum, expense) => sum + expense.totalExpense, 0);
    setTotalExpenses(totalExpense);
    setWarehouseFilterData(newArray);
    setRowData(newArray);
  };

  //------------------------------Fetch Data-----------------------

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const warehouseExpenseResponse = await axios.get(
          `${environment.api_path}${GET_WAREHOUSE_EXPENSE_API}`
        );
        const warehouseExpenseList = warehouseExpenseResponse.data.data;
        console.log(warehouseExpenseList);
        const warehouseResponse = await axios.get(`${environment.api_path}/warehouse`);
        const warehouseData = warehouseResponse.data.data;
        setWarehouse(warehouseData);

        const ExpenseResponse = await axios.get(`${environment.api_path}/expense`);
        const expenseData = ExpenseResponse.data.data;
        setExpenses(expenseData);

        const roleResponse = await axios.get(`${environment.api_path}/roles`);
        const roleData = roleResponse.data;

        const userData = getLocalStorageData("A&D_User");
        console.log(userData);

        const role = roleData.filter((role) => role._id === userData.role);

        setUser(role[0].role);

        var filteredObjects = warehouseExpenseList;
        if (role[0].role === "Warehouse Manager") {
          const matchingWarehouses = warehouseData.filter(
            (warehouse) => warehouse.manager === userData._id
          );
          setWarehouseId(matchingWarehouses[0]._id);
          filteredObjects = filteredObjects.filter(
            (object) => object.warehouse === matchingWarehouses[0]._id
          );
        }

        const currentDate = new Date();
        const filteredByCurrentMonth = filteredObjects.filter((order) => {
          const orderDate = new Date(order.date);
          return (
            orderDate.getMonth() === currentDate.getMonth() &&
            orderDate.getFullYear() === currentDate.getFullYear()
          );
        });

        const newArray = filteredByCurrentMonth.map((entry) => {
          const totalAmount = entry.expense.reduce((sum, expense) => sum + expense.amount, 0);
          return {
            warehouse: entry.warehouse,
            date: entry.date,
            totalExpense: totalAmount,
            detailObject: entry,
          };
        });

        const totalExpense = newArray.reduce((sum, expense) => sum + expense.totalExpense, 0);
        setTotalExpenses(totalExpense);
        setRowData(newArray);
        setOriginalData(filteredObjects);
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
        const permissionResponse = await axios.get(
          `${environment.api_path}/${GET_PERMISSION}${data._id}`
        );
        const permissionData = permissionResponse.data.data.permissions[0].ParentChildchecklist;
        console.log(permissionData);
        // Check if the permission data contains an object with module name "users"
        const modulePermission = permissionData.find(
          (item) => item.moduleName === "WarehouseExpense"
        );

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

  //----------------------------------Row Data----------------------------------

  const data = {
    columns: [
      { Header: "WareHouse", accessor: "WareHouse", align: "center", width: "15%" },
      { Header: "Month", accessor: "Month", align: "center" },
      { Header: "Total Expense", accessor: "TotalExpense", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((orders) => ({
      WareHouse: <Author name={getWarehouseNameByID(warehouses, orders.warehouse)} />,
      Month: (
        <Author name={`${getMonthName(orders.date)}, ${new Date(orders.date).getFullYear()}`} />
      ),
      TotalExpense: <Author name={`${orders.totalExpense} INR`} />,
      action: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MDTypography component="a" href="#" variant="caption" color="blue" fontWeight="medium">
            <DetailsModal
              purchaseOrderData={orders.detailObject}
              vendors={vendors}
              expenses={expenses}
              warehouses={warehouses}
              handleDelete={handleDelete}
              permission={permission}
            />
          </MDTypography>
        </div>
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
                      display: "flex",
                      fontSize: 13,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Total Expenses: {totalexpenses} INR
                  </MDTypography>

                  <Button
                    onClick={openFilterModal}
                    variant="contained"
                    color="white"
                    disabled={permission[1]?.isSelected === true ? false : true}
                  >
                    Filters
                  </Button>
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {user !== "Warehouse Manager" ? (
                    <Button
                      sx={{ m: 2 }}
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={openWareHouseFilterModal}
                      disabled={permission[1]?.isSelected === true ? false : true}
                    >
                      Select WareHouse
                    </Button>
                  ) : (
                    ""
                  )}
                  <MDTypography sx={{ m: 2, fontSize: 12 }}>
                    {warehouseId
                      ? `Selected WareHouse: ${getWarehouseNameByID(warehouses, warehouseId)}`
                      : ""}
                  </MDTypography>
                  {rowData.length === 0 && (
                    <Button
                      style={{
                        color: "white",
                        m: 2,
                        marginRight: 20,

                        alignSelf: "center",
                      }}
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        navigate("/Warehouse-Expenses/add-wareHouse-expense");
                      }}
                      disabled={permission[0]?.isSelected === true ? false : true}
                    >
                      Add Expense
                    </Button>
                  )}
                </div>
                {error && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <p style={{ color: "red" }}>{error}</p>
                  </div>
                )}
                {permission[1]?.isSelected === true ? (
                  loading ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img src={Loader} alt="Loading..." />
                    </div>
                  ) : (
                    <MDBox p={2}>
                      <DataTable
                        table={data}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                      />
                    </MDBox>
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
        </Grid>
      </MDBox>
      <Footer />
      {isFilterModalOpen && (
        <FilterModal
          open={isFilterModalOpen}
          onFilter={handleFilter}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}
      {isWareHouseModalOpen && (
        <WareHouseModal
          onClose={() => setIsWareHouseModalOpen(false)}
          filterObjectsByWarehouseId={filterObjectsByWarehouseId}
          open={isWareHouseModalOpen}
        />
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity="error"
        >
          {submitError}
        </MuiAlert>
      </Snackbar>
    </DashboardLayout>
  );
};

WareHouseExpenseTable.propTypes = {
  purchaseOrderData: PropTypes.object,
  vendors: PropTypes.array,
  expenses: PropTypes.array,
  warehouses: PropTypes.array,
  handleDelete: PropTypes.func,
};

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

export default WareHouseExpenseTable;
