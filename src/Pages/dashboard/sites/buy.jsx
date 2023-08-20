import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'

export default function Buy(props) {

    console.log("buy updated")

    const [a, setA] = React.useState();

    const handleChange = event => {
        setA(event.target.value)
        props.setBuyStock(event.target.value);
    }

    return (
        <div>
            <form onSubmit={props.handleSubmit} >
                <input type='text' onChange={handleChange}  required className='border-2'/>
                <input type='number'  required min={0} className='border-2'/>
                <input type='submit' className='border-2'/>
            </form>
        </div>
    )
}
