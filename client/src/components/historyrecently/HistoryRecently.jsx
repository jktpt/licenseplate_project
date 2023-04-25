import * as React from "react";
import "./historyrecently.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Axios from "axios";
const { format, zonedTimeToUtc } = require("date-fns-tz");

export const Historyrecently = () => {
  const moment = require("moment");
  const [data, setData] = useState([]);
  const [historyOfData, setHistoryOfData] = useState([]);

  // get latest data of licenseplate 
  const getHistoryData = (plate) => {
    Axios.get(`${process.env.REACT_APP_HOST}/api/getplatedatalatest`).then((response) => {
      setHistoryOfData(response.data);
    });
  };


  // get top 4 latest car
  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST}/api/guardhouse`)
      .then((response) => {
        if (response.ok) {
          getHistoryData();
          return response.json();
        }
        throw response;
      }).then((res)=>{setData(res);})
      .catch((err) => {
        console.log(err);
      })
  }, []);


  // Create data to use for history recently
  function createData(
    licensePlate,
    latest_slot,
    timeIn,
    timeOut,
    rates,
    totaltime
  ) {
    return {
      licensePlate,
      latest_slot,
      timeIn,
      timeOut,
      totaltime,
      history: [
        {
          date: timeIn,
          latest: latest_slot,
          totaltimein: totaltime,
          amount: rates,
        },
      ],
    };
  }

  function Row(props) {
    const { row } = props;
    // set open pop-up
    const [open, setOpen] = useState(false);
    var limitHistory = 0;

    return (

      // Material UI to generate history table
      <React.Fragment>
        <TableRow key={row.id} sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell />
          <TableCell component="th" scope="row" className="tableCell">
            {row.licensePlate}
          </TableCell>
          <TableCell align="right" className="tableCell">
            {row.latest_slot}
          </TableCell>
          <TableCell align="right" className="tableCell">
            {row.timeIn}
          </TableCell>
          <TableCell align="right" className="tableCell">
            {row.timeOut}
          </TableCell>
          <TableCell className="tableCell">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open);
              }}
              className="tableCell"
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon/>}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={6}
            className="tableCell"
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell className="tableCell">Date (Latest)</TableCell>
                      <TableCell className="tableCell">Slot Number</TableCell>
                      <TableCell align="right" className="tableCell">
                        Total time in (HR)
                      </TableCell>
                      <TableCell align="right" className="tableCell">
                        Total price (THB)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyOfData.map((val)=>{
                      const dateTimeIn = moment(val.timein);
                      const dateTimeOut = moment(val.timeout);
                      const timeInFormating = dateTimeIn
                      .tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:ss')
                      // Map from historyOfData you can check with console.log(historyOfData) without map function to check this data
                      // row.licenseplate will return a licenseplate 
                      if(row.licensePlate === val.plate){
                        limitHistory+=1
                        if(limitHistory<=3){
                          return (
                            <TableRow key={val.id}>
                             <TableCell component="th" scope="row" className="tableCell">{timeInFormating}</TableCell>
                             <TableCell component="th" scope="row" className="tableCell">{val.latest_slot}</TableCell>
                             <TableCell component="th" scope="row" className="tableCell"> {val.rates/10}</TableCell>
                              <TableCell component="th" scope="row" className="tableCell">{val.rates}</TableCell>
                            </TableRow>
                           )
                        }
                      }else{
                        limitHistory=0;
                      }
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      latest_slot: PropTypes.string.isRequired,
      licensePlate: PropTypes.string.isRequired,
      timeIn: PropTypes.string.isRequired,
      timeOut: PropTypes.string.isRequired,
      totaltime: PropTypes.string.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          latest: PropTypes.string.isRequired,
          totaltimein: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
        })
      ).isRequired,
    }).isRequired,
  };

  const rows = [];

  for (var i in data) {
    var formatTime = moment(data[i].timeout)
    .tz("Asia/Bangkok").format('YYYY-MM-DD HH:mm:ss')
    formatTime == "Invalid date"
      ? (formatTime = "-")
      : (formatTime = moment(data[i].timeout)
          .tz("Asia/Bangkok")
          .format("YYYY-MM-DD HH:mm:ss"));
    rows.push(
      createData(
        data[i].plate,
        data[i].latest_slot,
        moment(data[i].timein).tz("Asia/Bangkok")
        .format("DD-MM-YYYY HH:mm:ss"),
        formatTime,
        data[i].rates,
        data[i].totaltimein,
        data[i].totalprice
      )
    );
  }

  return (
    <TableContainer component={Paper} className="table">
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className="tableCell">License Plate</TableCell>
            <TableCell align="right" className="tableCell">
              Slot number
            </TableCell>
            <TableCell align="right" className="tableCell">
              Time in
            </TableCell>
            <TableCell align="right" className="tableCell">
              Time out
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row row={row} key={row.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
