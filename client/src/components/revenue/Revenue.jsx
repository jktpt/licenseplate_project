import './revenue.scss'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect,useState } from "react";
import { CircularProgressbar,buildStyles  } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export const Revenue = () => {
  const moment = require('moment')
  const [data, setData] = useState("0")
  const lastestDay = moment().format('DD MMMM YYYY HH:mm:ss')
  const [revenue, setRevenue] = useState(1000);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  
  function handleData(param){
    setShow(true)
    console.log(data[0].Hours);
  }

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_HOST}/api/timestampdiff`).then(response=>{
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
    <div className="feature">
        <div className="top">
            <h1 className="title">Today Revenue</h1>
            <MoreVertIcon fontSize='small' onClick={()=>handleData()} style={{cursor:"pointer"}}/>
        </div>
        <div className="bottom">
            <div className="featureChart">
              {/* Change the value and text to update on your screen in Total revenue */}
                <CircularProgressbar value={(data[0].Hours*10/revenue)*100} text={data[0].Hours == null ? "0%" : ((data[0].Hours*10/revenue)*100).toFixed(1)+"%"} strokeWidth={5} styles={buildStyles({
                    textColor: "gray",
                    pathColor: "green",
                    trailColor: "#e8e7e6"
                     })}/>
            </div>
            <p className="title">Total sales made today</p>
            <p className="amount">{data[0].Hours*10} THB</p>
            <p className='desc'>minimum daily income {revenue} THB</p>
            <p className="desc">latest update {lastestDay}</p>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Edit Revenue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form >
              <Form.Group className="mb-3 form-table-history" controlId="exampleForm.ControlInput1">
            {/* Input block */}
              <Form.Control
                  type="revenue"
                  placeholder="Revenue"
                  autoFocus
                  onChange={(event)=>{
                    setRevenue(event.target.value)
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
          <Button variant="primary" onClick={handleClose}>
              Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}
