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

import { useState } from "react";
import axios from "axios";
import { GET_USER_LOGIN_API } from "environments/apiPaths";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/ADBg.png";
import { environment } from "environments/environment";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dashboardNavigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${environment.api_path}/${GET_USER_LOGIN_API}`, {
        email: email,
        password: password,
      });
      const andLoginToken = response.data.token;

      if (response) {
        localStorage.setItem("A&D_Login_Token", andLoginToken);
        dashboardNavigate("/dashboard");
      }
      console.log("responseresponse", andLoginToken);

      // Handle the response as needed
      console.log("Sign-in successful:", response.data);
    } catch (error) {
      // Handle errors
      console.error("Error signing in:", error);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      {/* <BasicLayout
      image={
        "https://assets-global.website-files.com/65e842c42311b272adf8e5b4/65e85eb8d772ca02a714c694_Group%201000001773.png"
      }
    > */}
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            {/* Removed unnecessary Grid container */}
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              {/* <Switch checked={rememberMe} onChange={handleSetRememberMe} /> */}
              {/* <Typography // Changed MuiLink to Typography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </Typography> */}
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                type="button"
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSignIn}
              >
                Sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
