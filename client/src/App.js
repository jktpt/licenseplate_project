import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./page/home/Home";
import { Login } from "./page/login/Login";
import { Register } from "./page/register/Register";
import { List } from "./page/list/List";
import { Data } from "./page/addData/Data";
import "./page/style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { Animation_checkin } from "./animation/Animation_checkin";
import { Animate } from "./animation/Animate";
import { Bill } from "./page/bill/Bill";
import { Guardhouse } from "./page/guardhouse/Guardhouse"
import { Lockslot } from "./page/lockslot/Lockslot";
import { Manageaccount } from "./page/manageaccount/Manageaccount";
import { Members } from "./page/members/Members"

function App() {
  const {darkMode} = useContext(DarkModeContext)
  
  return (
    <div className={darkMode ? "App dark": "App"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact>
            <Route path='*' element={<Navigate to='/' />} />
            <Route index element={<Animate/>}></Route>
            <Route path="inanimation" element={<Animation_checkin/>}/>
            <Route path="*" element={<Navigate to='/'/>}/>
            <Route path="home" element={<Home/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="admin" element={<Login/>}/>
            <Route path="guardhouse" element={<Guardhouse/>}/>
            <Route path="manageaccount" element={<Manageaccount/>}/>
            <Route path="member" element={<Members/>}/>
            <Route path="lockslot" element={<Lockslot/>}></Route>
            <Route path="users">
              <Route index element={<List/>}/>
            </Route>
            <Route path="bill" element={<Bill/>}/>
            <Route path="adddata">
              <Route index element={<Data/>}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
