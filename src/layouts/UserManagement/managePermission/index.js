import React, { useState } from "react";
import {
  Grid,
  Card,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import { useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import RoleModal from "./RoleModal";
import initialData from "./managePermissionArray";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import arrowUpIcon from "../../../assets/images/icons/arrow-up.png";
import downwardArrowIcon from "../../../assets/images/icons/downward-arrow.png";
import { environment } from "environments/environment";
import { POST_MANAGE_PERMISSION } from "environments/apiPaths";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { GET_ROLES_API } from "environments/apiPaths";
import { getLocalStorageData } from "validatorsFunctions/HelperFunctions";
import { axiosInstance } from "environments/environment";

function ManagePermission() {
  const [role, setRole] = useState(initialData);
  const [dashboardPermission, setDashboardPermission] = useState(
    initialData.dashboard_permissions[0].ParentChildchecklist
  );
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isRefetch, setIsRefetch] = useState(false);

  const openRoleFilterModal = () => {
    setIsRoleModalOpen(true);
  };

  //-------------------------------- GET PERMISSION Array ------------------------
  useEffect(() => {
    const fetchPermissionData = async () => {
      const data = getLocalStorageData("A&D_User");
      console.log(data, "permission");
      try {
        const rolesResponse = await axiosInstance.get(GET_ROLES_API);
        const rolesData = rolesResponse.data;
        const selectedRole = rolesData.find((role) => role._id === data.role);
        console.log(selectedRole.role);
        setUserRole(selectedRole.role);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPermissionData();
  }, [isRefetch]);

  const filterObjectsByRoleId = (roleId, availableRoles) => {
    // Ensure availableRoles is an array
    if (!Array.isArray(availableRoles)) {
      console.error("Available roles must be an array.");
      return;
    }

    // Find the role with the given roleId
    const selectedRole = availableRoles.find((role) => role._id === roleId);

    if (!selectedRole) {
      console.error("Role with the given roleId not found.");
      return;
    }
    console.log(selectedRole);
    // Set the selected role and its dashboard permissions
    setRole(selectedRole);
    setDashboardPermission(selectedRole.dashboard_permissions[0]?.ParentChildchecklist || []);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSelectAll = () => {
    const newSelected = !allSelected;
    setAllSelected(newSelected);
    const newPermissions = dashboardPermission.map((module) => ({
      ...module,
      isSelected: newSelected,
      childList: module.childList.map((child) => ({
        ...child,
        isSelected: newSelected,
      })),
    }));
    setDashboardPermission(newPermissions);
  };

  const handleExpandAll = () => {
    const newExpanded = !allExpanded;
    setAllExpanded(newExpanded);
    const newPermissions = dashboardPermission.map((module) => ({
      ...module,
      isClosed: !newExpanded,
    }));
    setDashboardPermission(newPermissions);
  };

  const handleParentSelect = (parentId) => {
    const newPermissions = dashboardPermission.map((module) => {
      if (module.id === parentId) {
        const newSelected = !module.isSelected;
        return {
          ...module,
          isSelected: newSelected,
          childList: module.childList.map((child) => ({
            ...child,
            isSelected: newSelected,
          })),
        };
      }
      return module;
    });
    setDashboardPermission(newPermissions);
  };

  const handleChildSelect = (parentId, childId) => {
    const newPermissions = dashboardPermission.map((module) => {
      if (module.id === parentId) {
        const newChildList = module.childList.map((child) => {
          if (child.id === childId) {
            return {
              ...child,
              isSelected: !child.isSelected,
            };
          }
          return child;
        });
        const isParentSelected = newChildList.every((child) => child.isSelected);
        return {
          ...module,
          isSelected: isParentSelected,
          childList: newChildList,
        };
      }
      return module;
    });
    setDashboardPermission(newPermissions);
  };

  const handleParentDropdownToggle = (parentId) => {
    const newPermissions = dashboardPermission.map((module) => {
      if (module.id === parentId) {
        return {
          ...module,
          isClosed: !module.isClosed,
        };
      }
      return module;
    });
    setDashboardPermission(newPermissions);
  };

  const handleError = (errorMessage) => {
    setSubmitError(errorMessage);
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {
    if (!role.role) {
      handleError("Select the Role First");
      return;
    }
    try {
      const newFormData = {
        role: role.role,
        dashboard_permissions: {
          isAllSelected: false,
          isAllCollapsed: false,
          ParentChildchecklist: dashboardPermission,
        },
      };
      console.log("New form data for dashboard permissions:", newFormData);

      const url = `${POST_MANAGE_PERMISSION}/${role.role}`;
      await axiosInstance.put(url, newFormData);

      handleError("Permission Updated Successfully");
    } catch (error) {
      console.log("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while submitting the form. Please try again later.";
      handleError(errorMessage);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  Manage Role Permissions {`: ${role.role}`}
                  <Button
                    onClick={openRoleFilterModal}
                    variant="contained"
                    color="white"
                    disabled={userRole !== "SuperAdmin"}
                  >
                    Select Role
                  </Button>
                  <RoleModal
                    open={isRoleModalOpen}
                    onClose={() => setIsRoleModalOpen(false)}
                    filterObjectsByRoleId={filterObjectsByRoleId}
                  />
                </MDTypography>
              </MDBox>

              {userRole !== "SuperAdmin" ? (
                <MDBox p={2} display="flex" justifyContent="center" alignItems="center">
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
                    Permission not Granted to View the User Acess Management
                    <MDTypography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      Contact the Admin for Access
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              ) : (
                <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                    <FormControlLabel
                      control={
                        <Checkbox size="small" checked={allSelected} onChange={handleSelectAll} />
                      }
                      label="Select All"
                    />
                    <Button onClick={handleExpandAll}>
                      {allExpanded ? (
                        <img src={downwardArrowIcon} alt="Downward Arrow" height={18} width={18} />
                      ) : (
                        <img src={arrowUpIcon} alt="Arrow Up" height={12} width={12} />
                      )}
                    </Button>
                  </MDBox>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    style={{
                      color: "white",
                      marginRight: 20,
                      alignSelf: "center",
                    }}
                  >
                    Update Permissions
                  </Button>
                </MDBox>
              )}
              <MDBox p={2}>
                <Grid container spacing={2}>
                  {dashboardPermission.map((module) => (
                    <Grid item xs={12} sm={6} md={4} key={module.id}>
                      <Card>
                        <MDBox p={2}>
                          <ListItem>
                            <ListItemIcon>
                              <Checkbox
                                size="small"
                                checked={module.isSelected}
                                onChange={() => handleParentSelect(module.id)}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={capitalizeFirstLetter(module.moduleName)}
                              primaryTypographyProps={{ fontSize: 13, fontWeight: "bold" }}
                            />
                            <Button onClick={() => handleParentDropdownToggle(module.id)}>
                              {module.isClosed ? (
                                <img src={arrowUpIcon} alt="Arrow Up" height={10} width={10} />
                              ) : (
                                <img
                                  src={downwardArrowIcon}
                                  alt="Downward Arrow"
                                  height={16}
                                  width={16}
                                />
                              )}
                            </Button>
                          </ListItem>
                          <Collapse in={!module.isClosed} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {module.childList?.map((child) => (
                                <ListItem key={child.id} style={{ paddingLeft: 40 }}>
                                  <ListItemIcon>
                                    <Checkbox
                                      size="small"
                                      checked={child.isSelected}
                                      onChange={() => handleChildSelect(module.id, child.id)}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={capitalizeFirstLetter(child.value)}
                                    primaryTypographyProps={{ fontSize: 13 }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Collapse>
                        </MDBox>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={() => setOpenSnackbar(false)}
                  severity={
                    submitError === "Purchase Order Created Successfully" ? "success" : "error"
                  }
                >
                  {submitError}
                </MuiAlert>
              </Snackbar>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ManagePermission;
