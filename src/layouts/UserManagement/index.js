import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from "axios";
import { GET_USERS_API, GET_ROLES_API } from "environments/apiPaths";
import { axiosInstance } from "environments/environment";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import LoadingOverlay from "validatorsFunctions/LoadingOverlay";

function Tables() {
  const [rolesLength, setRolesLength] = useState([]);
  const [userLength, setUserLength] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const usersResponse = await axiosInstance.get(GET_USERS_API);
        const rolesResponse = await axiosInstance.get(GET_ROLES_API);

        const usersData = usersResponse.data.length;
        const rolesData = rolesResponse.data.length;

        setRolesLength(rolesData);
        setUserLength(usersData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <DashboardLayout>
      {loading && <LoadingOverlay />}
      {!loading && (
        <>
          <DashboardNavbar />
          <MDBox py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/tables/user-table">
                    <ComplexStatisticsCard
                      color="dark"
                      icon="weekend"
                      title="Users"
                      count={userLength}
                      percentage={{
                        color: "success",
                        label: "User Data",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <Link to="/tables/role-table">
                    <ComplexStatisticsCard
                      icon="leaderboard"
                      title="Roles"
                      count={rolesLength}
                      percentage={{
                        color: "success",
                        label: "Role Table",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={31.5}>
                  <Link to="/user-management/role-permissions-management">
                    <ComplexStatisticsCard
                      color="primary"
                      icon="person_add"
                      title="Permissions"
                      count={"."}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Manage Role Permissions ",
                      }}
                    />
                  </Link>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          <Footer />
        </>
      )}
    </DashboardLayout>
  );
}

export default Tables;
