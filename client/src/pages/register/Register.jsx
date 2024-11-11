import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [userDetails, setUserDetails] = useState({ 
        userName : "",
        email : "",
        password : "",
     })
     const navigate = useNavigate()

     
     const handleChanges = (e)=>{
         const {name, value} = e.target;
         setUserDetails((prevDetails) => ({
             ...prevDetails,
             [name]: value
            }));
        }
        
       const handleSubmit = async (e)=>{
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:3030/api/v1/auth/register', userDetails);
            if (res.data.success === true) {
                const token = res.data.token;
                localStorage.setItem('token', token);
                navigate('/home');
            } else{
                console.log(res.data.message)
            }
        
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    console.error('Error:', error.response.data.message);
                } else {
                    console.error('Unexpected error:', error.response.data.message);
                }
            } else {
                console.error('Network error:', error.message);
            }
        }
       }



  return (
    <>

        <form onSubmit={handleSubmit}> 
            <input 
            type="text" 
            placeholder='Username' 
            required 
            name='userName' 
            onChange={handleChanges}
            />   
            <br />

            <input 
            type="email" 
            placeholder='E-mail' 
            required  
            name='email' 
            onChange={handleChanges}
            />      
            <br />

            <input 
            type="password" 
            placeholder='Password'
            required  
            name='password'
            onChange={handleChanges}
            /> 
            <br />


            <button>Submit</button>
        </form>
    </>
  )
}

export default Register