import React, { useState , useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [url, setUrl] = useState('')

  useEffect(()=>{
    if(url){
      uploadFields()
    }

  },[url])

  const uploadProfilePic = ()=>{
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "insta-demo")
    data.append("cloud_name", "insta-demo")
    fetch("https://api.cloudinary.com/v1_1/insta-demo/image/upload", {
        method: "post",
        body: data
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({ html: "All fields must be filled", classes: "#c62828 red darken-3" })
            } else {
                setUrl(data.url)
            }
        })
        .catch(err => {
            console.log(err)
        })
  }

  const uploadFields = ()=>{

    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({ html: 'Invalid Email', classes: "#ef5350 red lighten-1" })
      return
    }
    fetch('/signup', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        password: password,
        email: email,
        pic:url
      })
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.error) {
          M.toast({ html: responseData.error, classes: "#ef5350 red lighten-1" })
        } else {
          M.toast({ html: responseData.message, classes: "#66bb6a green lighten-1" })
          history.push('/login')
        }
      }).catch(err => {
        console.log(err);
      })
  }

  function PostData() {
    if(image){
      uploadProfilePic()
    } else{
      uploadFields()
    }
  }

  return (

    <div id="wrapper" style={{ maxWidth: '500px', margin: '26px auto' }} >
      <div className="main-content">
        <div className="header">
          <img src="https://i.imgur.com/zqpwkLQ.png" alt='post' />
        </div>
        <div className="l-part">
          <input type="text" placeholder="Name" className="input-1"
            value={name} onChange={(e) => setName(e.target.value)} />

          <input type="email" placeholder="Email" className="input-1"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <input type="password" placeholder="Password" className="input-2"
            value={password} onChange={(e) => setPassword(e.target.value)} />

            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <div className="text-center" >
            <button type="button" className="btn btn-primary" onClick={() => PostData()}
              style={{ left: '50%', width: '130px', margin: '10px' }}>
              Sign up
              </button>
          </div>
        </div>
      </div>
      <div className="sub-content">
        <div className="s-part">
          have an account?<Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup