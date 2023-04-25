import React from "react";
import Axios from "axios";
import './bill.scss'
import { useEffect, useState } from "react";
const { format, zonedTimeToUtc} = require("date-fns-tz");
var moment = require('moment-timezone');


export const Bill = () => {
  const [apiPlate, getApiPlate] = useState([]);
  const [loading, setLoading] = useState("0");
  const moment = require("moment");

  var timeIn = apiPlate.timein;
  var timeOut = apiPlate.timeout;
  var dateTimeIn = moment(timeIn);
  var dateTimeOut = moment(timeOut);
  var timeInFormating = dateTimeIn
    .tz("Asia/Bangkok")
    .format("วันที่ DD เดือน MM ปี YYYY เวลา HH:mm:ss");
  var timeOutFormating = dateTimeOut
    .tz("Asia/Bangkok")
    .format("วันที่ DD เดือน MM ปี YYYY เวลา HH:mm:ss");

  var PERMITTED_DOMAIN = process.env.REACT_APP_PERMITTED_DOMAIN;
  var dataFromPHP = localStorage.getItem("plate");

  window.addEventListener("message", function (event) {
    if (event.origin === PERMITTED_DOMAIN) {
      // var msg = JSON.parse(event.data);
      // var msgKey = Object.keys(msg)[0];
      if (event.data) {
        localStorage.setItem("plate", JSON.stringify(event.data));
      } else {
        localStorage.removeItem("plate");
      }
    }
  });

  const returnHost = ()=>{
    console.log(`${process.env.REACT_APP_HOST_PHP}`);
    localStorage.removeItem("plate");
    window.location.href = `${process.env.REACT_APP_HOST_PHP}`;
  };

  const getPlate = (plate) => {
    // console.log(plate);
    Axios.put(`${process.env.REACT_APP_HOST}/api/getbill`, { plate: plate }).then(
      (response) => {
        getApiPlate(response.data[0]);
        console.log(apiPlate);
      }
    );
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST}/api/slot`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((res) => {
        getPlate(dataFromPHP.replace(/['"]+/g, ""));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="invoice-container">
      <h1 className="invoice-text-h1">Invoice</h1>
      <div className="invoice-center-container">
        <div className="invoice-flex">
          <div className="image-cover">
            <img
              src={
                apiPlate.pl_image
                  ? require(`../../asset/upload_image/${apiPlate.pl_image}`)
                  : "wait for loading"
              }
              alt="car"
              className="image-from-database"
              // style={{ width: 500, height: 300 }}
            />
          </div>
          {/* <p>{apiPlate.pl_image}</p> */}
          <div className="invoice-container-text">
            <p className="invoice-text top-invoice">Plate : {apiPlate.plate}</p>
            <p className="invoice-text">Time in : {timeInFormating} น.</p>
            <p className="invoice-text">Time out : {timeOutFormating} น.</p>
            <p className="invoice-text">Slot : {apiPlate.latest_slot}</p>
            <p className="invoice-text">Total hours : {apiPlate.hours} hours</p>
            <p className="invoice-text">Rates : {apiPlate.rates} Baht</p>
          </div>
          <div className="button-invoice">
            <button className="pay-cash" onClick={()=>{returnHost()}}>Pay</button>
            {/* <GenerateBtn data={val} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
