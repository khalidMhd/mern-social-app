import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App'
import '../style/Profile.css'
import M from 'materialize-css'
// import { use } from '../../../../Server/routes/auth';


const Profile = () => {
    const [myPics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState('')

    useEffect(() => {
        fetch('/myPost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((res) => res.json())
            .then(result => {
                setPics(result.MyPost)
            })
    }, [])

    useEffect(() => {
        if (image) {
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
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                            //window.location.reload()
                        })

                })
                .catch(err => {
                    console.log(err)
                })
        }

    }, [image])

    const updatePhote = (file) => {
        setImage(file)

    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0px auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '20px',
                borderBottom: '1px solid gray'
            }}>
                <div>
                    <img style={{ width: "160px", height: "160px", borderRadius: '80px' }}
                        src={state ? state.profile : 'loading'} alt='post' />
                    <div style={{ width: '200px' }} >

                        <span className="input-group-text">Upload

                            <input type="file" id="inputGroupFile01"
                                onChange={(e) => updatePhote(e.target.files[0])} /></span>

                    </div>

                </div>
                <div style={{ marginTop: '20px' }}>
                    <h4> {state ? state.name : "Loading.."} </h4>
                    <h6> {state ? state.email : "Loading.."} </h6>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                        <h6>{myPics.length} posts</h6>
                        <h6>{state ? state.followers.length : "0"} followers</h6>
                        <h6>{state ? state.following.length : "0"} following</h6>
                    </div>
                </div>
            </div>
            <div className='gallary'>
                {
                    myPics.map(item => {
                        return (
                            <img className='item' src={item.photo} alt='post' />
                        )
                    })
                }
            </div>
        </div>

    )

}

export default Profile