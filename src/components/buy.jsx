import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '../config/supabaseClient';
import fetchStockData from '../fetchStockData';
import { localUserDataContext } from '../context/localUserDataContext';

export default function Buy(props) {
    const [price, setPrice] = React.useState();
    const [toBuy, setToBuy] = React.useState({
        stock: ' ',
        quantity: 0
    });

    const data = React.useContext(localUserDataContext)
    console.log(data);

    const tmp = data;

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

    console.log(toBuy.stock, price);


    console.log(tmp);

    async function addData() {
        const { error } = await supabase
            .from('login')
            .update({own_shares : tmp})
            .eq('id',50)

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