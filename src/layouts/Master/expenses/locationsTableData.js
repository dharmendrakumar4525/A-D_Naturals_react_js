/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useState, useEffect } from "react";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { environment } from "environments/environment";
import { GET_VENDOR_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import VendorTableModal from "layouts/Master/vendors/vendorsTableModal";
import LocationsTableModal from "layouts/Master/locations/locationsTableModal";

export default function data() {
  const [rowData, setRowData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await axios.get(`${environment.api_path}/location`);
        const locationData = locationResponse.data.data;

        // const warehouseResponse = await axios.get(`${environment.api_path}/warehouse`);
        // const warehouseData = warehouseResponse.data.data;
        // console.log("warehouseData", warehouseData);

        // const mappedData = locationData.map((location) => {
        //   const warehouse = warehouseData.find(
        //     (warehouse) => warehouse[0]._id === location.warehouse[0]
        //   );
        //   console.log("warehouse._id", warehouseData[0]._id);
        //   console.log("location.warehouse", location.warehouse[0]);
        //   return {
        //     ...location,
        //     warehouse: warehouse ? warehouse.warehouse : "Unknown",
        //   };
        // });
        // console.log("mappedData", mappedData);

        setRowData(locationData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  const handleDelete = async (vendorId) => {
    try {
      await axios.delete(`${environment.api_path}/location/${vendorId}`);
      setRowData((prevData) => prevData.filter((vendor) => vendor._id !== vendorId));
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  const Author = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((location) => ({
      name: <Author name={location.location_name} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(location._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <LocationsTableModal locationId={location._id} setIsRefetch={setIsRefetch} />
            </MDTypography>
          </div>
        </>
      ),
    })),
  };
}
