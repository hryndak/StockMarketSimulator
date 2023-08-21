import { Routes, Route, Link } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Register(props) {

    const userExistsTitle = <label className='block mb-2 text-lg text-red-500'>That user already exists</label>;


    return (
        <div>
            <div className='bg-pink-700 h-screen flex text-center items-center justify-center'>
                <div className='w-96 h-96 bg-neutral-200 rounded backdrop-blur-xs flex justify-center items-center'>
                    <form onSubmit={props.handleSubmitRegister} className='' >
                        <div className='flex justify-center items-center'>
                            <img src='src/assets/stock.png' className='w-10 mb-4'></img>
                        </div>
                        {props.taken && userExistsTitle}
                        <input onChange={props.handleChangeRegister} required type='email' placeholder='E-mail' className='placeholder:italic placeholder:text-slate-400 border-b-2 border-sky-700 p-4 mb-2 w-72 h-10 outline-0 bg-neutral-200 mt-' />
                        <br />
                        <input onChange={props.handleChangeRegister} required type='password' placeholder='Password' className='placeholder:italic placeholder:text-slate-400 p-4 mb-2 w-72 h-10 border-b-2 border-sky-700 outline-0 bg-neutral-200 mt-2 ' />
                        <br />
                        <input type='submit' value='Register' className='hover:cursor-pointer hover:bg-sky-600 w-36 h-10 bg-sky-800 text-zinc-100 mt-4' />
                        <div className='mt-4  '>
                            <label >Already memeber?</label>
                            <Link className='ml-2 underline decoration-sky-500' to="/login">Login in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
