import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  process.env.API_PROVIDER = process.env.NEXT_PUBLIC_API_PROVIDER;
  process.env.SOCKET_PROVIDER = process.env.NEXT_PUBLIC_SOCKET_PROVIDER;
  return <Component {...pageProps} />
}

export default MyApp
