'use client'
import { useEffect, useState } from 'react';
import { db } from './fireBaseConfig';
import { collection, addDoc, getDocs } from "firebase/firestore";
import LineChartComponent from './components/LineChart';
import Alert from './components/Alert';
import Script from 'next/script';
import Link from 'next/link';
import Navbar from './components/Navbar';



import Head from 'next/head';

const IndexPage = () => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto+Slab:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
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

      <div className="hero"> 
        <div className="content">
          <h1>Check your Pawlse</h1>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
