/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { environment } from "environments/environment";
import { GET_SELLER_API, GET_WAREHOUSE_API, GET_LOCATION_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseTableModal from "layouts/Master/warehouse/warehouseTableModal";

export default function data() {
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get(`http://localhost:3000/api/web/company`);
        const warehouseData = warehouseResponse.data.data;

        const companyData = warehouseData.filter((user) => user.parent_id === null);
        setRowData(companyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  const handleDelete = async (warehouseId) => {
    try {
      await axios.delete(`http://localhost:3000/api/web/company/${warehouseId}`);
      setRowData((prevData) => prevData.filter((user) => user._id !== warehouseId));
    } catch (error) {
      console.error("Error deleting vendor:", error.response ? error.response.data : error.message);
    }
  };

  const Author = ({ name, location }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{location}</MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((warehouse) => ({
      name: <Author name={warehouse.name} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(warehouse._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <WarehouseTableModal warehouseId={warehouse._id} setIsRefetch={setIsRefetch} />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };
}
