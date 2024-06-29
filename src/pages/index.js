import Head from "next/head";

import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

import RouteBuilder from "@/components/RouteBuilder";
import RouteOverview from "@/components/RouteOverview";

import { useState, useEffect } from 'react';

export default function Home() {
  const [directions, setDirections] = useState([]);

  const fetchDirections = async () => {
    try {
      const response = await fetch('/api/directions');
      const directions = await response.json();
      console.log(directions);
      setDirections(directions);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  useEffect(() => {
    fetchDirections();
  }, []);

  return (
    <>
      <Head>
        <title>Mixed Maps</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.panelContainer}>
          <RouteBuilder />
          <RouteOverview directions={directions}/>
        </div>
      </main>
    </>
  );
}
