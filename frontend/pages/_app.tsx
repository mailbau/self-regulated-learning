import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { loadAccessTokenFromStorage } from "@/lib/api/client";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    loadAccessTokenFromStorage();
  }, []);

  return <Component {...pageProps} />;
}
