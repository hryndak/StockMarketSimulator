import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '../config/supabaseClient';
import fetchStockData from '../fetchStockData';
import { localUserDataContext } from '../context/localUserDataContext';

export default function Buy(props) {

    const data = React.useContext(localUserDataContext);
    const ownStockArray = Object.entries(data.own_shares);

    const [userData, setUserData] = React.useState({
        money: '',
    });
    const [toSell, setToSell] = React.useState({
        symbol: '',
        quantity: ''
    });

    React.useEffect(() => {
        setUserData(data);
        //setUserMoney(userData.money)
    }, [])
    console.log(userData);

    async function lookUp(symbol) {
        const data = await fetchStockData(symbol); // Replace with the desired stock symbol
        if (data !== undefined) {
            return data
        }
    }

    async function addData(id, updatedMoney, updatedShares) {
        const { error } = await supabase
            .from('login')
            .update({ own_shares: updatedShares, money: updatedMoney })
            .eq('id', id)
    }

    const handleChange = (event) => {
        if (event.target.name === 'select') {
            setToSell(prevState => ({
                ...prevState,
                symbol: event.target.value
            }))
        }
        if (event.target.name === 'number') {
            setToSell(prevState => ({
                ...prevState,
                quantity: event.target.value
            }))
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let quantityOfUserStock = userData.own_shares[toSell.symbol.toString()];

        let stockPrice = await lookUp(toSell.symbol);
        let totalSellPrice = stockPrice.c * toSell.quantity
        if (toSell.quantity <= quantityOfUserStock && quantityOfUserStock != 0) {
            console.log(stockPrice.c, totalSellPrice)
            let updatedMoney = userData.money + totalSellPrice;
            let totalStockQuantity = quantityOfUserStock - toSell.quantity;
            let updatedOwnShares = { ...userData.own_shares };
            updatedOwnShares[toSell.symbol] = totalStockQuantity;
            addData(userData.id, updatedMoney, updatedOwnShares);
        }
        //props.goToDash();
    }

    return (
        <div className='mt-16'>
            <h1 className='flex justify-center text-xl mb-4'>Sell your shares</h1>
            <div className='flex justify-center'>
                <form className='flex flex-col items-center' onSubmit={handleSubmit}>
                    <div className='flex flex-row items-center mb-4'>
                        <select name='select' onChange={handleChange} className='pl-2 border-b-2 w-28 h-8'>
                            <option selected='true' disabled='disabled'>Select</option>
                            {ownStockArray.map((ele) => (
                                ele[1] !== 0 && (
                                    <option key={ele[0]} value={ele[0]}>
                                        {ele[0]}
                                    </option>
                                )
                            ))}
                        </select>
                    </div>
                    <input name='number' placeholder='Quantity' min={0} value={toSell.quantity} onChange={handleChange} type='number' className='w-60 h-7 mr-2 border-sky-700 border-b-2 pl-2' />
                    <input type='submit' value='Sell' className='border mt-4 w-32 h-8 rounded bg-blue-500 hover:bg-blue-600 text-white' />
                </form>
            </div>
        </div>
    )
}