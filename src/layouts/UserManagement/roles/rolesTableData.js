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

export default function data() {
  // Capitalized component name

  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(`${environment.api_path}/${GET_ROLES_API}`);
        const rolesData = rolesResponse.data;
        console.log("Role Data", rolesData);
        setRowData(rolesData);
        setOriginalData(rolesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const Role = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left" key={title}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  // Define handleDelete function
  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`http://localhost:3000/api/web/roles/${roleId}`);
      setRowData((prevData) => prevData.filter((role) => role._id !== roleId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return {
    columns: [
      { Header: "Role", accessor: "role", width: "30%", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: rowData.map((user) => ({
      role: <Role title={user.role} />,
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
