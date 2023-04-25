import React from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import "./animate.scss";
import "./animation_in.scss";
import "./animation_out.scss";
import "./animation_inf2.scss";
import "./animation_outf2.scss";
import barrier from "../asset/photo/barrier2.png";
import car from "../asset/photo/Frame.png";
import car_right from "../asset/photo/carright.png";
import slot_before_taken from "../asset/photo/slot_before_taken.png";
import slot_before_taken_right from "../asset/photo/slot_before_taken_right.png";
import market from "../asset/photo/market.png";

export const Animate = () => {
  const [slot, getSlot] = useState([]);
  const [set_slot, setSlot] = useState([]);
  const [apiPlate, getApiPlate] = useState([]);
  const [loading, setLoading] = useState("0");
  const [option, setOption] = useState([]);

  // แก้ไขโดเมนสำหรับ Web application
  // Domain permission
  var PERMITTED_DOMAIN = process.env.REACT_APP_PERMITTED_DOMAIN;
  var dataFromPHP = localStorage.getItem("plate");
  var count = 0;

  // get message from index.php file
  window.addEventListener("message", function (event) {
    if (event.origin === PERMITTED_DOMAIN) {
      if (event.data) {
        localStorage.setItem("plate", JSON.stringify(event.data));
      } else {
        localStorage.removeItem("plate");
      }
    }
  });

  // getPlate from put method ดึงค่าจาก dataFromPHP มาส่งไปยัง nodejs เพื่อเก็บค่า getlatest
  const getPlate = (plate) => {
    Axios.put(`${process.env.REACT_APP_HOST}/api/getlatest`, {
      plate: plate,
    }).then((response) => {
      getApiPlate(response.data[0]);
    });
  };

  // checkOutSlot เช็คเอ้าท์
  const checkOutSlot = (slot) => {
    console.log(slot);
    let plateAPI = apiPlate.id;
    if (
      apiPlate.timeout === null &&
      apiPlate.id === plateAPI &&
      apiPlate.latest_slot === slot
    ) {
      Axios.put(`${process.env.REACT_APP_HOST}/api/checkoutslot`, {
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
    } else if (apiPlate.latest_slot !== slot) {
      alert("Error -> didn't your slot. please select your slot to checkout");
    } else {
      alert(
        "Error -> You have already checkout \nIf you haven't yet, please contact the staff"
      );
    }
  };

  // Check in slot
  const updateSlot = (slot, vip) => {
    let plateAPI = apiPlate.id;
    if (
      Boolean(vip !== apiPlate.plate) &&
      apiPlate.latest_slot === null &&
      apiPlate.timein === null
    ) {
      Axios.put(`${process.env.REACT_APP_HOST}/api/checkinslot`, {
        slot: slot,
        plateAPI: plateAPI,
      }).then((response) => {});
    } else if (vip !== "-") {
      alert("Error -> Please select your reservation slot");
    } else {
      alert(
        "Error -> You have already checkin \nIf you haven't yet, please contact the staff"
      );
    }
  };

  // Check in VIP
  const updateSlotVIP = (slot, vip) => {
    let plateAPI = apiPlate.id;
    console.log(Boolean(vip !== apiPlate.plate));
    if (
      vip === apiPlate.plate &&
      apiPlate.latest_slot === null &&
      apiPlate.timein === null
    ) {
      Axios.put(`${process.env.REACT_APP_HOST}/api/checkinslot`, {
        slot: slot,
        plateAPI: plateAPI,
      }).then((response) => {});
    } else {
      alert(
        "Error -> You have already checkin \nIf you haven't yet, please contact the staff"
      );
    }
  };

  // เรียก animation checkin
  function animation_checkin(slot_number) {
    if (!apiPlate.timein) {
      document.getElementById("barrier-left-in-animation").className =
        "animation-barrier-left-up";
      setTimeout(() => {
        document.getElementById(
          "car-to-park"
        ).className = `start-animation-car-${slot_number}`;
      }, 1500);
      setTimeout(() => {
        document
          .getElementById("barrier-left-in-animation")
          .classList.remove("animation-barrier-left-up");
        document.getElementById("barrier-left-in-animation").className =
          "animation-barrier-left-down";
      }, 5000);
      setTimeout(() => {
        window.location.reload(false);
      }, 12000);
    }
  }

  // Return slot to website
  const CheckLastSlot = () => {
    if (option === "F2") {
      document
        .getElementById("last-child")
        .classList.remove("animate-container-row");
      return <img src={market} alt="" className="market-photo-image" />;
    } else if (option === "F1") {
      document
        .getElementById("last-child")
        .classList.add("animate-container-row");
      return slot.map((val, key) => {
        let str = val.slot;
        let numStr = str.slice(2, 4);
        let num = parseInt(numStr, 10);
        if (option === "F1" && num > 24 && num <= 32) {
          return <GenerateBtn key={val.slot_id} data={val} />;
        }
      });
    }
  };

  // animation checkout
  function animation_checkout(slot_number) {
    if (apiPlate.latest_slot === slot_number) {
      document
        .getElementById("car-to-park")
        .classList.remove(`start-animation-car-${slot_number}`);
      document.getElementById(
        `car-in-parking-slot-${slot_number}`
      ).className = `upper-slot out-animation-car-${slot_number}`;

      setTimeout(() => {
        window.location.href = `${process.env.REACT_APP_HOST_REACT}/bill`;
      }, 8000);
    }
  }

  // Return left slot of website
  function LeftBtn(props) {
    if (props.val.data.status_slot === "Available") {
      return (
        <div className="slot-before-taken-container">
          <img
            src={slot_before_taken}
            className="image-size-slot"
            alt="slot_before_taken"
          />
          <button
            className="btn-slot-before-taken"
            onClick={() => {
              console.log(props.val.data.slot);
              updateSlot(props.val.data.slot, props.val.data.vip_plate);
              animation_checkin(props.val.data.slot);
            }}
          ></button>
        </div>
      );
    } else if (props.val.data.status_slot === "Unavailable") {
      return (
        <div className="slot-before-taken-container">
          <img
            src={slot_before_taken}
            className="image-size-slot"
            alt="slot_before_taken"
          />
          <img
            src={car}
            id={`car-in-parking-slot-${props.val.data.slot}`}
            className="car-in-parking-slot"
            onClick={() => {
              console.log(props.val.data.slot);
              checkOutSlot(props.val.data.slot);
              animation_checkout(props.val.data.slot);
            }}
          />
        </div>
      );
    } else if (props.val.data.status_slot === "Lock") {
      if (props.val.data.vip_plate === apiPlate.plate) {
        let text = `You have a reservation slot.\nYour reservation slot is ${props.val.data.slot}\nDo you want to check in right now?`;
          return (
            <div className="slot-before-taken-container">
              <img
                src={slot_before_taken}
                className="image-size-slot"
                alt="slot_before_taken"
              />
              <button
                className="btn-slot-before-taken-lock"
                onClick={() => {
                  // console.log(props.val.data.slot);
                  updateSlotVIP(props.val.data.slot, props.val.data.vip_plate);
                  animation_checkin(props.val.data.slot);
                }}
              >
                Your Reservation
              </button>
            </div>
          );
      } else {
        return (
          <div className="slot-before-taken-container">
            <img
              src={slot_before_taken}
              className="image-size-slot"
              alt="slot_before_taken"
            />
            <LockIcon
              className="icon-on-btn"
              style={{
                width: "120px",
                color: "red",
                height: "60px",
                position: "relative",
                left: "30px",
                top: "-70px",
              }}
            />
          </div>
        );
      }
    }
  }

  // Return right slot
  function RightBtn(props) {
    if (props.val.data.status_slot === "Available") {
      return (
        <div className="slot-before-taken-container">
          <img
            src={slot_before_taken_right}
            className="image-size-slot"
            alt="slot_before_taken"
          />
          <button
            className="btn-slot-before-taken"
            onClick={() => {
              console.log(props.val.data.slot);
              updateSlot(props.val.data.slot, props.val.data.vip_plate);
              animation_checkin(props.val.data.slot);
            }}
          ></button>
        </div>
      );
    } else if (props.val.data.status_slot === "Unavailable") {
      return (
        <div className="slot-before-taken-container ">
          <img
            src={slot_before_taken_right}
            className="image-size-slot"
            alt="slot_before_taken"
          />
          <img
            src={car_right}
            id={`car-in-parking-slot-${props.val.data.slot}`}
            className={`car-in-parking-slot-right your-car`}
            onClick={() => {
              console.log(props.val.data.slot);
              checkOutSlot(props.val.data.slot);
              animation_checkout(props.val.data.slot);
            }}
          ></img>
        </div>
      );
    } else if (props.val.data.status_slot === "Lock") {
      if (props.val.data.vip_plate === apiPlate.plate) {
        let text = `You have a reservation slot.\nYour reservation slot is ${props.val.data.slot}\nDo you want to check in right now?`;
          return (
            <div className="slot-before-taken-container">
              <img
                src={slot_before_taken_right}
                className="image-size-slot"
                alt="slot_before_taken"
              />
              <button
                className="btn-slot-before-taken"
                onClick={() => {
                  console.log(props.val.data.slot);
                  updateSlotVIP(props.val.data.slot, props.val.data.vip_plate);
                  animation_checkin(props.val.data.slot);
                }}
              ></button>
            </div>
          );  
      } else {
        return (
          <div className="slot-before-taken-container">
            <img
              src={slot_before_taken_right}
              className="image-size-slot"
              alt="slot_before_taken"
            />
            <LockIcon
              onClick={() => alert("This slot is locked!")}
              style={{
                width: "120px",
                color: "red",
                height: "60px",
                position: "relative",
                right: "-30px",
                top: "-70px",
              }}
            />
          </div>
        );
      }
    }
  }

  // สร้างปุ่มซ้ายและขวาทุกๆ 4 แล้วจะสลับฝั่ง
  function GenerateBtn(props) {
    // console.log(props);
    let str = props.data.slot;
    let numStr = str.slice(2, 4);
    let num = parseInt(numStr, 10);
    switch (num <= 32) {
      case num <= 4:
        return <LeftBtn val={props} />;
      case num <= 8:
        return <RightBtn val={props} />;
      case num <= 12:
        return <LeftBtn val={props} />;
      case num <= 16:
        return <RightBtn val={props} />;
      case num <= 20:
        return <LeftBtn val={props} />;
      case num <= 24:
        return <RightBtn val={props} />;
      case num <= 28:
        return <LeftBtn val={props} />;
      case num <= 32:
        return <RightBtn val={props} />;
    }
  }

  // สร้างปุ่มตามค่าที่อยู่ในตัวแปร option
  function GenerateProps() {
    if (option.length === 2) {
      return (
        <>
          <div id="car-in-animation" className="absolute-scss">
            <img
              src={car}
              id="car-to-park"
              className="car-animation-from-parking car-size"
              alt=""
            />
          </div>
          <div
            id="barrier-left-in-animation"
            className="absolute-scss photo-left-barrier "
          >
            <img
              src={barrier}
              alt=""
              id="panel-top"
              className="image-barrier-top "
            />
          </div>
          <div
            id="barrier-right-in-animation"
            className="absolute-scss photo-right-barrier"
          >
            <img
              src={barrier}
              alt=""
              id="panel-top"
              className="image-barrier-top "
            />
          </div>
        </>
      );
    }
  }

  // เมื่อมีการเปลี่ยนค่าของการเลือกชั้นจะมีการ handle ค่าของ option ที่นี่
  function handleChange(event) {
    setOption(event.target.value);
  }

  // ดึงค่า api slot
  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST}/api/slot`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((res) => {
        // รับค่าจาก index.php มาเก็บที่ plate
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

  return (
    <div className="test-checkinout">
      <div className="floor-selection">
        <select
          name="select-floor"
          className="set-middle"
          id="select-floor-box"
          onChange={handleChange}
        >
          <option value="">Choose the floor</option>
          <option value="F1">Floor 1</option>
          <option value="F2">Floor 2</option>
        </select>
      </div>
      <GenerateProps />
      <div className="container-animate">
        <div className="container-in-animate">
          <div className="animate-container-row">
            {slot.map((val, key) => {
              let str = val.slot;
              let numStr = str.slice(2, 4);
              let num = parseInt(numStr, 10);
              if (option === val.slot.slice(0, 2) && num <= 8) {
                return <GenerateBtn key={val.slot_id} data={val} />;
              }
            })}
          </div>
        </div>
        <div className="container-in-animate">
          <div className="animate-container-row">
            {slot.map((val, key) => {
              let str = val.slot;
              //   console.log(val);
              let numStr = str.slice(2, 4);
              let num = parseInt(numStr, 10);
              if (option === val.slot.slice(0, 2) && num > 8 && num <= 16) {
                return <GenerateBtn key={val.slot_id} data={val} />;
              }
            })}
          </div>
        </div>
        <div className="container-in-animate">
          <div className="animate-container-row">
            {slot.map((val, key) => {
              let str = val.slot;
              let numStr = str.slice(2, 4);
              let num = parseInt(numStr, 10);
              if (option === val.slot.slice(0, 2) && num > 16 && num <= 24) {
                return <GenerateBtn key={val.slot_id} data={val} />;
              }
            })}
          </div>
        </div>

        <div className="container-in-animate">
          <div className="animate-container-row" id="last-child">
            <CheckLastSlot />
          </div>
        </div>
      </div>
    </div>
  );
};
