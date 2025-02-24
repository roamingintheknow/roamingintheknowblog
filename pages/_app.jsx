import '../app/styles/globals.css'
import '../app/styles/App.css';
import '../app/styles/text.css';
import '../app/styles/effects.css';
import '../app/styles/speechBubbles.css';
import '../app/styles/borders.css';
import '../app/styles/colours.css';
import '../app/styles/elements.css';
import '../app/styles/errors.css';
import '../app/styles/form.css';
import '../app/styles/images.css';
import '../app/styles/layout.css';

import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}