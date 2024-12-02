import "@/styles/globals.css";
import type { AppProps } from "next/app";
import './pawlseStyles.css'; // This is your global CSS file

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
