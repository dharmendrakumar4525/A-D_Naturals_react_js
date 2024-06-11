/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import UserTableModal from "layouts/UserManagement/users/userTableModal";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "environments/environment";
import {
  GET_USERS_API,
  GET_ROLES_API,
  POST_USER_DELETE_API,
  GET_PERMISSION,
} from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import { Margin } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function UserTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [permission, setPermission] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  //----------------------------Filter Function---------------------------------

  const filterData = () => {
    console.log(searchQuery, "Here");
    if (!searchQuery) {
      setRowData(originalData);
      return;
    }

    const filteredData = originalData.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(filteredData, "here");

    setRowData(filteredData);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery]);

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${environment.api_path}/${GET_USERS_API}`);
        const usersData = usersResponse.data;

        const rolesResponse = await axios.get(`${environment.api_path}/${GET_ROLES_API}`);
        const rolesData = rolesResponse.data;

        console.log("usersDaaata", usersData);
        console.log("rolesData", rolesData);

        const mappedData = usersData.map((user) => {
          const role = rolesData.find((role) => role._id === user.role);
          return {
            ...user,
            role: role ? role.role : "Unknown Role",
          };
        });

        setRowData(mappedData);
        setOriginalData(mappedData);
        console.log("mappecccdata", mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (userId) => {
    if (permission[3]?.isSelected === false) {
      handleError("You don't have permission to delete");
      return;
    }
    try {
      await axios.delete(`${environment.api_path}/${POST_USER_DELETE_API}/${userId}`);
      setRowData((prevData) => prevData.filter((user) => user._id !== userId));
      handleError("User Deleted Succesfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

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
        const modulePermission = permissionData.find((item) => item.moduleName === "users");

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
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Role", accessor: "role", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: rowData.map((user) => ({
      name: <Author name={user.name} email={user.email} />,
      role: <Job title={user.role} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(user._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <UserTableModal
                userId={user._id}
                setIsRefetch={setIsRefetch}
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
                  User Table
                  <UserTableModal permission={permission} />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {permission[1]?.isSelected === true ? (
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
                    Permission not Granted to View the Users
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
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UserTable;

//----------------------------Author Component---------------------------------

const Author = ({ name, email }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{email}</MDTypography>
    </MDBox>
  </MDBox>
);

//----------------------------Job Component---------------------------------

const Job = ({ title, description }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {title}
    </MDTypography>
    <MDTypography variant="caption">{description}</MDTypography>
  </MDBox>
);

//----------------------------Props Declaration---------------------------------

Author.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

Job.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};
