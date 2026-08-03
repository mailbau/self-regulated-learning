import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { loadAccessTokenFromStorage } from "@/lib/api/client";
import { useEffect } from "react";
import DemoBanner from "@/components/DemoBanner";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    loadAccessTokenFromStorage();
  }, []);

  return (
    <>
      <DemoBanner />
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
