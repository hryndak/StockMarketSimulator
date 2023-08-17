import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './Pages/register'
import Login from './Pages/login'
import Dashboard from './Pages/dashboard'
import Buy from './Pages/dashboard/sites/buy'
import Check from './Pages/dashboard/sites/check'
import Sell from './Pages/dashboard/sites/sell'
import History from './Pages/dashboard/sites/history'
import React from 'react'
import './index.css'
import supabase from './config/supabaseClient'



function App() {
  
  const [element, setElement] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [data, setData] = React.useState(null)
  const [taken, setTaken] = React.useState(false);
  const [user, setUser] = React.useState({
    email: ' ',
    password: ' ',
    id: '',
    loggedIn: false,
    own_shares: { 'IBM': 2, 'APP': 3 },
    money: 1000
  });

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
    }

    //fetch stock database info
  }
  React.useEffect(() => {
    fetchData();

  }, [])


  const handleSubmitLogin = async event => {
    event.preventDefault();

    for (let i = 0; i < data.length; i++) {
      if (user.email === data[i].email && user.password == data[i].password) {
        setLoggedIn(true);
        setUser(prevState => ({
          ...prevState,
          id: data[i].id
        }));
      }
    }
  }

  const handleChangeLogin = event => {
    if (event.target.type === 'email') {
      setUser(prevState => ({
        ...prevState,
        email: event.target.value
      }));
    }
    if (event.target.type === 'password') {
      setUser(prevState => ({
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
        .insert({ email: user.email, password: user.password, money: user.money, own_shares: user.own_shares })
      event.preventDefault();
    } else {
      event.preventDefault();
      console.log('taken')
    }

  }

  const handleChangeRegister = event => {

    event.preventDefault();

    //take email form input 
    if (event.target.type === 'email') {
      setUser(prevState => ({
        ...prevState,
        email: event.target.value
      }));
      setTaken(false);
    }

    //check if email input is already in database
    for (let i = 0; i < data.length; i++) {
      if (user.email === data[i].email) {
        setTaken(true);
      }
    }

    //take password form input 
    if (event.target.type === 'password') {
      setUser(prevState => ({
        ...prevState,
        password: event.target.value
      }));
    }
  }

  const logOut = () => {
    setLoggedIn(false);
  }


  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register
          data={data}
          fetchData={fetchData}
          handleSubmitRegister={handleSubmitRegister}
          handleChangeRegister={handleChangeRegister}
          taken={taken}
          handleSubmitLogin={handleSubmitLogin}
          handleChangeLogin={handleChangeLogin}
        />} />
        <Route path="/login" element={<Login
          data={data}
          fetchData={fetchData}
          handleChangeLogin={handleChangeLogin}
          handleSubmitLogin={handleSubmitLogin}
          loggedIn={loggedIn}
        />} />
        <Route path='/dashboard' element={<Dashboard
          loggedIn={loggedIn}
          logOut={logOut}
        />} />
      </Routes>
    </>
  )
}

export default App
