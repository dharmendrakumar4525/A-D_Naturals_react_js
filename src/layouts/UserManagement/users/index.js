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
import { GET_USERS_API, GET_ROLES_API, POST_USER_DELETE_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";

function UserTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [originalData, setOriginalData] = useState([]);

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
    try {
      await axios.delete(`${environment.api_path}/${POST_USER_DELETE_API}/${userId}`);
      setRowData((prevData) => prevData.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

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
              <UserTableModal userId={user._id} setIsRefetch={setIsRefetch} />
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
                  <UserTableModal />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: data.columns, rows: data.rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
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
