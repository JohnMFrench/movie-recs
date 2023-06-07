import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { Inter } from 'next/font/google'

import ReactGA from 'react-ga';
  const TRACKING_ID = "G-4418WHS1MY"; // OUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);

const inter = Inter({ subsets: ['latin'] })

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component className={roboto.className} {...pageProps} />
    </>
  )
}
