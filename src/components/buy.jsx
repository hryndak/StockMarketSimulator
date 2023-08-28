import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '../config/supabaseClient';
import fetchStockData from '../fetchStockData';
import { localUserDataContext, localUserIDCOntext } from '../context/localUserDataContext';

export default function Buy(props) {
    const [price, setPrice] = React.useState(0);
    const [userMoney, setUserMoney] = React.useState();
    const [toBuy, setToBuy] = React.useState({
        stock: ' ',
        quantity: 0
    });
    const [stockData, setStockData] = React.useState({});

    const userData = React.useContext(localUserDataContext)

    React.useEffect(() => {
        setUserMoney(userData.money)
    }, [])

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
    
    
    const arrayOfStock = Object.entries(userData.own_shares);
    
    
    const onSubmitBuy = async event => {
        event.preventDefault();
        
        const data = await fetchStockData(toBuy.stock);
        
        if (data !== undefined) {
            setStockData(data);
            
            if (data.c && data.l && data.h !== 0) {
                const totalCost = data.c * toBuy.quantity;
                
                let matchFound = false;
                for (let i = 0; i < arrayOfStock.length; i++) {
                if (toBuy.stock === arrayOfStock[i][0]) {
                    if (stockData.c <= userMoney && userMoney !== undefined) {
                        let sumQuantity = arrayOfStock[i][1] + parseInt(toBuy.quantity);
                        userData.own_shares[arrayOfStock[i][0]] = sumQuantity;
                        setUserMoney(prevState => prevState - (stockData.c * toBuy.quantity))
                        addData();
                        matchFound = true;
                        props.handleHelpSubmit();
                    } else {
                        console.log('No money');
                        break;
                    }
                }
            }
        }
            if (!matchFound) {
                if (stockData.c <= userMoney) {
                    setUserMoney(prevState => prevState - (stockData.c * toBuy.quantity))
                    addData();
                    userData.own_shares[toBuy.stock] = parseInt(toBuy.quantity)
                    console.log("ADDED");
                } else {
                    console.log('No money');
                }
            }
        }
    }
    
    async function addData() {
        const { error } = await supabase
            .from('login')
            .update({ own_shares: userData.own_shares, money: userMoney })
            .eq('id', userData.id)

    }


    return (
        <div>
            <h1>BUY</h1>
            <div className='flex justify-center'>
                <form onSubmit={onSubmitBuy}>
                    <input type='text' onChange={onChangeBuy} required className='border' />
                    <input type='number' onChange={onChangeBuy} required className='border' />
                    <input type='submit' className='border' />
                </form>
            </div>
        </div>
    )
}