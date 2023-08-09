import { Routes, Route,Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Dashboard(props) {

    return (
        <div>
            {!props.loggedIn && <Navigate to='/login' />}
            <h1>DASHBOARD</h1>
            <button onClick={props.logOut}>LogOut</button>

        </div>
    )
}
