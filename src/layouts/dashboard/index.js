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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Gauge } from "@mui/x-charts";
import { Card } from "@mui/material";
import { Bar } from "react-chartjs-2";
import MDTypography from "components/MDTypography";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [orgUserData, setOrgUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");
        const allUsersResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const allUsersData = allUsersResponse.data;

        const userData = allUsersData.filter((user) => user.role === "user");

        const orgUserData = userData.filter((user) => user.org_id === Login_User_OrgId);
        setOrgUserData(orgUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {orgUserData.map((user, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title={user.name}
                  count={281}
                  percentage={{
                    color: "success",
                    amount: "+55% ",
                    label: "than lask week",
                  }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>
        <MDBox py={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={6}>
                <Card sx={{ height: "100%" }}>
                  <MDBox padding="1rem" height="2rem"></MDBox>
                  <MDTypography variant="h6" textTransform="capitalize" padding="2.5rem">
                    Overall Compliances
                  </MDTypography>
                </Card>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={6}>
                <Card sx={{ height: "100%" }}>
                  <MDBox padding="1rem" height="2rem"></MDBox>
                  <MDTypography variant="h6" textTransform="capitalize" padding="2.5rem">
                    Completed Compliances
                  </MDTypography>
                </Card>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={6}>
                <Card sx={{ height: "100%" }}>
                  <MDBox padding="1rem" height="2rem"></MDBox>
                  <MDTypography variant="h6" textTransform="capitalize" padding="2.5rem">
                    Delayed Compliances
                  </MDTypography>
                </Card>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={6}>
                <Card sx={{ height: "100%" }}>
                  <MDBox padding="1rem" height="2rem"></MDBox>
                  <MDTypography variant="h6" textTransform="capitalize" padding="2.5rem">
                    Upcoming Compliances
                  </MDTypography>
                </Card>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Compliance Scoreboard"
                  // description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Department Wise Compliance"
                  // description={
                  //   <>
                  //     (<strong>+15%</strong>) increase in today sales.
                  //   </>
                  // }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <Card sx={{ height: "100%" }}>
                  <MDBox padding="1rem" height="23.65rem">
                    <Card sx={{ height: "20.5rem", backgroundColor: "#F0E68C", mt: -4.75 }}>
                      <MDBox padding="1rem" height="1rem">
                        <MDBox pt={3} pb={1} px={-24}>
                          <Gauge
                            width={400}
                            height={250}
                            value={13}
                            startAngle={-90}
                            endAngle={90}
                            color="#F0E68C"
                          />
                        </MDBox>
                        <MDBox pt={3} pb={1} px={1} mt={-3} mr={-10}>
                          <MDTypography
                            variant="h6"
                            textTransform="capitalize"
                            sx={{ padding: "2.5rem", mt: 2, marginLeft: "-50px" }}
                          >
                            Completion Percentage
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </Card>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart color="dark" title="Employee Scorecard" chart={tasks} />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
