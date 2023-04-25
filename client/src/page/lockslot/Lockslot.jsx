import React from "react";
import "./lockslot.scss";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Navbar } from "../../components/navbar/Navbar";
import Axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export const Lockslot = () => {
  const [slot, setSlot] = useState([]);
  const [VIPSlot, setUpdateVIPSlot] = useState([]);
  const [slot_id,setSlotID] = useState([]);
  const [loading, setLoading] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  function handleData(param) {
    setShow(true);
    // console.log(param);
    setSlotID(param);
  }

  const LockslotCheck = (params) => {
    if (params.data.row.status_slot === "Unavailable") {
      return (
        <>
          {/* <button
            className="viewButton"
            onClick={() => unlockSlot(params.data.row.slot)}
          >
            Check & Go
          </button> */}
        </>
      );
    } else if (params.data.row.status_slot === "Available") {
      return (
        <>
          <button
            className="deleteButton"
            onClick={() => lockSlot(params.data.row.slot)}
          >
            Lock slot
          </button>
          <button
            className="reservationButton"
            onClick={() => handleData(params.data.row.slot_id)}
          >
            Reservation slot
          </button>
        </>
      );
    }else if (params.data.row.status_slot === "Lock"){
      return (
        <>
          <button
            className="unlockButton"
            onClick={() => unlockSlot(params.data.row.slot)}
          >
            Unlock slot
          </button>
          <button
            className="reservationButton"
            onClick={() => handleData(params.data.row.slot_id)}
          >
            Reservation slot
          </button>
        </>
      );
    }
  };

  const vipSlot = (slots_id,vipslot) => {
    console.log(slots_id);
    Axios.put(`${process.env.REACT_APP_HOST}/api/vipslots`, {
      slots: slots_id,
      plate: vipslot
    })
    window.location.reload();
  };
  
  const unlockSlot = (slot) => {
    Axios.put(`${process.env.REACT_APP_HOST}/api/unlockslots`, {
      slots: slot,
    })
    window.location.reload();
  };

  const lockSlot = (slot) => {
    Axios.put(`${process.env.REACT_APP_HOST}/api/lockslots`, {
      slots: slot,
    })
    window.location.reload();
  };

  const columns = [
    {
      field: "slot_id",
      headerName: "ID",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "slot",
      headerName: "Slot Number",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status_slot",
      headerName: "Status slot",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: `plate`,
      headerName: "Plate",
      type: "string",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: `timein`,
      headerName: "Time in",
      type: "string",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: `vip_plate`,
      headerName: "VIP plate",
      type: "string",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <LockslotCheck data={params} />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST}/api/slot`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((res) => {
        setSlot(res);
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
            getRowId={(row) => row.slot_id}
            rows={slot}
            columns={columns}
            pageSize={14}
            rowsPerPageOptions={[14]}
            checkboxSelection
          />
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit VIP slot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3 form-table-history"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Control
                    type="licenseplate"
                    placeholder="License plate"
                    autoFocus
                    onChange={(event) => {
                      setUpdateVIPSlot(event.target.value);
                    }}
                  />
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
                  vipSlot(slot_id,VIPSlot);
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
