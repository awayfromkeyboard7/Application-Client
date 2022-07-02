import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  process.env.API_PROVIDER = process.env.NEXT_PUBLIC_API_PROVIDER;
  return <Component {...pageProps} />
}

export default MyApp
