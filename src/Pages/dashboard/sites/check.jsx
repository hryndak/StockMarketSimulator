import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'

export default function Check(props) {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <input type='text' onClick={props.handleChange} className='border-2' />
                <input type='submit' className='border-2' />
            </form>
        </div>
    )
}
