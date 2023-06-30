import '@/styles/globals.css'
import { Roboto } from 'next/font/google'
import { Inter } from 'next/font/google'
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import Grid from './grid';

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
      <Analytics />
    </>
  )
}
