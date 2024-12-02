import React, {useState} from 'react'
import { auth } from '../fireBaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Navbar from "../components/Navbar";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signingUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential)
        }).catch((error) => {
            console.log(error)
        })
    }

  return (
    <div className="sign-up pt-20">
        <Navbar></Navbar>

      <form onSubmit={signingUp} className="mt-16">
        <h1> Create an account</h1>
        <input type="email" placeholder = "Enter your email" value={email} onChange = {(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder = "Enter your password" value={password} onChange = {(e) => setPassword(e.target.value)}></input>
        <button type="submit"> Sign Up </button> 
      </form>
    </div>
  )
}

export default SignUp
