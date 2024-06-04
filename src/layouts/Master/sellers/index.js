// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import SellerTableModal from "layouts/Master/sellers/sellersTableModal";

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
import Loader from "../../../assets/images/Loader.gif";

function SellersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (sellerId) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_SELLER_API}/${sellerId}`);
      setRowData((prevData) => prevData.filter((seller) => seller._id !== sellerId));
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

    const filteredData = originalData.filter((seller) =>
      seller.seller_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(filteredData, "here");

    setRowData(filteredData);
  };

  useEffect(() => {
    filterData();
  }, [searchQuery]);

  //----------------------------Fetch Function---------------------------------

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const sellerResponse = await axios.get(`${environment.api_path}/${GET_SELLER_API}`);
        const sellerData = sellerResponse.data.data;

        const warehouseResponse = await axios.get(`${environment.api_path}/${GET_WAREHOUSE_API}`);
        const warehouseData = warehouseResponse.data.data;

        const locationResponse = await axios.get(`${environment.api_path}/${GET_LOCATION_API}`);
        const locationData = locationResponse.data.data;

        const mappedData = sellerData.map((seller) => {
          // const sellerLocation = locationData.find((location) => {
          //   return location._id === seller.seller_location;
          // });

          const warehouse = warehouseData.find((warehouse) => {
            return warehouse._id === seller.warehouse;
          });

          // let seller_location;
          // if (sellerLocation && sellerLocation.location_name) {
          //   seller_location = sellerLocation.location_name;
          // } else {
          //   seller_location = "Not Known";
          // }

          return {
            ...seller,
            warehouse_name: warehouse ? warehouse.warehouse_name : "Not Known",
            // seller_location: seller_location,
          };
        });

        setRowData(mappedData);
        setOriginalData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isRefetch]);

  //----------------------------Row Data---------------------------------
  const data = {
    columns: [
      { Header: "Name", accessor: "name", width: "45%", align: "left" },
      { Header: "Warehouse Location", accessor: "warehouse_location", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((seller) => ({
      name: <Author name={seller.seller_name} loaction={seller.seller_location} />,
      warehouse_location: <Job warehouseName={seller.warehouse_name} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(seller._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <SellerTableModal sellerId={seller._id} setIsRefetch={setIsRefetch} />
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
                  Sellers Table
                  <SellerTableModal />
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <MDBox mx="auto" my="auto" style={{ textAlign: "center", paddingBottom: 50 }}>
                    <img src={Loader} alt="loading..." />
                    <MDTypography sx={{ fontSize: 12 }}>Please Wait....</MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: data.columns, rows: data.rows }}
                    isSorted={false}
                    entriesPerPage={{ defaultValue: 10, entries: [10, 15, 20, 25] }}
                    showTotalEntries={true}
                    noEndBorder
                    pagination={{ variant: "contained", color: "info" }}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SellersTable;

//----------------------------Roles Component---------------------------------
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

const Job = ({ warehouseName }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {warehouseName}
    </MDTypography>
  </MDBox>
);

Author.propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

Job.propTypes = {
  warehouseName: PropTypes.string.isRequired,
};
