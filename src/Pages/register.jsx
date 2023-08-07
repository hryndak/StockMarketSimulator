import { Routes, Route,Link } from 'react-router-dom'
import React from 'react'
import '/src/index.css'
import supabase from '/src/config/supabaseClient'

export default function Register(props) {

    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [taken, setTaken] = React.useState(false);

    const userExistsTitle = '<h1>That user already exists</h1>';


    const handleChange = event => {
        if (event.target.type === 'email') {
            setEmail(event.target.value);
            setTaken(false);
        }
        for (let i = 0; i < props.data.length; i++) {
            if (email === props.data[i].email) {
                setTaken(true);
            }
        }
        if (event.target.type === 'password') {
            setPassword(event.target.value);
        }
    }

    console.log(taken);

    const handleSubmit = async event => {
        if (!taken) {
            const { error } = await supabase
            .from('login')
            .insert({ email: email, password: password })
        } else {
            event.preventDefault();
            console.log('taken')
        }
    }


    return (
        <div>
            <div className='bg-gray-500 h-screen flex text-center items-center justify-center'>
                <form onSubmit={handleSubmit} className='' >
                    {taken && userExistsTitle}
                    <input onChange={handleChange} required type='email' placeholder='E-mail' className='placeholder:italic placeholder:text-slate-400 p-4 mb-2 w-72 h-10 rounded-md ' />
                    <br />
                    <input onChange={handleChange} required type='password' placeholder='Password' className='placeholder:italic placeholder:text-slate-400 p-4 mb-2 w-72 h-10 rounded-md ' />
                    <br />
                    <input type='submit' value='Register' className='hover:cursor-pointer hover:bg-gray-200 w-32 h-8 rounded bg-white' />
                    <Link to="/login">Login in</Link>
                </form>
            </div>

        </div>
    )
}
