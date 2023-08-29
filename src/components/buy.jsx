import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '../config/supabaseClient';
import fetchStockData from '../fetchStockData';
import { localUserDataContext, localUserIDCOntext } from '../context/localUserDataContext';

export default function Buy(props) {
    const [userMoney, setUserMoney] = React.useState();
    const [toBuy, setToBuy] = React.useState({
        stock: ' ',
        quantity: 0
    });
    const [stockData, setStockData] = React.useState({});

    const userData = React.useContext(localUserDataContext)
    const arrayOfStock = Object.entries(userData.own_shares);

    const clearInputs = () => {
        setToBuy(prev => ({
            ...prev,
            stock : '' , quantity : 0
        }));
    }
    
    async function lookUp(symbol) {
        const data = await fetchStockData(symbol); // Replace with the desired stock symbol
        if (data !== undefined) {
            return data
        }
    }
        
    React.useEffect(() => {
        console.log(`refreshed ${userMoney}$`)
        setUserMoney(userData.money)
    }, [toBuy])
    
    console.log(userData.id)

    const onSubmitBuy = async event => {
        event.preventDefault();
        clearInputs();
        let stockPrice = await lookUp(toBuy.stock);
        let overallPrice = Math.round((stockPrice.c * toBuy.quantity) * 100 ) / 100;
        if(stockPrice.c && stockPrice.h && stockPrice.l !== 0) { // CHECK IF STOCK EXISTS 
            if(userMoney >= overallPrice) {  // CHECK IF USER HAS MONEY
                
            }
        }

    }
    async function addData(id) {
        const { error } = await supabase
            .from('login')
            .update({ own_shares: userData.own_shares, money: userMoney })
            .eq('id', id)
    }

    const onChangeBuy = event => {
        if (event.target.type === 'text') {

            setToBuy(prev => ({
                ...prev,
                stock: event.target.value
            }))
        }
        if (event.target.type === 'number') {
            setToBuy(prev => ({
                ...prev,
                quantity: event.target.value
            }))
        }
    }





    return (
        <div>
            <h1>BUY</h1>
            <div className='flex justify-center'>
                <form onSubmit={onSubmitBuy}>
                    <input type='text' value={toBuy.stock} onChange={onChangeBuy} required className='border' />
                    <input type='number' value={toBuy.quantity} onChange={onChangeBuy} required className='border' />
                    <input type='submit' className='border' />
                </form>
            </div>
        </div>
    )
}