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
  const [companyLength, setCompanyLength] = useState([]);
  const Login_User_Email = localStorage.getItem("Login_User_Email");
  const Login_User_Role = localStorage.getItem("Login_User_Role");

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");

        const usersResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const rolesResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const companyResponse = await axios.get(`http://localhost:3000/api/web/company`);

        const usersData = usersResponse.data;
        const rolesData = rolesResponse.data;
        const companyResponseData = companyResponse.data.data;

        const orgUserData = usersData.filter((user) => user.role === "user");
        const normalUserData = orgUserData.filter((user) => user.org_id === Login_User_OrgId);

        const superadminData = rolesData.filter((user) => user.role === "superadmin");
        const companyData = companyResponseData.filter((user) => user.parent_id === null);

        setRolesLength(superadminData.length);
        setUserLength(normalUserData.length);
        setCompanyLength(companyData.length);
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
          {Login_User_Email != "avidus@gmail.com" && Login_User_Role != "user" && (
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
          )}
          {Login_User_Email === "avidus@gmail.com" && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/tables/admin-table">
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="Admins"
                    count={rolesLength}
                    percentage={{
                      color: "success",
                      // amount: "+3%",
                      label: "Admins Table",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
