'use client'
import { useEffect, useState } from 'react';
import { db } from './fireBaseConfig';
import { collection, addDoc, getDocs } from "firebase/firestore";
import LineChartComponent from './components/LineChart';
import Alert from './components/Alert';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from './components/Navbar';


  const IndexPage = () => {
    return (
    <>
      
      <Script id="chatling-config" strategy="afterInteractive">
        {`window.chtlConfig = { chatbotId: "7362981259" };`}
      </Script>
      <Script
        src="https://chatling.ai/js/embed.js"
        strategy="afterInteractive"
        data-id="7362981259"
        id="chatling-embed-script"
      />

      <Navbar />

      <div className="hero "> 
      <div className="content">
        <h1> Keep your pets' tails wagging</h1>
        
      </div>
      
      </div>
      

      </>
    )
  }

      
      


export default IndexPage;