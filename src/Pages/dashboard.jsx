import { Routes, Route, Navigate } from 'react-router-dom'
import React, { useContext } from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'
import { localUserDataContext } from '../context/localUserDataContext'
import Portfolio from '../components/portfolio'
//import { fetchStockData } from '../fetchStockData'

export default function Dashboard(props) {

    const data = useContext(localUserDataContext)
    

    const prices = <div className='flex justify-center text-lg mt-4'>
        <div>
            <div>
                <h2>
                    Current price of { } is: { } $
                </h2>
                <h2>
                    Lowest: { } $
                </h2>
                <h2>
                    Highest: { } $
                </h2>
            </div>
        </div>
    </div>

    return (
        <div>
            {!props.loggedIn && <Navigate to='/login' />}
            <nav>
                <ul className='flex justify-end p-2 mr-10 text-lg'>
                    <li className='ml-8 justify-left w-screen'>STOCK MARKET SIMULATOR</li>
                    <li id='check' className='ml-4'>Check</li>
                    <li id='buy' className='ml-4'>Buy</li>
                    <li id='sell' className='ml-4'>Sell</li>
                    <li id='history' className='ml-4'>History</li>
                    <li onClick={props.logOut} className='ml-4 hover:cursor-pointer underline decoration-sky-900'>LogOut</li>
                </ul>
            </nav>
            <Portfolio>
            </Portfolio>
        </div>
    )
}
