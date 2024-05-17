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

import RolesTableModal from "layouts/UserManagement/roles/rolesTableModal";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // Import axios
import { environment } from "environments/environment"; // Assuming environment is a file that contains environment variables
import DeleteIcon from "@mui/icons-material/Delete";
import { GET_ROLES_API } from "environments/apiPaths";

function RolesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_ROLES_API}/${roleId}`);
      setRowData((prevData) => prevData.filter((role) => role._id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  //----------------------------Filter Function ---------------------------------

  const filterData = () => {
    console.log(searchQuery, "Here");
    if (!searchQuery) {
      setRowData(originalData);
      return;
    }

    const filteredData = originalData.filter((role) =>
      role.role.toLowerCase().includes(searchQuery.toLowerCase())
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
        const rolesResponse = await axios.get(`${environment.api_path}/${GET_ROLES_API}`);
        const rolesData = rolesResponse.data;
        console.log(rolesData);
        setRowData(rolesData);
        setOriginalData(rolesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  //----------------------------Row Data---------------------------------
  const data = {
    columns: [
      { Header: "Role", accessor: "role", width: "30%", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: rowData.map((user) => ({
      role: <Role title={user.role} />,
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
              <RolesTableModal userId={user._id} setIsRefetch={setIsRefetch} />
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
                  Roles Table
                  <RolesTableModal />
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

export default RolesTable;

//----------------------------Roles Component---------------------------------
const Role = ({ title }) => (
  <MDBox lineHeight={1} textAlign="left" key={title}>
    <MDTypography display="block" variant="button" fontWeight="medium">
      {title}
    </MDTypography>
  </MDBox>
);

Role.propTypes = {
  title: PropTypes.string.isRequired,
};
