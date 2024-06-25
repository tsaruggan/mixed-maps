import Head from "next/head";

import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

import RouteBuilder from "@/components/RouteBuilder";

export default function Home() {
  return (
    <>
      <Head>
        <title>Mixed Maps</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <RouteBuilder />
      </main>
    </>
  );
}
