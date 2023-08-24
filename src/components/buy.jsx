import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '../config/supabaseClient';
import fetchStockData from '../fetchStockData';
import { localUserDataContext ,localUserIDCOntext } from '../context/localUserDataContext';

export default function Buy(props) {
    const [price, setPrice] = React.useState();
    const [toBuy, setToBuy] = React.useState({
        stock: ' ',
        quantity: 0
    });

    const data = React.useContext(localUserDataContext)

    console.log(price);

    const tmp = data.own_shares;

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
    
    //ADD :
    // CHECK IF STOCK EXIST
    // CHECK IF ALREADY STOCK HAS BEEN BOUGHT
    // UPDATE MONEY

    if(data.own_shares.hasOwnProperty(toBuy.stock)) {
        console.log(toBuy.stock)
    }

    const onSubmitBuy = async event => {
        event.preventDefault();
        async function fetchData() {
            const data = await fetchStockData(toBuy.stock);
            if (data !== undefined) {
                setPrice(data.c); // Update state with fetched data
                tmp[toBuy.stock] = parseInt(toBuy.quantity)
                //addData();
            }
        }
        fetchData();
    }

    async function addData() {
        const { error } = await supabase
            .from('login')
            .update({own_shares : tmp})
            .eq('id',data.id)

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