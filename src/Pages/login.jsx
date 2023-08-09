import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Login(props) {

    console.log(props.loggedIn)

    return (
        <div>
            <div className='bg-gray-500  h-screen flex text-center items-center justify-center'>
                <form onSubmit={props.handleSubmitLogin} className='' >
                    <input onChange={props.handleChangeLogin} required type='email' placeholder='E-mail' className='placeholder:italic placeholder:text-slate-400 p-4 mb-2 w-72 h-10 rounded-md ' />
                    <br />
                    <input onChange={props.handleChangeLogin} required type='password' placeholder='Password' className='placeholder:italic placeholder:text-slate-400 p-4 mb-2 w-72 h-10 rounded-md ' />
                    <br />
                    <input type='submit' value='Login' className='hover:cursor-pointer hover:bg-gray-200 w-32 h-8 rounded bg-white' />
                    <Link to="/register">Register</Link>
                    {props.loggedIn && <Navigate to='/dashboard' />}
                </form>
            </div>

        </div>
    )
}
