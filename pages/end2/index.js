import { useState, useEffect } from 'react';
import Layout from '../../components/layouts/center';
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

  return (
    <Layout>
        <div className={styles.mainBox}>
          <div className={styles.scheduleBox}>
            <div className={styles.dateBox}>
              <div className={styles.date}>7</div>
              <div className={styles.month}>July</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoTitle}>팀스파르타 코딩 대회</div>
              <div className={styles.infoText}>PM 6:00 ~ 7:00</div>
            </div>
          </div>
          <div className={styles.scheduleBox}>
            <div className={styles.dateBox}>
              <div className={styles.date}>12</div>
              <div className={styles.month}>July</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoTitle}>당근마켓 코딩 대회</div>
              <div className={styles.infoText}>AM 10:00 ~ 11:00</div>
            </div>
          </div>
          <div className={styles.scheduleBox}>
            <div className={styles.dateBox}>
              <div className={styles.date}>17</div>
              <div className={styles.month}>July</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoTitle}>크래프톤 코딩 대회</div>
              <div className={styles.infoText}>PM 2:00 ~ 3:00</div>
            </div>
          </div>
          <div className={styles.scheduleBox}>
            <div className={styles.dateBox}>
              <div className={styles.date}>28</div>
              <div className={styles.month}>July</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoTitle}>토스 코딩 대회</div>
              <div className={styles.infoText}>PM 4:00 ~ 5:00</div>
            </div>
          </div>
        </div>
    </Layout>
  )
}
