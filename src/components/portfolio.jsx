import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React, { useContext } from 'react'
import '/src/index.css'
import { localUserDataContext } from '../context/localUserDataContext'
import fetchStockData from '../fetchStockData'

export default function Portfolio(props) {



    const localUserData = useContext(localUserDataContext);


    const arrayofUserData = Object.entries(localUserData);

    console.log(arrayofUserData)

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
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Stock</th>
                        <th>Shares</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        arrayofUserData.map((ele) => (
                            <tr>
                                <th>{ele[0]}</th>
                                <th>{ele[1]}</th>
                                <th>{stockData && stockData[ele[0]]}</th>
                                <th>{stockData && stockData[ele[0]] * ele[1]}</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}