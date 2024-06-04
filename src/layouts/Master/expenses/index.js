// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "environments/environment";
import { GET_EXPENSE_API } from "environments/apiPaths";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpenseTableModal from "./ExpenseTableModal";
import GhostLoader from "../../../assets/images/GhostLoader.gif";
import Loader from "../../../assets/images/Loader.gif";

function ExpenseTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isRefetch, setIsRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  const onSearch = (query) => {
    setSearchQuery(query);
  };

  //----------------------------Delete Function---------------------------------

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`${environment.api_path}/${GET_EXPENSE_API}/${expenseId}`);
      setRowData((prevData) => prevData.filter((expense) => expense._id !== expenseId));
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

    const filteredData = originalData.filter((expense) =>
      expense.expense_name.toLowerCase().includes(searchQuery.toLowerCase())
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
      setLoading(true);
      try {
        const expenseResponse = await axios.get(`${environment.api_path}/${GET_EXPENSE_API}`);
        const expenseResponseData = expenseResponse.data.data;

        setRowData(expenseResponseData);
        setOriginalData(expenseResponseData);
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
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: rowData.map((expense) => ({
      name: <Author name={expense.expense_name} />,
      action: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
              onClick={() => handleDelete(expense._id)}
              style={{ marginRight: "8px" }}
            >
              <DeleteIcon />
            </MDTypography>
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              <ExpenseTableModal expenseId={expense._id} setIsRefetch={setIsRefetch} />
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
                  Expenses Table
                  <ExpenseTableModal />
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

export default ExpenseTable;

const Author = ({ name }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  </MDBox>
);

Author.propTypes = {
  name: PropTypes.string.isRequired,
};
