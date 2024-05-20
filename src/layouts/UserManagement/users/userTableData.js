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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${environment.api_path}/${GET_USERS_API}`);
        const usersData = usersResponse.data;

        const rolesResponse = await axios.get(`${environment.api_path}/${GET_ROLES_API}`);
        const rolesData = rolesResponse.data;

        const mappedData = usersData.map((user) => {
          const role = rolesData.find((role) => role._id === user.role);
          return {
            ...user,
            role: role ? role.role : "Unknown Role",
          };
        });

        setRowData(mappedData);
        console.log("mappecccdata", mappedData);
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

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${environment.api_path}/${POST_USER_DELETE_API}/${userId}`);
      setRowData((prevData) => prevData.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Role", accessor: "role", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((user) => ({
      name: <Author name={user.name} email={user.email} />,
      role: <Job title={user.role} />,
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
