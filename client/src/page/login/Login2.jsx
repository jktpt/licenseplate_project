import React, { useState } from 'react'
import Axios from 'axios'

export const Login = () => {
  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  const [nameReg, setNameReg] = useState('')
  const [surnameReg, setSurnameReg] = useState('')
  const [emailReg, setEmailReg] = useState('')

  const register = () =>{
    Axios.post('https://localhost:3001/register',{username:usernameReg,password:passwordReg,fname:nameReg,lname:surnameReg,email:emailReg}).then((res)=>{
      console.log(res);
    })
  }

  return (
    <div className="App">
      <div className="registration">
        <h1>Register</h1>
        <form action="">
          <div className="mb-3">
              <label>Username : </label>
              <input type="text" onChange={(e)=>{
                setUsernameReg(e.target.value);
              }}/>
          </div>
          <div className="mb-3">
            <label>Password : </label>
          <input type="text" onChange={(e)=>{
            setPasswordReg(e.target.value)
          }}/>
          </div>
          <div className="mb-3">
            <label>Name : </label>
          <input type="text" onChange={(e)=>{
            setNameReg(e.target.value)
          }}/>
          </div>
          <div className="mb-3">
            <label>Surname : </label>
          <input type="text" onChange={(e)=>{
            setSurnameReg(e.target.value)
          }}/>
          </div>
          <div className="mb-3">
            <label>Email : </label>
          <input type="text" onChange={(e)=>{
            setEmailReg(e.target.value)
          }}/>
          </div>
        <button onClick={register}>Register</button>
        </form>
      </div>
      <div className="login">
        <h1>Login</h1>
        <input type="text" placeholder="Username"/>
        <input type="text" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  )
}
