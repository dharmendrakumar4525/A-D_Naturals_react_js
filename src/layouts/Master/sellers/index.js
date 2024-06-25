import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import { axiosInstance } from "environments/environment";
import {
  GET_SELLER_API,
  GET_WAREHOUSE_API,
  GET_LOCATION_API,
  GET_PERMISSION,
} from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "../../../assets/images/Loader.gif";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SellerTableModal from "layouts/Master/sellers/sellersTableModal";

function SellersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  // Delete Function
  const handleDelete = async (sellerId) => {
    if (permission[3]?.isSelected === false) {
      handleError("You don't have permission to delete");
      return;
    }
    try {
      await axiosInstance.delete(`${GET_SELLER_API}/${sellerId}`);
      setRowData((prevData) => prevData.filter((seller) => seller._id !== sellerId));
      handleError("Seller Deleted Successfully");
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  // Filter Function
  const filterData = () => {
    if (!searchQuery) {
      setRowData(originalData);
      return;
    }

    const filteredData = originalData.filter((seller) =>
      seller.seller_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setRowData(filteredData);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery]);

  // Fetch Function
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const sellerResponse = await axiosInstance.get(`${GET_SELLER_API}`);
        const sellerData = sellerResponse.data.data;

        const warehouseResponse = await axiosInstance.get(`${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;

        const locationResponse = await axiosInstance.get(`${GET_LOCATION_API}`);
        const locationData = locationResponse.data.data;

        const mappedData = sellerData.map((seller) => {
          const warehouse = warehouseData.find((warehouse) => warehouse._id === seller.warehouse);

          return {
            ...seller,
            warehouse_name: warehouse ? warehouse.warehouse_name : "Not Known",
          };
        });

        setRowData(mappedData);
        setOriginalData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setLoadingData(false);
    };

    fetchData();
  }, [isRefetch]);

  // Fetch Permission Data
  useEffect(() => {
    const fetchPermissionData = async () => {
      setLoadingPermissions(true);
      const data = getLocalStorageData("A&D_User");
      try {
        const permissionResponse = await axiosInstance.get(`${GET_PERMISSION}${data._id}`);
        const permissionData = permissionResponse.data.data.permissions[0].ParentChildchecklist;

        const modulePermission = permissionData.find((item) => item.moduleName === "Seller");

        if (modulePermission) {
          setPermission(modulePermission.childList);
        }
      } catch (error) {
        console.error("Error fetching permission data:", error);
      }
      setLoadingPermissions(false);
    };
    fetchPermissionData();
  }, [isRefetch]);

  const isLoading = loadingData || loadingPermissions;

  // Main Component
  const data = {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Warehouse Location", accessor: "warehouse_location", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((seller) => ({
      name: <Author name={seller.seller_name} location={seller.seller_location} />,
      warehouse_location: <Job warehouseName={seller.warehouse_name} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(seller._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <SellerTableModal
                sellerId={seller._id}
                setIsRefetch={setIsRefetch}
                permission={permission}
              />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };

  return (
    <DashboardLayout>
      <DashboardNavbar onSearch={onSearch} />
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
                  Sellers Table
                  <SellerTableModal permission={permission} />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {isLoading ? (
                  <MDBox mx="auto" my="auto" style={{ textAlign: "center", paddingBottom: 50 }}>
                    <img src={Loader} alt="loading..." />
                    <MDTypography sx={{ fontSize: 12 }}>Please Wait....</MDTypography>
                  </MDBox>
                ) : permission[1]?.isSelected === true ? (
                  <DataTable
                    table={{ columns: data.columns, rows: data.rows }}
                    isSorted={false}
                    entriesPerPage={{ defaultValue: 10, entries: [10, 15, 20, 25] }}
                    showTotalEntries={true}
                    noEndBorder
                    pagination={{ variant: "contained", color: "info" }}
                  />
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
                    Permission not Granted to View the Locations
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

export default SellersTable;

//----------------------------Roles Component---------------------------------
const Author = ({ name, location }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{location}</MDTypography>
    </MDBox>
  </MDBox>
);

const Job = ({ warehouseName }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {warehouseName}
    </MDTypography>
  </MDBox>
);

Author.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

Job.propTypes = {
  warehouseName: PropTypes.string.isRequired,
};
