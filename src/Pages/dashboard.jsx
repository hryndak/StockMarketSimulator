import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import Buy from './dashboard/sites/buy'
import Sell from './dashboard/sites/sell'
import History from './dashboard/sites/history'
import Check from './dashboard/sites/check'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Dashboard(props) {

    const [selected, setSelected] = React.useState();
    
    const components = {
        check: <Check
            handleChange={props.symbolHandleChange}
            handleSubmit={props.symbolHandleSubmit}
        />,
        buy: <Buy />,
        sell: <Sell />,
        history: <History />
    }

    const handleClick = (event) => {
        if (components[event.target.id]) {
            setSelected(components[event.target.id])
        }
    }

    return (
        <div>
            {!props.loggedIn && <Navigate to='/login' />}
            {props.element}
            <nav>
                <ul className='flex justify-end p-2 mr-10 text-lg'>
                    <li className='ml-8 justify-left w-screen'>STOCK MARKET SIMULATOR</li>
                    <li id='check' onClick={handleClick} className='ml-4'>Check</li>
                    <li id='buy' onClick={handleClick} className='ml-4'>Buy</li>
                    <li id='sell' onClick={handleClick} className='ml-4'>Sell</li>
                    <li id='history' onClick={handleClick} className='ml-4'>History</li>
                    <li onClick={props.logOut} className='ml-4 hover:cursor-pointer underline decoration-sky-900'>LogOut</li>
                </ul>
            </nav>
            {selected}
        </div>
    )
}
