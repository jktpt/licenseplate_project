import React from "react";
import "./manageaccount.scss";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Navbar } from "../../components/navbar/Navbar";
import Axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export const Manageaccount = () => {
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [user_id,setUserID] = useState([]);
  const [option, setOption] = useState([]);
  const [loading, setLoading] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  function handleData(param) {
    setShow(true);
    setUserID(param.user_id)
  }

  const updateRole = (id,password) => {
    if(option){
    Axios.put(`${process.env.REACT_APP_HOST}/api/updaterole`, {
      role: option,
        id: user_id,
    }).then((response) => {
      setData(
        data.map((val) => {
            return val.user_id === id
            ? {
                id: val.user_id,
                plate: val.plate,
              }
            : val;
        })
      );
    })};
    window.location.reload();
  };

  const deleteLicensePlate = (id) => {
    Axios.delete(`${process.env.REACT_APP_HOST}/api/deleteuser/${id}`).then((response) => {
      setData(
        data.filter((val) => {
          return val.user_id !== id;
        })
      );
    });
  };

  const columns = [
    { field: "user_id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "name", headerName: "Name", width: 130 },
    {
      field: `surname`,
      headerName: "Surname",
      type: "string",
      width: 200,
    },
    {
      field: `email`,
      headerName: "Email",
      type: "string",
      width: 200,
    },
    {
      field: "role",
      headerName: "Role",
      width: 100,
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* <div className="viewButton" onClick={()=>handleData(params.row.pl_imag)}>View image</div> */}
            <button
              className="viewButton"
              onClick={() => handleData(params.row)}
            >
              Change role
            </button>
            {/* <button className="viewButton" onClick={()=>console.log(params.row.id)}>Edit</button> */}
            <div
              className="deleteButton"
              onClick={() => deleteLicensePlate(params.row.user_id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  function handleChange(event) {
    setOption(event.target.value);
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST}/api/alluser`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="datatable">
          <DataGrid
            className="datagrid"
            getRowId={(row) => row.user_id}
            rows={data}
            columns={columns}
            pageSize={14}
            rowsPerPageOptions={[14]}
            checkboxSelection
          />
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3 form-table-history"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>
                    <select
                      name="select-floor"
                      className="set-middle select-size"
                      id="select-floor-box"
                      onChange={handleChange}
                    >
                      <option value="">Choose the role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </Form.Label>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  updateRole(user_id,updateData);
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};
