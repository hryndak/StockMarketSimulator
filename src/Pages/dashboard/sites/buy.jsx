import { Routes, Route, Link, Navigate } from 'react-router-dom'
import React from 'react'
import '/src/index.css'

export default function Buy(props) {

    return (
        <div>
            <form >
                <input type='text'  required className='border-2'/>
                <input type='number'  required min={0} className='border-2'/>
                <input type='submit' className='border-2'/>
            </form>
        </div>
    )
}
