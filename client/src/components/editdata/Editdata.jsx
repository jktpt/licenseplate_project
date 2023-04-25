import "./editdata.scss"
import Axios from 'axios'
import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useEffect,useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
var moment = require("moment-timezone");
var idFromTable = 0;
var imageFromTable = ""

export const Editdata = () => {
  const [data, setData] = useState([])
  const [updateData, setUpdateData] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);


  // handle edit button
  function handleData(param){
    setShow(true)
    idFromTable = param.id
    imageFromTable = param.pl_image
  }


  // Update new plate from licenseplate
  const updateLicensePlate = (id)=>{
    Axios.put(`${process.env.REACT_APP_HOST}/api/updatelicensecar`,{plate:updateData,id:idFromTable}).then((response)=>{
    setData(
        data.map((val)=>{
          // console.log("This is val"+ JSON.stringify(val.id))
          return val.id === id ? {
            id:val.id,
            plate:val.plate
          } : val;
        })
      )
    })
    window.location.reload()
  }


  // Set JSON data
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'plate', headerName: 'License Plate', width: 130 },
    { field: 'latest_slot', headerName: 'Slot', width: 130 },
    {
      field: `timein`,
      headerName: 'Time In',
      type: 'string',
      width: 200,
      // valueGetter: (params) => console.log(params) //moment(params.row.timein[0]).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
    },
    {
      field: `timeout`,
      headerName: 'Time Out',
      type:'string',
      width: 200,
      // valueGetter: (params) => moment(params.row.timeout[0]).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
    },{
      field:"totaltimein",
      headerName:"Total Time",
      width:100
    },{
      field:`totalprice`,
      headerName:"Total Price",
      width:110
    },{
      field:"status",
      headerName: "Status",
      width: 160,
      renderCell:(params)=>{
        return (
          <div className={`cellWithStatus ${params.row.status}`}>{params.row.status}</div>

        )
      }
    },{
      field:"action",
      headerName:"Action",
      width:200,
      renderCell:(params)=>{
        return (
          <div className="cellAction">
            <button className="viewButton" onClick={()=>handleData(params.row)}>Edit</button>
          </div>
        )
      }
    }
  ];  
  

  // get license car 
  useEffect(()=>{
    fetch(`${process.env.REACT_APP_HOST}/api/getlicensecar`).then(response=>{
      if(response.ok){
        return response.json()
      }
      throw response;
    }).then(res=>{
      setData(res);
    }).catch(err =>{
      console.log(err)
    })
  },[])

  return (
    <div className="datatable">
        <DataGrid
        className="datagrid"
        rows={data}
        columns={columns}
        pageSize={14}
        rowsPerPageOptions={[14]}
        checkboxSelection
      />
      <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Edit License plate</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form >
              <Form.Group className="mb-3 form-table-history" controlId="exampleForm.ControlInput1">
              <Form.Label>
                  <img src={
                    imageFromTable
                      ? require(`../../asset/upload_image/${imageFromTable}`)
                      : "wait for loading"
                  }
                  alt="car"
                  className="licenseplate-history-img"></img>
              </Form.Label>
            
            {/* Input block */}
              <Form.Control
                  type="licenseplate"
                  placeholder="License plate"
                  autoFocus
                  onChange={(event)=>{
                    setUpdateData(event.target.value)
                  }}
              />
              </Form.Group>
          </Form>
          </Modal.Body>
          <Modal.Footer>
          {/* Close button */}
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          {/* Save button */}
          <Button variant="primary" onClick={()=>{updateLicensePlate(idFromTable)}}>
              Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
    </div>
    
  )
}
