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

    const userData = React.useContext(localUserDataContext)

    React.useEffect(() => {
        setUserMoney(userData.money)
    }, [])


    console.log(userMoney);

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


    const arrayOfStock = Object.entries(userData.own_shares);


    const onSubmitBuy = async event => {
        event.preventDefault();
        async function fetchData() {
            const data = await fetchStockData(toBuy.stock);
            if (data !== undefined) {
                if (data.c && data.l && data.h !== 0) {
                    let matchFound = false;
                    for (let i = 0; i < arrayOfStock.length; i++) {
                        //console.log("Comparing:", toBuy.stock, arrayOfStock[i][0]);
                        if (toBuy.stock === arrayOfStock[i][0]) {
                            if (data.c <= userMoney) {
                                let ownQuantity = 0;
                                ownQuantity = arrayOfStock[i][1];
                                let sumQuantity = ownQuantity + parseInt(toBuy.quantity);
                                userData.own_shares[arrayOfStock[i][0]] = sumQuantity;
                                setUserMoney(prevState => prevState - (data.c * toBuy.quantity))
                                matchFound = true;
                            } else {
                                console.log('No money');
                                break;
                            }
                        }
                    }
                    if (!matchFound) {
                        setPrice(data.c); // Update state with fetched data

                        userData.own_shares[toBuy.stock] = parseInt(toBuy.quantity)
                        console.log("ADDED");
                        //addData();
                    }
                }
            }
        }
        fetchData();
    }

    console.log(userMoney)

    async function addData() {
        const { error } = await supabase
            .from('login')
            .update({ own_shares: userData.own_shares })
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