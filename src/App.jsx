import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import supabase from './config/supabaseClient'
import './index.css'
import Register from './Pages/register'
import Login from './Pages/login'
import Dashboard from './Pages/dashboard'
import { localUserDataContext, localUserIDCOntext } from './context/localUserDataContext'


function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [data, setData] = React.useState({
    email: 'a'
  })
  const [taken, setTaken] = React.useState(false);
  const [localUser, setLocalUser] = React.useState({
    email: ' ',
    password: ' ',
    id: '',
    own_shares: {},
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
      console.log("z DB", data);

    }

  }

  React.useEffect(() => {
    if (loggedIn) {
      for (let i = 0; i < data.length; i++) {
        let localId = localUser.id;
        if (data[i].id === localId) {
          setLocalUser(prevState => ({
            ...prevState,
            own_shares: data[i].own_shares,
          }));
        }
      }
    }
  }, [loggedIn, data, localUser.id]);

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
        .insert({ email: localUser.email, password: localUser.password, money: 1000, own_shares: localUser.own_shares })
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

  return (
    <>
      <localUserDataContext.Provider value={localUser} >
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
      </localUserDataContext.Provider>
    </>
  )
}

export default App
