/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import DetailedViewModal from "./detailedViewModal";

export default function data() {
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const Login_User_OrgId = localStorage.getItem("Login_User_OrgId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailedResponse = await axios.get(`http://localhost:3000/api/web/company`);
        const detailedData = detailedResponse.data.data;

        const entityData = detailedData.filter((user) => user.parent_id === Login_User_OrgId);

        console.log("entityData", entityData);
        console.log("detailedData", detailedData);

        setRowData(entityData);

        // setRowData(detailedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  const handleDelete = async (detailedId) => {
    try {
      await axios.delete(`http://localhost:3000/api/web/company/${detailedId}`);
      setRowData((prevData) => prevData.filter((user) => user._id !== detailedId));
    } catch (error) {
      console.error(
        "Error deleting detailed:",
        error.response ? error.response.data : error.message
      );
    }
  };

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

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((detailed) => ({
      name: <Author name={detailed.name} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(detailed._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <DetailedViewModal detailedId={detailed._id} setIsRefetch={setIsRefetch} />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };
}
