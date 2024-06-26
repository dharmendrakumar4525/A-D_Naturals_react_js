/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// @mui material components
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { environment } from "environments/environment"; // Assuming environment is a file that contains environment variables
import DeleteIcon from "@mui/icons-material/Delete";
import { GET_ROLES_API } from "environments/apiPaths";
import RolesTableModal from "layouts/UserManagement/roles/rolesTableModal";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Data() {
  // Capitalized component name
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(`http://localhost:3000/api/web/users`);
        const rolesData = rolesResponse.data;

        const superadminData = rolesData.filter((user) => user.role === "superadmin");

        setRowData(superadminData);
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

  // Define handleDelete function
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
              <RolesTableModal userId={user._id} setIsRefetch={setIsRefetch} />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };
}
