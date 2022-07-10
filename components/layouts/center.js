import Head from 'next/head';
import styles from '../../styles/layouts/center.module.scss';

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
        <div className={styles.children}>{children}</div>
      </main>
    </div>
  )
}