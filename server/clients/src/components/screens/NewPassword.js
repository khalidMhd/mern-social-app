import React, { useState, useContext } from 'react';
import '../style/Login.css'
import M from 'materialize-css'
import { Link, useHistory,useParams } from 'react-router-dom'

const Login = () => {
  const history = useHistory()
  const [password, setPassword] = useState('')
  const {token} = useParams()
  console.log(token);

  function LoginData() {
    
    fetch('/new-password', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        password: password,
        token:token
      })
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.err) {
          M.toast({ html: responseData.err, classes: "#ef5350 red lighten-1" })
        } else {

          M.toast({ html: responseData.message, classes: "#66bb6a green lighten-1" })
          history.push('/login')
        }
      }).catch(err => {
        console.log(err);
      })

  }

  return (

    <div id="wrapper" style={{ maxWidth: '500px', margin: '26px auto' }} >
    <div className="main-content">
      <div className="header">
        <img src="https://i.imgur.com/zqpwkLQ.png" alt='post' />
      </div>
      <div className="l-part">

        <input type="password" placeholder="Enter New Password" className="input-2"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="text-center" >
          <button type="button" className="btn btn-primary" onClick={() => LoginData()}
            style={{ left: '50%', width: '170px', margin: '10px' }}>
            Update Password
            </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login