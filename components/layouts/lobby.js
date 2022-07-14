import Head from 'next/head';
import styles from '../../styles/layouts/lobby.module.scss';

export default function Lobby({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Code IDE</title>
        <meta name="description" content="Online Judge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.children}>{children}</div>
    </div>
  )
}