import React, { useState, useContext } from 'react';
import '../style/Login.css'
import M from 'materialize-css'
import { Link, useHistory } from 'react-router-dom'

const Reset = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')

  function LoginData() {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: 'Invalid Email', classes: "#ef5350 red lighten-1" })
      return
    }
    fetch('/reset-password', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        email: email,
      })
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.err) {
          M.toast({ html: responseData.err, classes: "#ef5350 red lighten-1" })
        } else {
          M.toast({ html:responseData.message , classes: "#66bb6a green lighten-1" })
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

        <input type="email" placeholder="Email" className="input-1"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="text-center" >
          <button type="button" className="btn btn-primary" onClick={() => LoginData()}
            style={{ left: '50%', width: '170px', margin: '10px' }}>
            Reset Password
            </button>
        </div>
      </div>
    </div>
    
  </div>
  )
}

export default Reset