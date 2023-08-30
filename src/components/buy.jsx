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
    const dataArr = Object.entries(userData.own_shares);

    const clearInputs = () => {
        setToBuy(prev => ({
            ...prev,
            stock: '', quantity: ''
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
    }, [])

    async function addData(id, updatedMoney) {
        const { error } = await supabase
            .from('login')
            .update({ own_shares: userData.own_shares, money: updatedMoney })
            .eq('id', id)
    }

    const onSubmitBuy = async event => {
        event.preventDefault();
        clearInputs();
        let stockPrice = await lookUp(toBuy.stock);
        let totalCost = Math.round((stockPrice.c * toBuy.quantity) * 100) / 100;
        if (stockPrice.c && stockPrice.h && stockPrice.l !== 0) { // CHECK IF STOCK EXISTS 
            if (userMoney >= totalCost) {  // CHECK IF USER HAS MONEY
                let matchFound = false;
                for (let i = 0; i < dataArr.length; i++) {
                    if (toBuy.stock.trim() === dataArr[i][0].toString().trim()) { // CHECK IF STOCK TO BUY IS ALREADY IN PORTFOLIO
                        let stockQuantity = dataArr[i][1] + parseInt(toBuy.quantity);
                        userData.own_shares[dataArr[i][0]] = stockQuantity; // Wrong way should use set
                        matchFound = true;
                        const updatedMoney = userMoney - totalCost;
                        setUserMoney(updatedMoney);
                        await addData(userData.id, updatedMoney);
                        break;
                    } else {

                    }
                }
                if (!matchFound && stockPrice.c <= userMoney) {
                    const updatedMoney = userMoney - totalCost;
                    addData(userData.id, updatedMoney);
                    userData.own_shares[toBuy.stock] = parseInt(toBuy.quantity)
                }

            } else {
                console.log('No Money :(');
            }
        }
    }

    const onChangeBuy = event => {
        if (event.target.type === 'text') {
            setToBuy(prev => ({
                ...prev,
                stock: event.target.value.toUpperCase()
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
                    <input
                        type='text'
                        value={toBuy.stock}
                        onChange={onChangeBuy}
                        required
                        className='border'
                    />
                    <input
                        type='number'
                        value={toBuy.quantity}
                        onChange={onChangeBuy}
                        min={1}
                        required
                        className='border'
                    />
                    <input type='submit' className='border' />
                </form>
            </div>
        </div>
    )
}