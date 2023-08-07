import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Login(props) {

    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [loggedIn, setLoggedIn] = React.useState(false);

    const handleChange = event => {
        if (event.target.type === 'email') {
            setEmail(event.target.value);
        }
        if (event.target.type === 'password') {
            setPassword(event.target.value);
        }
    }

    const handleSubmit = async event => {
        event.preventDefault();

        for(let i = 0; i < props.data.length; i++) {
            if(email === props.data[i].email && password == props.data[i].password) {
                setLoggedIn(true);
            }
        }
    }

    return (
        <div>
            <div className='bg-gray-500  h-screen flex text-center items-center justify-center'>
                <form onSubmit={handleSubmit} className='' >
                    <input onChange={handleChange} required type='email' placeholder='E-mail' className='placeholder:italic placeholder:text-slate-400 p-4 mb-2 w-72 h-10 rounded-md ' />
                    <br />
                    <input onChange={handleChange} required type='password' placeholder='Password' className='placeholder:italic placeholder:text-slate-400 p-4 mb-2 w-72 h-10 rounded-md ' />
                    <br />
                    <input type='submit' value='Login' className='hover:cursor-pointer hover:bg-gray-200 w-32 h-8 rounded bg-white' />
                    <Link to="/register">Register</Link>
                    {loggedIn && <Navigate to='/dashboard' />}
                </form>
            </div>

        </div>
    )
}
