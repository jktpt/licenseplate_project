import React from "react";
import car from "../asset/photo/Frame.png";
import slot_png from "../asset/photo/slot.png";
import barrier from "../asset/photo/barrier.png";
// import "./animation.scss";
import Axios from "axios";
import { useEffect, useState } from "react";

export const Animation_checkin = () => {
  const [slot, getSlot] = useState([]);
  const [set_slot, setSlot] = useState([]);
  const [apiPlate, getApiPlate] = useState([]);
  const [loading, setLoading] = useState("0");
  const [option, setOption] = useState([]);
  var count = 0;

  var PERMITTED_DOMAIN = "http://localhost";
  var dataFromPHP = localStorage.getItem("plate");
  var slotNumber;

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

  useEffect(() => {
    fetch("http://localhost:3001/slot")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((res) => {
        getPlate(dataFromPHP.replace(/['"]+/g, ""));
        getSlot(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getPlate = (plate) => {
    // console.log(plate);
    Axios.put("http://localhost:3001/getlatest", { plate: plate }).then(
      (response) => {
        getApiPlate(response.data[0]);
      }
    );
  };

  function ani(props) {
    let plateAPI = apiPlate.id;
    if (apiPlate.latest_slot === null && apiPlate.id === plateAPI) {
      if (count === 1) {
        deleteSlot(props.slot);
        // anio();
        count += 1;
        console.log(count);
      } else if (count === 2) {
        check_o();
        count+=1;
        console.log(count);
      } else if (count === 0) {
        // console.log(props.slot);
        updateSlot(props.slot);
        // aniin();
        count += 1;
        console.log(count);
      }
    } else {
      const confirm_box = window.confirm(
        "Error -> You have already checkin or checkout \nIf you haven't yet, please contact the staff\n\nIf you have already, please press the yes button to make payment"
      );
      if (confirm_box === true) {
        go_bill();
      }
    }
  }

  const GenerateCar = (props) => {
      return (
        <img src={car} key={props.data.slot_id} alt="" id="set-animation"/>
      );
   
  };

  const updateSlot = (slot) => {
    // console.log(slot);
    let plateAPI = apiPlate.id;
    // console.log(plateAPI);
    if (apiPlate.latest_slot === null && apiPlate.id === plateAPI) {
      aniin();
      Axios.put("http://localhost:3001/checkinslot", {
        slot: slot,
        plateAPI: plateAPI,
      }).then((response) => {
        setSlot(
          set_slot.map((val) => {
            return val.slot === slot
              ? {
                  slot: val.slot,
                }
              : val;
          })
        );
      });
    } else {
      alert(
        "Error -> You have already checkin \nIf you haven't yet, please contact the staff"
      );
    }
  };

  const deleteSlot = (slot) => {
    // console.log(slot);
    let plateAPI = apiPlate.id;
    if (apiPlate.latest_slot === null && apiPlate.id === plateAPI) {
      anio();
      Axios.put("http://localhost:3001/checkoutslot", {
        slot: slot,
        plateAPI: plateAPI,
      }).then((response) => {
        setSlot(
          set_slot.map((val) => {
            console.log("This is val" + JSON.stringify(val.slot));
            return val.slot === slot
              ? {
                  slot: val.slot,
                }
              : val;
          })
        );
      });
    } else {
      alert(
        "Error -> You have already checkout \nIf you haven't yet, please contact the staff"
      );
    }
  };

  function aniin() {
    console.log("ani in jaa");
    document.getElementById("panel-top").className = "start-animation-barrier-top";
    setTimeout(() => {
      document.getElementById("set-animation").className ="start-animation-car";
    }, 2000);
    setTimeout(()=>{
      document.getElementById("panel-top").className = "out-animation-barrier-top"
    },3000)
  }

  function anio() {
    console.log('ani out jaa');
    document.getElementById("set-animation").classList.remove("start-animation-car");
    document.getElementById("set-animation").className = "out-animation-car";
    setTimeout(check_o, 4000);
  }

  function check_o() {
    let div = document.querySelector("#set-animation");
    document.getElementById("panel-bottom").className = "start-animation-barrier-bottom";
    if(count != 0 ){
      // count = 0;
    }
    setTimeout(()=>{
      div.classList.remove("out-animation-car");
      document.getElementById("set-animation").className = "check-out-animation-car";
    },2000)
    setTimeout(()=>{
      document.getElementById("panel-bottom").classList.remove("start-animation-barrier-bottom");
      document.getElementById("panel-bottom").className = "out-animation-barrier-bottom";
    },4000)
    setTimeout(go_bill, 6500);
  }

  function go_bill() {
    document.location.href = "http://localhost:3000/bill";
  }

  return (
    <div className="swap">
      {slot.map((val, key) => {
        return (
          <div
            id="target"
            onClick={() => {
              ani(val);
            }}
          >
            <GenerateCar data={val} />
          </div>
        );
      })}
      <div className="car1">
        <div id="barrier">
          <img src={slot_png} className="image-slot" alt="" />
        </div>
        <div id="panel">
          <img
            src={barrier}
            alt=""
            id="panel-top"
            className="image-barrier-top "
          />
        </div>
        <div id="panel">
          <img
            src={barrier}
            alt=""
            id="panel-bottom"
            className="image-barrier-bottom"
          />
        </div>
      </div>
    </div>
  );
};
