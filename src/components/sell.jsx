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
        money : '',
    });
    const [toSell, setToSell] = React.useState({
        symbol: '',
        quantity: ''
    });
    
    React.useEffect(() => {
        setUserData(data);
        setUserMoney(userData.money)
    }, [])
    console.log(userData);

    async function lookUp(symbol) {
        const data = await fetchStockData(symbol); // Replace with the desired stock symbol
        if (data !== undefined) {
            return data
        }
    }

    async function addData(id, updatedMoney) {
        const { error } = await supabase
            .from('login')
            .update({ own_shares: userData.own_shares, money: updatedMoney })
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
        //console.log(quantityOfUserStock);
        let stockPrice = await lookUp(toSell.symbol);
        let totalSellPrice = stockPrice.c * toSell.quantity
        if (toSell.quantity <= quantityOfUserStock && quantityOfUserStock != 0) {
            console.log(stockPrice.c, totalSellPrice)
            let updatedMoney = userMoney + totalSellPrice;
            let totalStockQuantity = quantityOfUserStock - toSell.quantity;
            userData.own_shares
            
            //addData(userData.id,userMoney)
        }
    }

    return (
        <div>
            <h1>SELL</h1>
            <form onSubmit={handleSubmit}>
                <select name='select' onChange={handleChange} className='border'>
                    <option selected='true' disabled='disabled' >SELECT</option>
                    {
                        ownStockArray.map(ele => (
                            <option>{ele[0]}</option>
                        ))
                    }
                </select>
                <input name='number' onChange={handleChange} type='number' className='border' />
                <input type='submit' className='border' />
            </form>
        </div>
    )
}