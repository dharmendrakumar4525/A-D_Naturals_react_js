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
        const locationResponse = await axios.get(`http://localhost:3000/api/web/compliance`);
        const locationData = locationResponse.data.data;

        setRowData(locationData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [isRefetch]);

  // const handleDelete = async (vendorId) => {
  //   try {
  //     await axios.delete(`localhost:3000/api/web/compliance/${vendorId}`, {
  //       params: {
  //         delete: true,
  //       },
  //     });
  //     setRowData((prevData) => prevData.filter((user) => user._id !== vendorId));
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   }
  // };

  const handleDelete = async (vendorId) => {
    try {
      await axios.put(`http://localhost:3000/api/web/compliance/${vendorId}`, {
        deleted: true,
      });
      setRowData((prevData) => prevData.filter((user) => user._id !== vendorId));
    } catch (error) {
      console.error("Error deleting vendor:", error.response ? error.response.data : error.message);
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

  const Job = ({ particular }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {particular}
      </MDTypography>
    </MDBox>
  );

  const Risk = ({ risk }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {risk}
      </MDTypography>
    </MDBox>
  );

  const Date = ({ date }) => (
    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      {date}
    </MDTypography>
  );

  return {
    columns: [
      { Header: "Department", accessor: "name", width: "45%", align: "left" },
      { Header: "Particular", accessor: "particular", align: "left" },
      { Header: "Date", accessor: "date", align: "left" },
      { Header: "Risk", accessor: "risk", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((location) => ({
      name: <Author name={location.dept} />,
      particular: <Job particular={location.particular} />,
      date: <Date date={location.date.split("T")[0]} />,
      risk: <Risk risk={location.risk} />,
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
