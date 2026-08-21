import { Html, Head, Main, NextScript } from "next/document";
import { THEME_STORAGE_KEY } from "@/providers/ThemeProvider";

/*
 * Runs before first paint. Without it the page renders light, then the theme
 * effect flips it to dark a frame later — a visible flash on every load.
 */
const noFlashTheme = `(function(){try{var p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=p==="dark"||((!p||p==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
