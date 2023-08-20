import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import Buy from './dashboard/sites/buy'
import Sell from './dashboard/sites/sell'
import History from './dashboard/sites/history'
import Check from './dashboard/sites/check'
import Portfolio from './dashboard/sites/portfolio'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Dashboard(props) {

    const [buyStock, setBuyStock] = React.useState('');
    const [buyQuantity, setBuyQuantity] = React.useState();

    const [selected, setSelected] = React.useState();
    const [stockData, setStockData] = React.useState({ c: 0, l: 0, h: 0 });
    const [symbol, setSymbol] = React.useState(' ');
    const [showStockPrice, setShowStockPrice] = React.useState(false);

    const [db,sdb] = React.useState();

    const fetchStockData = (stock) => {
        let name = stock.toUpperCase();
        let url = import.meta.env.VITE_FINNHUB_URL + 'symbol=' + name + import.meta.env.VITE_FINNHUB_KEY;
        fetch(url)
            .then(response => response.json())
            .then(data => setStockData(data))
            .catch(error => console.log(error))
    }

    for(let i = 0; i < props.data.length;i++) {
        if(props.user.id === props.data[i].id){
            console.log(props.data[i])
        }
    }

    const symbolHandleChange = (event) => {
        setSymbol(event.target.value)
        setShowStockPrice(false);
    }

    React.useEffect(() => {
        fetchStockData(symbol);
    }, [showStockPrice])

    const symbolHandleSubmit = (event) => {
        event.preventDefault();
        setShowStockPrice(true);
    }

    const buyHandleChange = event => {
        //setBuyStock(event.target.value)
    }

    const buyHandleSubmit = event => {
        props.setUser(prevState => ({
            ...prevState,
            own_shares: {
                ...prevState.own_shares,
                [buyStock]: 1
            }
        }));
        event.preventDefault();
    }

    const components = {
        check: <Check
            handleChange={symbolHandleChange}
            handleSubmit={symbolHandleSubmit}
        />,
        buy: <Buy
            handleChange={buyHandleChange}
            handleSubmit={buyHandleSubmit}
            setBuyStock={setBuyStock}
            setBuyQuantity={setBuyQuantity}
            user={props.user}
        />,
        sell: <Sell />,
        history: <History />,
        portfolio: <Portfolio
            user={props.user}
        />
    }

    const handleClick = (event) => {
        if (components[event.target.id]) {
            setSelected(components[event.target.id])
        }
        setShowStockPrice(false);
    }

    const prices = <div className='flex justify-center text-lg mt-4'>
        <div>
            <div>
                <h2>
                    Current price of {symbol.toUpperCase()} is: {stockData.c} $
                </h2>
                <h2>
                    Lowest: {stockData.l} $
                </h2>
                <h2>
                    Highest: {stockData.h} $
                </h2>
            </div>
        </div>
    </div>

    return (
        <div>
            {!props.loggedIn && <Navigate to='/login' />}
            {props.element}
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
            {showStockPrice && prices}
        </div>
    )
}
