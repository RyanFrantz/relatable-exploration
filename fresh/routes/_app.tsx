import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

// Set our style globally.
export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <meta name="author" content="frantz"/>
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css"/>
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
