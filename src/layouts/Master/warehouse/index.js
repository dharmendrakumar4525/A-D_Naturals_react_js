// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import WarehouseTableModal from "layouts/Master/warehouse/warehouseTableModal";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "environments/environment";
import { GET_SELLER_API, GET_WAREHOUSE_API, GET_LOCATION_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";

function WarehouseTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (warehouseId) => {
    try {
      await axios.delete(`${environment.api_path}/warehouse/${warehouseId}`);
      setRowData((prevData) => prevData.filter((warehouse) => warehouse._id !== warehouseId));
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  //----------------------------Filter Function ---------------------------------

  const filterData = () => {
    console.log(searchQuery, "Here");
    if (!searchQuery) {
      setRowData(originalData);
      return;
    }

    const filteredData = originalData.filter((warehouse) =>
      warehouse.warehouse_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(filteredData, "here");

    setRowData(filteredData);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery]);

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;

        const locationResponse = await axios.get(`${environment.api_path}/${GET_LOCATION_API}`);
        const locationData = locationResponse.data.data;

        const mappedData = warehouseData.map((warehouse) => {
          const x = locationData.find((it) => {
            return it._id == warehouse.location;
          });
          return {
            ...warehouse,
            location: x.location_name,
          };
        });

        setRowData(mappedData);
        setOriginalData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isRefetch]);

  //----------------------------Row Data---------------------------------
  const data = {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((warehouse) => ({
      name: <Author name={warehouse.warehouse_name} location={warehouse.location} />,
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
  //----------------------------Main Component---------------------------------

  return (
    <DashboardLayout>
      <DashboardNavbar onSearch={onSearch} />
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
                  Warehouse Table
                  <WarehouseTableModal />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: data.columns, rows: data.rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
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

export default WarehouseTable;

//----------------------------Author Component---------------------------------
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

Author.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};
