import React from "react";
import Head from "next/head";
function Layor({ children }) {
  return (
    <div>
      <Head>
        <title>Music player</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
    </div>
  );
}

export default Layor;