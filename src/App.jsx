import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import supabase from './config/supabaseClient'
import './index.css'
import Register from './Pages/register'
import Login from './Pages/login'
import Dashboard from './Pages/dashboard'
import { localUserDataContext, localUserIDCOntext } from './context/localUserDataContext'
import { combineReducers } from 'redux'


function App() {
  const [number, setNumber] = React.useState();
  const [share, setShare] = React.useState();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [data, setData] = React.useState({
    email: 'a'
  })
  const [taken, setTaken] = React.useState(false);
  const [stockData, setStockData] = React.useState({});
  const [localUser, setLocalUser] = React.useState({
    email: ' ',
    password: ' ',
    id: '',
    own_shares: {},
    money: 10000
  });

  //ADD ID TO DATA

  const fetchData = async () => {

    //fetch database data
    const { data, error } = await supabase
      .from('login')
      .select()

    if (error) {
      console.log(error)
    }
    if (data) {
      setData(data)
      console.log("z DB", data);
      
    }

  }

  React.useEffect(() => {
    fetchData();
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].id === localUser.id);
    }

  }, [])

  const toLocalData = (index) => {
    setLocalUser(prevState => ({
      ...prevState,
      id : data[index].id , email : data.email, password : data.password, own_shares : data.own_shares, money : data.money
    }))
  }


  const handleSubmitLogin = async event => {

    event.preventDefault();

    for (let i = 0; i < data.length; i++) {
      if (localUser.email === data[i].email && localUser.password == data[i].password) {
        setLoggedIn(true);
        setLocalUser(prevState => ({
          ...prevState,
          id: data[i].id
        }));
      }
    }
  }

  const handleChangeLogin = event => {
    if (event.target.type === 'email') {
      setLocalUser(prevState => ({
        ...prevState,
        email: event.target.value
      }));
    }
    if (event.target.type === 'password') {
      setLocalUser(prevState => ({
        ...prevState,
        password: event.target.value
      }));
    }
  }

  const handleSubmitRegister = async event => {

    //checks if email is taken 
    if (!taken) {
      const { error } = await supabase
        .from('login')
        .insert({ email: localUser.email, password: localUser.password, money: localUser.money, own_shares: localUser.own_shares })
      event.preventDefault();
    } else {
      event.preventDefault();
      setTaken(true);
    }

  }

  const handleChangeRegister = event => {

    //take email form input 
    if (event.target.type === 'email') {
      setLocalUser(prevState => ({
        ...prevState,
        email: event.target.value
      }));
      setTaken(false);
    }

    //check if email input is already in database
    for (let i = 0; i < data.length; i++) {
      if (localUser.email === data[i].email) {
        setTaken(true);
      }
    }

    //take password form input 
    if (event.target.type === 'password') {
      setLocalUser(prevState => ({
        ...prevState,
        password: event.target.value
      }));
    }
  }

  const logOut = () => {
    setLoggedIn(false);
  }

  if (loggedIn) {
    for (let i = 0; i < data.length; i++) {
      let localId = localUser.id;

      if (data[i].id === localId) {
        setData(data[i].own_shares);
        setLocalUser(prevState => ({
          ...prevState,
          own_shares : data[i].own_shares
        }))
      }

    }
  }

  return (
    <>
      <localUserDataContext.Provider value={localUser} >
        <localUserIDCOntext.Provider value={localUser}>

          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<Register
              handleSubmitRegister={handleSubmitRegister}
              handleChangeRegister={handleChangeRegister}
              taken={taken}
            />} />
            <Route path="/login" element={<Login
              handleChangeLogin={handleChangeLogin}
              handleSubmitLogin={handleSubmitLogin}
              loggedIn={loggedIn}
            />} />
            <Route path='/dashboard' element={<Dashboard
              loggedIn={loggedIn}
              logOut={logOut}
            />} />
          </Routes>
        </localUserIDCOntext.Provider>
      </localUserDataContext.Provider>
    </>
  )
}

export default App
