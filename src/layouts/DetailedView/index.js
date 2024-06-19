// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Multi Select Box Components
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { DataGrid } from "@mui/x-data-grid";

import DetailedViewModal from "./detailedViewModal";
import { useEffect, useState } from "react";
import axios from "axios";

function detailedTable() {
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  // const [selected, setSelected] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const quarterOptions = {
    Q1: ["January", "February", "March"],
    Q2: ["April", "May", "June"],
    Q3: ["July", "August", "September"],
    Q4: ["October", "November", "December"],
  };

  const [selectedMonths, setSelectedMonths] = useState([]);
  const [visibleQuarters, setVisibleQuarters] = useState(Object.keys(quarterOptions));
  const [selectedQuarters, setSelectedQuarters] = useState([]);
  const [visibleMonths, setVisibleMonths] = useState(monthOptions);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width: 300,
    },
    indeterminateColor: {
      color: "#f50057",
    },
    selectAllText: {
      fontWeight: 500,
    },
    selectedAll: {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.08)",
      },
    },
  }));

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center",
    },
    variant: "menu",
  };

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Login_User_Role = localStorage.getItem("Login_User_Role");
        const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");
        const Login_User_Name = localStorage.getItem("Login_User_Name");

        const response = await axios.get(`http://localhost:3000/api/web/complianceDetails`);
        const data = response.data.data;

        let filteredData = [];
        if (Login_User_Role === "superadmin") {
          filteredData = data.filter((user) => user.company[0].parent_id === Login_User_OrgId);
        } else if (Login_User_Role === "user") {
          filteredData = data.filter((user) => user.user[0].name === Login_User_Name);
        }

        // Filter by selected months
        if (selectedMonths.length > 0) {
          filteredData = filteredData.filter((item) => {
            const complianceDate = new Date(item.compliance.date);
            const month = complianceDate.toLocaleString("default", { month: "long" });
            return selectedMonths.includes(month);
          });
        }

        console.log("selected value", selectedMonths);

        // Filter by selected quarters
        if (selectedQuarters.length > 0) {
          let monthsInQuarters = selectedQuarters.flatMap((quarter) => quarterOptions[quarter]);
          filteredData = filteredData.filter((item) => {
            const complianceDate = new Date(item.compliance.date);
            const month = complianceDate.toLocaleString("default", { month: "long" });
            return monthsInQuarters.includes(month);
          });
        }

        setRowData(filteredData);

        // Extract unique department options from the filtered data
        const departments = Array.from(new Set(filteredData.map((item) => item.compliance.dept)));
        setDepartmentOptions(departments);

        // Extract unique user options from the filtered data
        const users = Array.from(new Set(filteredData.map((item) => item.user[0].name)));
        setUserOptions(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch, selectedMonths, selectedQuarters]);

  const isAllDepartmentsSelected =
    departmentOptions.length > 0 && selectedDepartments.length === departmentOptions.length;

  const isAllUsersSelected = userOptions.length > 0 && selectedUsers.length === userOptions.length;

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedDepartments(
        selectedDepartments.length === departmentOptions.length ? [] : departmentOptions
      );
      return;
    }
    setSelectedDepartments(value);
  };

  const handleUserChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedUsers(selectedUsers.length === userOptions.length ? [] : userOptions);
      return;
    }
    setSelectedUsers(value);
  };

  const handleMonthChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedMonths(selectedMonths.length === monthOptions.length ? [] : monthOptions);
      return;
    }
    setSelectedMonths(value);

    // Update visible quarters based on selected months
    if (value.length > 0) {
      const quarters = Object.keys(quarterOptions).filter((quarter) =>
        quarterOptions[quarter].some((month) => value.includes(month))
      );
      setVisibleQuarters(quarters);
    } else {
      setVisibleQuarters(Object.keys(quarterOptions));
    }
  };

  const handleQuarterChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedQuarters(
        selectedQuarters.length === Object.keys(quarterOptions).length
          ? []
          : Object.keys(quarterOptions)
      );
      return;
    }
    setSelectedQuarters(value);

    // Update visible months based on selected quarters
    if (value.length > 0) {
      const months = value.flatMap((quarter) => quarterOptions[quarter]);
      setVisibleMonths(months);
    } else {
      setVisibleMonths(monthOptions);
    }
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <DetailedViewModal
            data={params.row}
            detailedId={params.row.internal}
            setIsRefetch={setIsRefetch}
          />
        );
      },
    },
    { field: "id", headerName: "id", width: 70 },
    { field: "entity", headerName: "Entity", width: 70 },
    { field: "particular", headerName: "Particular", width: 130 },
    { field: "deadline", headerName: "Deadline", width: 130 },
    { field: "dateOfCompletion", headerName: "Date Of Completion", width: 130 },
    { field: "assignedUser", headerName: "Assigned User", width: 130 },
    { field: "department", headerName: "Department", width: 130 },
    { field: "risk", headerName: "Risk", width: 130 },
  ];

  let idCounter = 1;

  const rows = rowData.map((item) => ({
    id: idCounter++,
    entity: item.company[0].name,
    particular: item.compliance.particular,
    deadline: item.compliance.date,
    dateOfCompletion: item.doc,
    assignedUser: item.user[0].name,
    department: item.compliance.dept,
    risk: item.compliance.risk,
    internal: item._id,
  }));

  useEffect(() => {
    const fetchFilteredData = async () => {
      let deptQuery = "";
      let userQuery = "";

      if (selectedDepartments.length > 0) {
        deptQuery = selectedDepartments.map((dept) => `dept=${encodeURIComponent(dept)}`).join("&");
      }

      if (selectedUsers.length > 0) {
        userQuery = selectedUsers.map((user) => `user=${encodeURIComponent(user)}`).join("&");
      }

      let queryString = "";
      if (deptQuery) queryString += deptQuery;
      if (userQuery) {
        if (queryString) queryString += "&";
        queryString += userQuery;
      }

      try {
        const Login_User_Role = localStorage.getItem("Login_User_Role");
        const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");
        const Login_User_Name = localStorage.getItem("Login_User_Name");

        const response = await axios.get(
          `http://localhost:3000/api/web/complianceDetails${queryString ? "?" + queryString : ""}`
        );
        let data = response.data.data;

        if (Login_User_Role === "superadmin") {
          data = data.filter((item) => item.company[0].parent_id === Login_User_OrgId);
        } else if (Login_User_Role === "user") {
          data = data.filter((item) => item.user[0].name === Login_User_Name);
        }

        setRowData(data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    fetchFilteredData();
  }, [selectedDepartments, selectedUsers]);

  const Login_User_Role = localStorage.getItem("Login_User_Role");

  const filteredRows = rows.filter((row) => !row.internal);
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
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  Detailed Table
                  {Login_User_Role === "superadmin" && <DetailedViewModal />}
                </MDTypography>
              </MDBox>
              <MDBox pt={1} pb={0}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="select-quarter-label">Select Quarters</InputLabel>
                  <Select
                    labelId="select-quarter-label"
                    multiple
                    value={selectedQuarters}
                    onChange={handleQuarterChange}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {visibleQuarters.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox checked={selectedQuarters.indexOf(option) > -1} />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel id="mutiple-month-select-label">Select Months</InputLabel>
                  <Select
                    labelId="mutiple-month-select-label"
                    multiple
                    value={selectedMonths}
                    onChange={handleMonthChange}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {visibleMonths.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox checked={selectedMonths.indexOf(option) > -1} />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel id="mutiple-department-select-label">Select Departments</InputLabel>
                  <Select
                    labelId="mutiple-department-select-label"
                    multiple
                    value={selectedDepartments}
                    onChange={handleDepartmentChange}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {departmentOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox checked={selectedDepartments.indexOf(option) > -1} />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="mutiple-user-select-label">Select Users</InputLabel>
                  <Select
                    labelId="mutiple-user-select-label"
                    multiple
                    value={selectedUsers}
                    onChange={handleUserChange}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {userOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox checked={selectedUsers.indexOf(option) > -1} />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MDBox>
              <MDBox pt={3}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
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

export default detailedTable;
