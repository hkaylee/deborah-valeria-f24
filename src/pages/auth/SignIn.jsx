import React, {useState} from 'react'
import { auth } from '../fireBaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Navbar from '../components/Navbar';
import AuthDetails from './AuthDetails';


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signingIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential)
        }).catch((error) => {
            console.log(error)
        })
    }

  return (
    <div className="sign-in pt-20">
      <Navbar />
      

      <form onSubmit={signingIn} className="mt-16">
        <h1> Log In</h1>
        <input type="email" placeholder = "Enter your email" value={email} onChange = {(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder = "Enter your password" value={password} onChange = {(e) => setPassword(e.target.value)}></input>
        <button type="submit"> Log In </button> 
      </form>

      <AuthDetails />
    </div>
  )
}

export default SignIn
