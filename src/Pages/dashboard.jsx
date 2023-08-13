import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Dashboard(props) {

    console.log(props.stockData);

    const [element,setElement] = React.useState(null);

    const handleClick = (event) => {
        console.log(event.target.id)
        switch(event.target.id) {
            case 'check':
                setElement(<Navigate to='/dashboard/check'/>)
            case 'buy':
                setElement(<Navigate to='/dashboard/buy'/>)
            case 'sell':
                setElement(<Navigate to='/dashboard/sell'/>)
            case 'history':
                setElement(<Navigate to='/dashboard/history'/>)
            case 'portfolio':
                setElement(<Navigate to='/dashboard/portfolio'/>)
            default:
                setElement(<Navigate to='/dashboard'/>)
        }
    }

    return (
        <div>
            {!props.loggedIn && <Navigate to='/login' />}
            <nav>
                <ul className='flex justify-end p-2 mr-10 text-lg'>
                    <li className='ml-8 justify-left w-screen'>STOCK MARKET SIMULATOR</li>
                    <li id='check' onClick={handleClick} className='ml-4'>Check</li>
                    <li id='buy' onClick={handleClick} className='ml-4'>Buy</li>
                    <li id='sell' onClick={handleClick} className='ml-4'>Sell</li>
                    <li id='history' onClick={handleClick} className='ml-4'>History</li>
                    <li id='portfolio' onClick={handleClick} className='ml-4'>Portfolio</li>
                    <li onClick={props.logOut} className='ml-4 hover:cursor-pointer underline decoration-sky-900'>LogOut</li>
                </ul>
            </nav>
            {element}
        </div>
    )
}
