import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/layouts/project.module.scss';

export default function Layout({ sidebar, header, children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>머선일</title>
        <meta name="description" content="머선일 | 실시간 검색어/이슈를 확인하고 대화를 나눠보세요" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <div className={styles.sidebar}>
          {sidebar}
          <Image src={'/images/splash_logo_white@3x.png'} width={101} height={40} />
        </div>
        <div className={styles.home}>
          <div className={styles.header}>{header}</div>
          <div className={styles.children}>{children}</div>
        </div>
      </main>
    </div>
  )
}