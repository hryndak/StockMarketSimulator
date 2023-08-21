import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import supabase from './config/supabaseClient'
import './index.css'
import Register from './Pages/register'
import Login from './Pages/login'
import Dashboard from './Pages/dashboard'
import { localUserDataContext } from './context/localUserDataContext'


function App() {
  const [number, setNumber] = React.useState();
  const [share, setShare] = React.useState();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [data, setData] = React.useState(null)
  const [taken, setTaken] = React.useState(false);
  const [stockData, setStockData] = React.useState({});
  const [localUser, setLocalUser] = React.useState({
    email: ' ',
    password: ' ',
    id: '',
    loggedIn: false,
    own_shares: {},
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

  }

  React.useEffect(() => {
    fetchData();
  }, [])


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
      console.log('taken')
    }

  }

  const handleChangeRegister = event => {

    event.preventDefault();

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
      if (user.email === data[i].email) {
        setLocalUser(true);
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

  const fetchStockData = (stock) => {
    let stockData;
    let name = stock.toUpperCase();
    let url = import.meta.env.VITE_FINNHUB_URL + 'symbol=' + name + import.meta.env.VITE_FINNHUB_KEY;
    fetch(url)
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.log(error))

    console.log(stockData);
  }

  React.useEffect(() => {
    console.log(fetchStockData('IBM'));
  }, [])

  return (
    <>
      <localUserDataContext.Provider value={localUser} >
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register
            handleSubmitRegister={handleSubmitRegister}
            handleChangeRegister={handleChangeRegister}
            taken={taken}
            handleSubmitLogin={handleSubmitLogin}
            handleChangeLogin={handleChangeLogin}
          />} />
          <Route path="/login" element={<Login
            handleChangeLogin={handleChangeLogin}
            handleSubmitLogin={handleSubmitLogin}
            loggedIn={loggedIn}
          />} />
          <Route path='/dashboard' element={<Dashboard
            loggedIn={loggedIn}
            logOut={logOut}
            fetchStockData={fetchStockData}
          />} />
        </Routes>
      </localUserDataContext.Provider>
    </>
  )
}

export default App
