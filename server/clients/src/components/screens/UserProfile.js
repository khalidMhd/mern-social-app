import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import '../style/Profile.css'

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)


    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((res) => res.json())
            .then(result => {
                // console.log(result);
                setProfile(result)
            })
    }, [])

 
    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                      ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
        })
    }
    return (
        <>
            {userProfile ?

                <div style={{ maxWidth: '1000px', margin: '0px auto' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginTop: '20px',
                        borderBottom: '1px solid gray'
                    }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: '80px' }}
                                src={userProfile.user.profile} alt='post' />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <h4> {userProfile.user.name} </h4>
                            <h5> {userProfile.user.email} </h5>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            {showfollow ?
                            <button type="button" className="btn btn-primary" onClick={() => followUser()}
                                style={{ left: '50%', width: '130px', margin: '10px' }}>
                                follow
                             </button>
                             :
                              <button type="button" className="btn btn-primary" onClick={() => unfollowUser()}
                                style={{ left: '50%', width: '130px', margin: '10px' }}>
                                unfollow
                             </button>
                            }
                           
                        </div>
                    </div>
                    <div className='gallary'>
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img className='item' src={item.photo} alt='post' />
                                )
                            })
                        }
                    </div>
                </div>

                : <h2>Loading..</h2>}

        </>

    )

}

export default Profile