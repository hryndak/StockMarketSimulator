import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import fetchStockData from '../fetchStockData';

export default function Check(props) {

    const [symbol,setSymbol] = React.useState();

    async function lookUp(symbol) {
        const data = await fetchStockData(symbol); // Replace with the desired stock symbol
        if (data !== undefined) {
            return data
        }
    }

    const handleSubmit = async event => {
        event.preventDefault();

        let stockPrice = await lookUp(symbol);

        props.setStockData({
            current : stockPrice.c,
            lowest : stockPrice.l,
            highest : stockPrice.h,
            symbol : symbol
        });

        props.setShowed(true);
    }

    const handleChange = event => {
        setSymbol(event.target.value.toUpperCase());
    }

    return (
        <div className='mt-16'>
            <h1 className='flex justify-center mb-4 text-2xl'>Check your stock prices</h1>
            <div className='flex justify-center'>
                <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                    <input type='text' onChange={handleChange} placeholder='Symbol' className='border-b-2 w-64 text-lg text-center border-sky-700  mb-4' />
                    <input type='submit' value='Check' className='flex justify-center h-10 w-36 bg-blue-500 text-white rounded hover:bg-blue-600' />
                </form>
            </div>
            <h1 className='flex justify-center text-2xl mt-4'>Today's prices:</h1>
        </div>
    )
}