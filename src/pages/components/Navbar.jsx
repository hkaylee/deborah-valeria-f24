import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from '../fireBaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
        });

        return () => unsubscribe();
    }, []);

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('sign out successful');
        }).catch((error) => console.log(error));
    };

    return (
        <div className="flex items-center justify-between bg-green-600 p-3 w-full fixed top-0 left-0 z-50">
            <div className="flex items-center">
                <Link href="/">
                    <img src="/images/pawlse.png" alt="Logo" className="h-15 w-20" />
                </Link>
            </div>
            <div className="flex space-x-4"> 
                <Link href="/PetWeight">
                    <span className="text-white text-lg hover:text-yellow-300 cursor-pointer transition duration-300">Pet Weight</span>
                </Link>
                <Link href="/appointment">
                    <span className="text-white text-lg hover:text-yellow-300 cursor-pointer transition duration-300">Appointments</span>
                </Link>
            </div>
            <div className="flex space-x-4">
                {/* Conditionally render based on authentication status */}
                {authUser ? (
                    <>
                        <span className="text-white text-lg">Signed In as {authUser.email}</span>
                        <button onClick={userSignOut} className="text-white text-lg hover:text-yellow-300 cursor-pointer transition duration-300">
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/auth/SignIn">
                            <span className="text-white text-lg hover:text-yellow-300 cursor-pointer transition duration-300">Log In</span>
                        </Link>
                        <Link href="/auth/SignUp">
                            <span className="text-white text-lg hover:text-yellow-300 cursor-pointer transition duration-300">Get Started</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;