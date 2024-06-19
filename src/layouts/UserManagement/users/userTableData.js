/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { environment } from "environments/environment";
import { GET_USERS_API, GET_ROLES_API, POST_USER_DELETE_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import UserTableModal from "layouts/UserManagement/users/userTableModal";

export default function data() {
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const usersData = usersResponse.data;

        const orgUserData = usersData.filter((user) => user.role === "user");
        const normalUserData = orgUserData.filter((user) => user.org_id === Login_User_OrgId);

        setRowData(normalUserData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  const Author = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/web/users/${userId}`);
      setRowData((prevData) => prevData.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((user) => ({
      name: <Author name={user.name} email={user.email} />,
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
              <UserTableModal userId={user._id} setIsRefetch={setIsRefetch} />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };
}
