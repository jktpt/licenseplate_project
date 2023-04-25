import { Link } from "react-router-dom";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LogoutIcon from "@mui/icons-material/Logout";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import LockIcon from "@mui/icons-material/Lock";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import { useEffect, useState } from "react";
import Axios from "axios";
import way2p1 from "../../asset/photo/w2p1.png"

export const Sidebar = () => {
  const [roles, setRole] = useState([]);
  const [user, setUser] = useState([]);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location = "/admin";
  };

  const getRole = (roleDB) => {
    Axios.put(`${process.env.REACT_APP_HOST}/api/getrole`, { roleDB: roleDB }).then((res) => {
      setRole(res.data);
    });
  };

  const GenerateWithRole = () => {
    if(roles.role === "admin"){
      return (
        <>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <LocalParkingIcon className="icon" />
              <span>Car management</span>
            </li>
          </Link>
          <Link to="/lockslot" style={{ textDecoration: "none" }}>
            <li>
              <LockIcon className="icon" />
              <span>Slot management</span>
            </li>
          </Link>
          <p className="title">Account</p>
          <Link to="/manageaccount" style={{textDecoration: "none"}}>
              <li>
                <ManageAccountsIcon className="icon"/>
                <span>Account management</span>
              </li>
          </Link>
        
        </>
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.REACT_APP_HOST}/api/authen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        getRole(data.decoded.username);
        if (data.status === "ok") {
          // alert('authen success')
        } else {
          // alert('Please Sign in!')
          localStorage.removeItem("token");
          window.location = "/login";
        }
       
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <span className="logo">
            {/* <TimeToLeaveIcon className="icon" /> */}
            <img src={way2p1} className="img-icon" />
            {/* style={{width:"150px",height:"75px"}} */}
          </span>
          <span className="logo-text">Parking Admin System</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Main</p>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <GenerateWithRole />
          <p className="title">Logout</p>
          <Link
            to="/admin"
            style={{ textDecoration: "none" }}
            onClick={handleLogout}
          >
            <li>
              <LogoutIcon className="icon" />
              <span>Logout</span>
            </li>
          </Link>

          <p className="title">Members</p>
          <Link
            to="/member"
            style={{ textDecoration: "none" }}
          >
            <li>
              <PeopleIcon className="icon" />
              <span>Members</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};
