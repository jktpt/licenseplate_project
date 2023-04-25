import React from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import "./guardhouse.scss";
const { format, zonedTimeToUtc } = require("date-fns-tz");
var moment = require("moment-timezone");

export const Guardhouse = () => {
  const [guard, setGuard] = useState([]);
  // const guard = "";
  // const setGuard= "";
  const [loading, setLoading] = useState("0");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST}/api/guardhousefor1`)
      .then((response) => response.json())
      .then((res) => {
        setGuard(res);
      })
  }, []);

  return (
    <div className="guard-container">
      <p className="latest-car-guard">Latest car</p>
      <div className="border-guard-text-container">
        {guard.map((val, key) => {
          const dateTimeIn = moment(val.timein);
          const dateTimeOut = moment(val.timeout);
          const timeInFormating = dateTimeIn
            .tz("Asia/Bangkok")
            .format("วันที่ DD เดือน MM ปี YYYY เวลา HH:mm:ss");
          const timeOutFormating = dateTimeOut
            .tz("Asia/Bangkok")
            .format("วันที่ DD เดือน MM ปี YYYY เวลา HH:mm:ss");

          return (
            <div key={val.id} className="guard-text-container">
              <div className="guard-right">
                <img
                  src={
                    val.pl_image
                      ? require(`../../asset/upload_image/${val.pl_image}`)
                      : "wait for loading"
                  }
                  alt="car"
                  className="image-guard"
                />
              </div>
              <div className="guard-left">
                <p className="guard-text">License plate : {val.plate}</p>
                <p className="guard-text">Time in : {timeInFormating}</p>
                <p className="guard-text">
                   {val.timeout === null ? "" : "Timeout : "+timeOutFormating}
                </p>
                <p className="guard-text">{val.rates === null ? '' :"Rates : "+val.rates+" baht"} </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
