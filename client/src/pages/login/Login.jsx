import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [loginDetails, setLoginDetails] = useState({
        email : "",
        password : "",
    })
    const navigate = useNavigate()

    const handleChanges = (e)=>{
        const {name, value} = e.target;
        setLoginDetails((prevDetails) =>({
            ...prevDetails,
            [name] : value
        }))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:3030/api/v1/auth/login', loginDetails);
            console.log(res)
            if(res.data.success == true){
            const token = res.data.token;
            localStorage.setItem('token', token)
            navigate('/home')
            }else(
                console.log(error)
            )
        } catch (error) {
            console.log(error.response.data.message)
        }  
    }


  return (
    <>
    <form onSubmit={handleSubmit}>  
        <input 
        type="email" 
        name='email' 
        onChange={handleChanges}
        />
        <br />

        <input 
        type="password" 
        name='password'
        onChange={handleChanges}
        />
        <br />
        <button>Submit</button>
    </form>
    </>
  )
}

export default Login