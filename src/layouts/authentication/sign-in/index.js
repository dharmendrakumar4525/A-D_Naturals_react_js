import { useEffect, useState } from "react";
import axios from "axios";
import { GET_USER_LOGIN_API } from "environments/apiPaths";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { environment } from "environments/environment";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Basic() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dashboardNavigate = useNavigate();

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const response = await axios.post(`${environment.api_path}/${GET_USER_LOGIN_API}`, {
        email,
        password,
      });

      const loginToken = response.data.token;
      const loginUserName = response.data.user.name;
      const loginUserEmail = response.data.user.email;
      const loginUserOrgId = response.data.user.org_id;
      const loginUserRole = response.data.user.role;

      const allCompanyResponse = await axios.get(`http://localhost:3000/api/web/company`);
      const allCompanyData = allCompanyResponse.data.data;

      let Login_User_Company_Name;
      if (loginUserOrgId === null) {
        Login_User_Company_Name = "avidus";
      } else {
        const logedInCompanyData = allCompanyData.filter((user) => user._id === loginUserOrgId);
        Login_User_Company_Name = logedInCompanyData[0].name;
      }

      localStorage.setItem("Login_User_Company_Name", Login_User_Company_Name);

      if (response) {
        localStorage.setItem("Login_Token", loginToken);
        localStorage.setItem("Login_User_Name", loginUserName);
        localStorage.setItem("Login_User_Email", loginUserEmail);
        localStorage.setItem("Login_User_OrgId", loginUserOrgId);
        localStorage.setItem("Login_User_Role", loginUserRole);
      }
      if (loginUserRole === "user") {
        dashboardNavigate("/detailed-view");
        window.location.reload();
      } else if (loginUserRole === "superadmin") {
        dashboardNavigate("/dashboard");
        window.location.reload();
      } else {
        dashboardNavigate("/master");
        window.location.reload();
      }

      console.log("Sign-in successful:");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(`Error signing in: ${error.response.data}`);
    }
  };

  return (
    <BasicLayout image={bgImage}>
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
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}></Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address",
                  },
                })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                {...register("password", {
                  required: "Password is required",
                })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
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
