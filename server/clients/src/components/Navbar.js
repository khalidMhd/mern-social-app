import React,{useContext,useRef,useEffect,useState} from 'react'
// import 'bootstrap/dist/css/bootstrap.css'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

function Navbar() {
  const  searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if (state) {
      return [

        <li className="nav-item">
        <Link className="nav-link " to="/profile">Profile</Link>
      </li>,
        <li className="nav-item">
          <Link className="nav-link " to="/createpost">Create Post</Link>
        </li>,
        <li className="nav-item">
          <Link className="nav-link " to="/myfollowingpost"> My following posts</Link>
        </li>,
        <li className="nav-item" style={{margin:"10px"}}>
          <Link className="fa fa-search" data-toggle="modal" data-target="#exampleModal"> </Link>
        </li>,
        <li className="nav-item">
          <button type="button" className="btn btn-danger" onClick={() => {
            localStorage.clear()
            dispatch({ type: "CLEAR" })
            history.push("/login")
          }}> Log Out
        </button>
        </li>,

        // Modal
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <div class="modal-title" id="exampleModalLabel">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="">Email</span>
                    </div>
                    <input type="text" class="form-control" placeholder="search users"
                      value={search}
                      onChange={(e)=>fetchUsers(e.target.value)}
                    />
                  </div>
                </div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ul class="list-group">
                {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                  //  M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li class="list-group-item">{item.email}</li></Link> 
               })}
                  
                </ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      ]

    } else {
      return [
        <li className="nav-item">
          <Link className="nav-link" to="/login">Login <span className="sr-only">(current)</span></Link>
        </li>,
        <li className="nav-item">
          <Link className="nav-link" to="/signup">Signup</Link>
        </li>
      ]

    }
  }

  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
 }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to={state ? '/' : '/login'}>Instagram</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {renderList()}
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;
