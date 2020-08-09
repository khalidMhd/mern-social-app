import React, { useEffect, createContext, useReducer, useContext } from 'react';
// import 'bootstrap/dist/css/bootstrap.css'
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/createPost';
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribeUserPosts from './components/screens/SubscribesUserPosts'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'
export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user) {
      dispatch({type:"USER", payload:user})
      // history.push('/')
    } else {
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/login')
    }
  },[])
  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>

      <Route path='/Signup'>
        <Signup />
      </Route>

      <Route path='/login'>
        <Login />
      </Route>

      <Route exact path='/profile'>
        <Profile />
      </Route>

      <Route path='/createpost'>
        <CreatePost />
      </Route>

      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>

      <Route path='/myfollowingpost'>
        <SubscribeUserPosts />
      </Route>

      <Route exact path='/reset'>
        <Reset />
      </Route>

      <Route path='/reset/:token'>
        <NewPassword />
      </Route>

    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
