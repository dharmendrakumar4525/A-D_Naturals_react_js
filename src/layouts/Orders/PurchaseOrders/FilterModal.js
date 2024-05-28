import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";

const FilterModal = ({ open, onClose, onFilter }) => {
  const [filterType, setFilterType] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [quarter, setQuarter] = useState("");
  const [halfYear, setHalfYear] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleFilter = () => {
    if (!filterType || !year || (filterType === "quarterly" && !quarter)) {
      return;
    }

    onFilter(filterType, year, month, quarter, halfYear);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle> Apply Filter </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            autoWidth
            sx={{ height: "2.75rem", width: "200px" }}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
            <MenuItem value="halfyearly">Half Yearly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            autoWidth
            sx={{ height: "2.75rem", width: "200px" }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={2022 + i}>
                {2022 + i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {filterType === "monthly" && (
          <>
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                autoWidth
                sx={{ height: "2.75rem", width: "200px" }}
              >
                {months.map((monthName, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {monthName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {filterType === "quarterly" && (
          <>
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel>Quarter</InputLabel>
              <Select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                autoWidth
                sx={{ height: "2.75rem", width: "200px" }}
              >
                <MenuItem value={1}>Q1</MenuItem>
                <MenuItem value={2}>Q2</MenuItem>
                <MenuItem value={3}>Q3</MenuItem>
                <MenuItem value={4}>Q4</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
        {filterType === "halfyearly" && (
          <>
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel>Half Year</InputLabel>
              <Select
                value={halfYear}
                onChange={(e) => setHalfYear(e.target.value)}
                autoWidth
                sx={{ height: "2.75rem", width: "200px" }}
              >
                <MenuItem value="1">First Half</MenuItem>
                <MenuItem value="2">Second Half</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleFilter} color="primary">
          Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default FilterModal;
