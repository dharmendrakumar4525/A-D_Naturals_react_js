// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import VendorTableModal from "layouts/Master/vendors/vendorsTableModal";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "environments/environment";
import { GET_VENDOR_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";

function VendorsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (vendorId) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_VENDOR_API}/${vendorId}`);
      setRowData((prevData) => prevData.filter((vendor) => vendor._id !== vendorId));
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

    const filteredData = originalData.filter((vendor) =>
      vendor.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
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
        const vendorResponse = await axios.get(`${environment.api_path}/${GET_VENDOR_API}`);
        const vendorData = vendorResponse.data.data;

        setRowData(vendorData);
        setOriginalData(vendorData);
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
      { Header: "Contact Person", accessor: "contact_person", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((vendor) => ({
      name: <Author name={vendor.vendor_name} email={vendor.email} />,
      contact_person: <Job contactPerson={vendor.contact_person} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(vendor._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <VendorTableModal vendorId={vendor._id} setIsRefetch={setIsRefetch} />
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
                  Vendors Table
                  <VendorTableModal />
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

export default VendorsTable;

//---------------------------- Child Component---------------------------------
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

const Job = ({ contactPerson }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {contactPerson}
    </MDTypography>
  </MDBox>
);

Author.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

Job.propTypes = {
  contactPerson: PropTypes.string.isRequired,
};
