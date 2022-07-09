import Head from 'next/head';
import styles from '../../styles/layouts/lobby.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Code IDE</title>
        <meta name="description" content="Online Judge" />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.children}>{children}</div>
    </div>
  )
}