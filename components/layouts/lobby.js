import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/layouts/lobby.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Code IDE</title>
        <meta name="description" content="Online Judge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.background}></div>
        {/* <Image src={'/images/splash_logo_black@3x.png'} width={200} height={80} /> */}
        <div className={styles.children}>{children}</div>
      </main>
    </div>
  )
}