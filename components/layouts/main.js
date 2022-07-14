import Head from 'next/head';
import styles from '../../styles/layouts/main.module.scss';

export default function Main({ header, body }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Code IDE</title>
        <meta name="description" content="Online Judge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>{header}</div>
      <div className={styles.body}>{body}</div>
    </div>
  )
}