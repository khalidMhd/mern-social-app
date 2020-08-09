import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
const CreteaPost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if (url) {
            fetch("/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url,
                })

            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: "All fields must be filled", classes: "#c62828 red darken-3" })
                    }
                    else {
                        M.toast({ html: "Created post Successfully", classes: "#43a047 green darken-1" })
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postDetails = () => {
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

    return (

        <div className="card mb-3" style={{ maxWidth: '600px', margin: '26px auto' }} >
            <div className="md-form" style={{ margin: '20px' }}>

                <input type="text" placeholder='Title' className="form-control"
                    value={title} onChange={(e) => setTitle(e.target.value)} />

                <input type="text" placeholder='Body' className="form-control"
                    value={body} onChange={(e) => setBody(e.target.value)} />

                <input type="file" onChange={(e) => setImage(e.target.files[0])} />

                <div className="text-center" >
                    <button type="button" className="btn btn-primary" onClick={() => postDetails()}
                        style={{ left: '50%', width: '130px', margin: '10px' }}>
                        Add Post
                    </button>
                </div>
            </div>
        </div>
    )
}


export default CreteaPost