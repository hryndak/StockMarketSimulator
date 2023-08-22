import React, { useEffect } from 'react';

export default async function fetchStockData(stock) {
    let name = stock.toUpperCase();
    let url = `${import.meta.env.VITE_FINNHUB_URL}symbol=${name}${import.meta.env.VITE_FINNHUB_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}