import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '../config/supabaseClient';
import fetchStockData from '../fetchStockData';
import { localUserDataContext, localUserIDCOntext } from '../context/localUserDataContext';

export default function Buy(props) {
    const [showError, setShowError] = React.useState(false);
    const [userMoney, setUserMoney] = React.useState();
    const [toBuy, setToBuy] = React.useState({
        stock: '',
        quantity: 0
    });
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
                    userData.own_shares[toBuy.stock.toString()] = parseInt(toBuy.quantity)
                }

            } else {
                setShowError(true);
            }
        } else {
            setShowError(true);
        }
    }

    const onChangeBuy = event => {
        setShowError(false)
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

    const errorComponent = <h1 className='flex justify-center text-xl text-red-500 mt-4'>Your transaction cannot be complited</h1>

    return (
        <div className='mt-16'>
            <h1 className='flex justify-center text-xl mb-2'>Buy your shares</h1>
            <div className='flex justify-center'>
                <form onSubmit={onSubmitBuy} className='flex flex-col items-center'>
                    <div className='flex flex-row items-center mb-2'>
                        <label className='text-l'>Symbol: </label>
                        <input
                            type='text'
                            placeholder='Enter Symbol'
                            value={toBuy.stock}
                            onChange={onChangeBuy}
                            required
                            className='ml-2 w-60 h-7 border-sky-700 border-b-2 pl-2'
                        />
                    </div>
                    <div className='flex flex-row items-center'>
                        <label className='mr-2 text-l' >Quantity: </label>
                        <input
                            type='number'
                            placeholder='Quantity'
                            value={toBuy.quantity}
                            onChange={onChangeBuy}
                            min={1}
                            required
                            className='w-60 h-7 mr-2 border-sky-700 border-b-2 pl-2'
                        />
                    </div>
                    <input type='submit' value='Buy' className='border mt-2 ml-8 w-32 h-8 rounded bg-blue-500 hover:bg-blue-600 text-white' />
                    {showError && errorComponent}
                </form>
            </div>
        </div>
    )
}