import { Routes, Route, Navigate } from 'react-router-dom'
import React, { useContext, version } from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'
import { localUserDataContext } from '../context/localUserDataContext'
import fetchStockData from '../fetchStockData'
import Portfolio from '../components/portfolio'
import Check from '../components/check'
import Buy from '../components/buy'


export default function Dashboard(props) {

    const data = useContext(localUserDataContext)
    const [symbol, setSybmol] = React.useState(
        {
            symbol: 'NULL',
            isShowed: false
        }
    );
    const [stockData, setStockData] = React.useState({
        current: 0,
        lowest: 0,
        highest: 0
    })
    const [selected, setSelected] = React.useState(<Portfolio />);
    const [toBuy, setToBuy] = React.useState({
        stock: ' ',
        quantity: 0
    })

    const onChangeCheck = event => {
        setSybmol(prev => ({
            ...prev,
            symbol: event.target.value,
            isShowed: false
        }));
    }
    const onSubmitCheck = event => {
        event.preventDefault();
        async function fetchData() {
            const data = await fetchStockData(symbol.symbol);
            if (data !== undefined) {
                setStockData(prev => ({
                    ...prev,
                    current: data.c,
                    lowest: data.l,
                    highest: data.h
                })); // Update state with fetched data
            }
        }
        setSybmol(prev => ({
            ...prev,
            isShowed: true
        }));
        fetchData();
    }

    const handleClick = (event) => {
        props.fetchData();
        if (components[event.target.id]) {
            setSelected(components[event.target.id])
        }
        setSybmol(prev => ({
            ...prev,
            isShowed: false
        }));
    }

    const components = {
        check: <Check
            handleChange={onChangeCheck}
            handleSubmit={onSubmitCheck}
        />,
        portfolio: <Portfolio />,
        buy: <Buy
            handleHelpSubmit={props.fetchData}
        />,

    }


    const prices = <div className='flex justify-center text-lg mt-4'>
        <div>
            <div>
                <h2>
                    Current price of {symbol.symbol} is: {stockData.current} $
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
            <nav>
                <ul className='flex justify-end p-2 mr-10 text-lg'>
                    <li id='portfolio' onClick={handleClick} className='ml-8 justify-left w-screen'>STOCK MARKET SIMULATOR</li>
                    <li id='check' onClick={handleClick} className='ml-4'>Check</li>
                    <li id='buy' onClick={handleClick} className='ml-4'>Buy</li>
                    <li id='sell' onClick={handleClick} className='ml-4'>Sell</li>
                    <li id='history' onClick={handleClick} className='ml-4'>History</li>
                    <li onClick={props.logOut} className='ml-4 hover:cursor-pointer underline decoration-sky-900'>LogOut</li>
                </ul>
            </nav>
            {selected}
            {symbol.isShowed && prices}
        </div>
    )
}
