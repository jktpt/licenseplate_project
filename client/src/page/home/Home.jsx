import { Sidebar } from "../../components/sidebar/Sidebar"
import { Navbar } from "../../components/navbar/Navbar"
import { Recently } from "../../components/recently/Recently"
import { Revenue } from "../../components/revenue/Revenue"
import { Revenuegraph } from "../../components/revenuegraph/Revenuegraph"
import { Historyrecently } from "../../components/historyrecently/HistoryRecently"
import './home.scss'
import { useEffect,useState } from "react";
import Axios from 'axios'

export const Home = () => {
  const [data, setData] = useState([])
  const [totalCar, setTotalCar] = useState([])
  const [dataOfToday, setDataOfToday] = useState([])
  const [dataParkingCar, setParkingCar] = useState([])
  const [dataOutOfCar, setOutOfCar] = useState([])
  const [dataLastMonth, setLastMonth] = useState([])
  const [dataCurrentMonth, setCurrentMonth] = useState([])

  const getTotalcar = () =>{
    Axios.get(`${process.env.REACT_APP_HOST}/api/totalcar`).then((response)=>{
      setTotalCar(response.data)
    })
  }
 
  const getData = () =>{
    Axios.get(`${process.env.REACT_APP_HOST}/api/guardhouse`).then((response)=>{
      setData(response.data)
    })
  }

  const getDataOfToday = () =>{
    Axios.get(`${process.env.REACT_APP_HOST}/api/todaycar`).then((response)=>{
      setDataOfToday(response.data)
    })
  }

  const getParkingCar = () =>{
    Axios.get(`${process.env.REACT_APP_HOST}/api/parkingcar`).then((response)=>{
      setParkingCar(response.data)
    })
  }

  const getOutOfCar = () =>{
    Axios.get(`${process.env.REACT_APP_HOST}/api/outofcar`).then((response)=>{
      setOutOfCar(response.data)
    })
  }

  const getLastMonthCar = () =>{
    Axios.get(`${process.env.REACT_APP_HOST}/api/lastmonthcar`).then((response)=>{
      setLastMonth(response.data)
    })
  }

  const getCurrentMonthCar = () =>{
    Axios.get(`${process.env.REACT_APP_HOST}/api/currentmonthcar`).then((response)=>{
      setCurrentMonth(response.data)
    })
  }


  useEffect(()=>{
    const token = localStorage.getItem('token')
    fetch(`${process.env.REACT_APP_HOST}/api/authen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization':'Bearer '+token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.status === "ok"){
            getData()
            getTotalcar()
            getDataOfToday()
            getParkingCar()
            getOutOfCar()
            getLastMonthCar()
            getCurrentMonthCar()
            // alert('authen success')
        }else{
            // alert('Please Sign in')
            localStorage.removeItem('token');
            window.location = '/login'
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },[])


  return (
    <div className="home">
      <Sidebar/>
      <div className="homeContainer">
        <Navbar/>
        <div className="top">
          <div className="widgets">
            <span className="recently">Recently Cars</span>
              {data.map((val,key)=>{
                return (
                    <Recently key={val.id} data={data[key]} />
                )
              })}
          </div>
          <div className="listContainer">
              <div className="listTitle">History of Recently Cars</div>
              <Historyrecently />
          </div>
          <div className="dataoffset">
            <div className="top-offset">
              <div className="total-car">{totalCar.map((val,key)=>{return val.total_plate})}<span className="font-Offset">Total cars</span></div>
              <div className="parking-car">{dataParkingCar.map((val,key)=>{return val.todayparking})}<span className="font-Offset">Parking cars</span></div>
            </div>
            <div className="middle-offset">
              <div className="today-car">{dataOfToday.map((val,key)=>{return val.todayCar})}<span className="font-Offset">Today cars</span></div>
              <div className="out-of-car">{dataOutOfCar.map((val,key)=>{return val.outofcar})}<span className="font-Offset">Out of cars</span></div>
            </div>
            <div className="last-offset">
              <div className="lm-car">{dataLastMonth.map((val,key)=>{return val.total_plate_last_month})}<span className="font-Offset2">Last month cars</span></div>
              <div className="cm-car">{dataCurrentMonth.map((val,key)=>{return val.total_plate_current_month})}<span className="font-Offset2">Current month cars</span></div>
            </div>
          </div>
        </div>
        <div className="charts">
            <Revenuegraph/>
            <Revenue/>
        </div>
      
      </div>
    </div>

  )
}

