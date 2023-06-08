import { Html, Head, Main, NextScript } from 'next/document'
import * as gtag from '../components/Analytics/gtag'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
        }}
      />
      <Head />
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
