import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

import RouteBuilder from "@/components/RouteBuilder";
import RouteOverview from "@/components/RouteOverview";
import ErrorModal from "@/components/ErrorModal";
import LoadingModal from "@/components/LoadingModal"; // Import the new LoadingModal component

import { useState } from 'react';

import { fetchRoute } from "@/utils/requests";

export default function Home() {
  const [route, setRoute] = useState({ directions: null, duration: null, eta: null });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onRoute = async (addresses, modes, dateTimeOption, dateTIme) => {
    setIsLoading(true);
    try {
      const newRoute = await fetchRoute(addresses, modes, dateTimeOption, dateTIme);
      setRoute(newRoute);
    } catch (error) {
      console.error("Error in fetching route:", error);
      const errorMessage = "It seems the addresses & timing combinations entered were either invalid or could not be processed. Try again by pasting the full correct addresses & make sure the timings make sense."
      setError(errorMessage);
      setRoute({ directions: null, duration: null, eta: null });
    } finally {
      setIsLoading(false);
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
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Mixed Maps" />
        <meta property="og:description" content="Plan your next route using multiple modes of transportation!" />
        <meta property="og:image" content="/social.jpeg" />
        {/* <meta property="og:url" content="https://yourdomain.com" /> */}
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.panelContainer}>
          <RouteBuilder onRoute={onRoute} />
          <RouteOverview route={route} />
        </div>
        {error && <ErrorModal message={error} onClose={handleCloseModal} />}
        {isLoading && <LoadingModal />} {/* Render LoadingModal when isLoading is true */}
      </main>
    </>
  );
}
