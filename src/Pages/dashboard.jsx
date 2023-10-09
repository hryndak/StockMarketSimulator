import { Routes, Route, Navigate } from 'react-router-dom'
import React, { useContext, version } from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'
import { localUserDataContext } from '../context/localUserDataContext'
import fetchStockData from '../fetchStockData'
import Portfolio from '../components/portfolio'
import Check from '../components/check'
import Buy from '../components/buy'
import Sell from '../components/sell'

export default function Dashboard(props) {

    const data = useContext(localUserDataContext)
    const [showed,setShowed] = React.useState(false);
    const [stockData, setStockData] = React.useState({
        current: 0,
        lowest: 0,
        highest: 0,
        symbol : ''
    })
    const [selected, setSelected] = React.useState(<Portfolio />);

    const handleClick = (event) => {
        props.fetchData();
        if (components[event.target.id]) {
            setSelected(components[event.target.id])
        }
        setShowed(false);
    }

    const goToDash = () => {
        setSelected(components['portfolio']);
    }

    const components = {
        check: <Check
            setStockData={setStockData}
            setShowed={setShowed}
        />,
        portfolio: <Portfolio />,
        buy: <Buy
            handleHelpSubmit={props.fetchData}
        />,
        sell : <Sell goToDash={goToDash} />,
    }

    const prices = <div className='flex justify-center text-lg mt-4'>
        <div>
            <div>
                <h2>
                    Current price of {stockData.symbol} is: {stockData.current} $
                </h2>
                <h2>
                    Lowest: {stockData.lowest} $
                </h2>
                <h2>
                    Highest: {stockData.highest} $
                </h2>
            </div>
        </div>
    </div>

    return (
        <div>
            {!props.loggedIn && <Navigate to='/login' />}
            <nav className='bg-sky-200'>
                <ul className='flex justify-end p-2 mr-10 text-lg'>
                    <li id='portfolio' onClick={handleClick} className='ml-8 justify-left w-screen hover:cursor-pointer'>STOCK MARKET SIMULATOR</li>
                    <li id='check' onClick={handleClick} className='ml-4 hover:cursor-pointer hover:text-sky-500'>Check</li>
                    <li id='buy' onClick={handleClick} className='ml-4 hover:cursor-pointer hover:text-sky-500'>Buy</li>
                    <li id='sell' onClick={handleClick} className='ml-4 hover:cursor-pointer hover:text-sky-500'>Sell</li>
                    <li id='portfolio' onClick={handleClick} className='ml-4 hover:cursor-pointer hover:text-sky-500'>Portfolio</li>
                    <li onClick={props.logOut} className='ml-4 hover:cursor-pointer underline decoration-sky-900'>LogOut</li>
                </ul>
            </nav>
            {selected}
            {showed && prices}
        </div>
    )
}
