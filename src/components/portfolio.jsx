import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React, { useContext } from 'react'
import '/src/index.css'
import { localUserDataContext } from '../context/localUserDataContext'
import fetchStockData from '../fetchStockData'

export default function Portfolio(props) {

    const localUserData = useContext(localUserDataContext);
    const arrayofUserData = Object.entries(localUserData.own_shares);
    const [stockData, setStockData] = React.useState(null);

    React.useEffect(() => {
        for (let i = 0; i < arrayofUserData.length; i++) {
            let currentSymbol = arrayofUserData[i][0];
            async function fetchData() {
                const data = await fetchStockData(currentSymbol); // Replace with the desired stock symbol
                if (data !== undefined) {
                    setStockData(prev => ({
                        ...prev,
                        [currentSymbol]: data.c
                    })); // Update state with fetched data
                }
            }
            fetchData(); // Call the fetchData function when the component mounts
        }
    }, []);

    return (
        <div className='flex justify-center mt-6'>
            <table className='w-full'>
                <thead className='bg-zinc-200'>
                    <tr>
                        <th>Symbol</th>
                        <th>Shares</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody >
                    {
                        arrayofUserData.map((ele) => (
                            <tr className='bg-slate-100'>
                                <th>{ele[0]}</th>
                                <th>{ele[1]}</th>
                                <th>{stockData && stockData[ele[0]]} <span className='text-green-500'>$</span></th>
                                <th>{stockData && stockData[ele[0]] * ele[1]} <span className='text-green-500'>$</span></th>
                            </tr>
                        ))
                    }
                </tbody>
                {localUserData.money}
            </table>
        </div>
    )
}