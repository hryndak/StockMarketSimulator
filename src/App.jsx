import { Routes, Route } from 'react-router-dom'
import Register from './Pages/register'
import Login from './Pages/login'
import Dashboard from './Pages/dashboard'
import React from 'react'
import './index.css'
import supabase from './config/supabaseClient'

function App() {

  const [data, setData] = React.useState(null)

  const fetchData = async () => {
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

  return (
    <>
      <Routes>
        <Route path="/register" element={<Register data={data} fetchData={fetchData} />} />
        <Route path="/login" element={<Login data={data} fetchData={fetchData} />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
