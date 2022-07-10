import { useState, useEffect } from 'react';
import Image from 'next/image'
import Layout from '../../components/layouts/center';
import Ranking from '../../components/rank/list';
import styles from '../../styles/pages/End.module.scss'

export default function Home() {
  const [countdown, setCountdown] = useState(0);
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    setRanks([
      {
        rank: 1,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 2,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 3,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 4,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 5,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 6,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 7,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 8,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 9,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 10,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 11,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 12,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 13,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 14,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 15,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
    ])

    const date = new Date('2022-07-04T00:00:00+0900').getTime();

    const interval = setInterval(() => {
      setCountdown(date - new Date().getTime());
      console.log('d-day : ', date);
      console.log(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const unixToTime = (ts) => {
    const day = Math.floor(ts / (1000 * 60 * 60 * 24));
    const hour = "0" + Math.floor((ts % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const min = "0" + Math.floor((ts % (1000 * 60 * 60)) / (1000 * 60));
    const sec = "0" + Math.floor((ts % (1000 * 60)) / 1000);
    
    return `${hour.substr(-2)} : ${min.substr(-2)} : ${sec.substr(-2)}`;
  };

  return (
    <Layout>
      <div className={styles.mainRow}>
        <div className={styles.mainBox}>
          <div className={styles.mainTitle}>대회 진행중..⏳</div>
          <div className={styles.countdownTime}>{unixToTime(countdown)}</div>
        </div>
        <Ranking ranks={ranks} />
      </div>
      <div className={styles.scrollBox}>
        <div className={styles.text}>🗓 다음 대회는 언제지?</div>
        <Image src='/scroll_down.png' width={70} height={60} className={styles.scrollBtn} />
      </div>
    </Layout>
  )
}
