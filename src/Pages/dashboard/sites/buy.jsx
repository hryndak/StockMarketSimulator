import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'

export default function Buy(props) {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <input type='text' onChange={props.handleChange} className='border-2'/>
                <input type='number' onChange={props.handleChange} className='border-2'/>
                <input type='submit' onChange={props.handleChange} className='border-2'/>
            </form>
        </div>
    )
}
