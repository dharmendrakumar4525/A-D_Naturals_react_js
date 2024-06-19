import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function MasterTables() {
  const [userCount, setUserCount] = useState([]);
  const [companyCount, setCompanyCount] = useState([]);
  const [entityCount, setEntityCount] = useState([]);
  const Login_User_Email = localStorage.getItem("Login_User_Email");
  const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");
  const Login_User_Role = localStorage.getItem("Login_User_Role");

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/api/web/compliance`);
        const userData = userResponse.data.data;

        setUserCount(userData.length);

        const companyResponse = await axios.get(`http://localhost:3000/api/web/company`);
        const companyResponseData = companyResponse.data.data;
        const companyData = companyResponseData.filter((user) => user.parent_id === null);

        const entityData = companyResponseData.filter(
          (user) => user.parent_id === Login_User_OrgId
        );
        console.log("companyData", companyData);
        console.log("entityData", entityData);

        setCompanyCount(companyData.length);
        setEntityCount(entityData.length);
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
                <Link to="/master/compliance">
                  <ComplexStatisticsCard
                    color="success"
                    icon="store"
                    title="Compliance"
                    count={userCount}
                    percentage={{
                      color: "success",
                      label: "Compliance Table",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}

          {Login_User_Email === "avidus@gmail.com" && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/master/companies">
                  <ComplexStatisticsCard
                    color="dark"
                    icon="weekend"
                    title="Companies"
                    count={companyCount}
                    percentage={{
                      color: "success",
                      label: "Companies Table",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
          {Login_User_Email != "avidus@gmail.com" && Login_User_Role != "user" && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/master/entity">
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="Entity"
                    count={entityCount}
                    percentage={{
                      color: "success",
                      // amount: "+3%",
                      label: "Entity Table",
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

export default MasterTables;
