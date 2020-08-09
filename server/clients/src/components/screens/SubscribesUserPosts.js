import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from "../../App"
import {Link} from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';

const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((res) => res.json())
            .then(result => {
                setData(result.posts)
                console.log(result)
            })
    }, [])

    const likePost = (id) => {

        fetch('/like', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then((res) => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const unlikePost = (id) => {

        fetch('/unlike', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then((res) => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <div className='container' style={{ marginTop: '20px', }}>
            {
                data.map(item => {
                    return (
                        <div className="card mb-3" style={{ maxWidth: '600px', margin: '26px auto' }} >
                            <h5 className="card-title" style={{padding:"5px"}}> <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link>
                            {item.postedBy._id == state._id 
                            && 
                            <i className="fa fa-trash" style={{
                                float:"right",
                                cursor:'pointer'
                            }}
                            onClick={()=>deletePost(item._id)}
                            ></i>

                            }
                            </h5>
                            <img className="card-img-top" src={item.photo}
                                alt='post' />
                            <div className="card-body">
                                <i className="fa fa-heart" style={{ fontSize: "24px" }}></i>
                                {item.likes.includes(state._id)
                                    ?
                                    <i className="fa fa-thumbs-down" style={{ fontSize: "24px",cursor:'pointer' }}
                                        onClick={() => { unlikePost(item._id) }}>
                                    </i>
                                    :
                                    <i className="fa fa-thumbs-up" style={{ fontSize: "24px",cursor:'pointer' }}
                                        onClick={() => likePost(item._id)} >
                                    </i>
                                }

                                <h5 className="card-title"> {item.likes.length} Likes </h5>
                                <h5 className="card-title"> {item.title} </h5>
                                <p className="card-text"> {item.body} </p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span> <b>{record.postedBy.name}</b> </span> {record.text} </h6>
                                        )
                                    })
                                }
                                <div className="md-form">
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        makeComment(e.target[0].value, item._id);
                                    }}>
                                        <input type="text" placeholder='add a comment' className="form-control" />
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )

}

export default Home