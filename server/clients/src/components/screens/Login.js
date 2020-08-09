import React, { useState, useContext } from 'react';
import {UserContext} from '../../App'
import '../style/Login.css'
import M from 'materialize-css'
import { Link, useHistory } from 'react-router-dom'

const Login = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  function LoginData() {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: 'Invalid Email', classes: "#ef5350 red lighten-1" })
      return
    }
    fetch('/signin', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.err) {
          M.toast({ html: responseData.err, classes: "#ef5350 red lighten-1" })
        } else {
          localStorage.setItem('jwt', responseData.token)
          localStorage.setItem('user', JSON.stringify(responseData.user))
          dispatch({type:'USER', payload:responseData.user})
          M.toast({ html: 'Signed in successfully', classes: "#66bb6a green lighten-1" })
          history.push('/')
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

        <input type="password" placeholder="Password" className="input-2"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="text-center" >
          <button type="button" className="btn btn-primary" onClick={() => LoginData()}
            style={{ left: '50%', width: '130px', margin: '10px' }}>
            Log In
            </button>
        </div>
      </div>
    </div>
    <div className="sub-content">
      <div className="s-part">
        Create an account?<Link to="/Signup">Sign up</Link>
      </div>
      <div className="s-part">
        <Link to="/reset">Forgot Password</Link>
      </div>
    </div>
  </div>
  )
}

export default Login