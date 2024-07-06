import Head from "next/head";

import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

import RouteBuilder from "@/components/RouteBuilder";
import RouteOverview from "@/components/RouteOverview";
import ErrorModal from "@/components/ErrorModal";

import { useState, useEffect } from 'react';

import { fetchRoute } from "@/utils/requests";

export default function Home() {
  const [route, setRoute] = useState({ directions: null, duration: null, eta: null });
  const [error, setError] = useState(null);

  const onRoute = async (addresses, modes) => {
    try {
      const newRoute = await fetchRoute(addresses, modes);
      setRoute(newRoute);
    } catch (error) {
      console.error("Error in fetching route:", error);
      const errorMessage = "It seems the addresses entered were either invalid or could not be processed. Try again by pasting the full correct addresses."
      setError(errorMessage);
      setRoute({ directions: null, duration: null, eta: null });
    } 
  }

  const handleCloseModal = () => {
    setError(null);
  };

  return (
    <>
      <Head>
        <title>Mixed Maps</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.panelContainer}>
          <RouteBuilder onRoute={onRoute} />
          <RouteOverview route={route} />
        </div>
        {error && <ErrorModal message={error} onClose={handleCloseModal} />}
      </main>
    </>
  );
}
