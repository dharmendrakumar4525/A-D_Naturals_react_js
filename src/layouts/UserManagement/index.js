import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { GET_USERS_API, GET_ROLES_API } from "environments/apiPaths";
import { environment } from "environments/environment";

function Tables() {
  const [rolesLength, setRolesLength] = useState([]);
  const [userLength, setUserLength] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const usersResponse = await axios.get(`${environment.api_path}/${GET_USERS_API}`);
        const rolesResponse = await axios.get(`${environment.api_path}/${GET_ROLES_API}`);

        const usersData = usersResponse.data.length;
        const rolesData = rolesResponse.data.length;

        setRolesLength(rolesData);
        setUserLength(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <DashboardLayout>
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
                    // amount: "+3%",
                    label: "Role Table",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={31.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Permissions"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Manage Permissions ",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
