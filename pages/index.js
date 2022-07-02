import { useState, useEffect } from 'react';
import Image from 'next/image'
import Layout from '../components/layouts/lobby';
import Popup from '../components/popup';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [countdown, setCountdown] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    const date = new Date('2022-07-05T13:00:00');

    const interval = setInterval(() => {
      setCountdown(date - new Date());
      console.log(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const unixToTime = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = "0" + (date.getMonth()+1);
    const day = date.getDate();
    const hour = "0" + date.getHours();
    const min = "0" + date.getMinutes();
    const sec = "0" + date.getSeconds();
    
    return `D-${day}  ${hour.substr(-2)} : ${min.substr(-2)} : ${sec.substr(-2)}`;
  };

  return (
    <Layout>
      <div className={styles.mainBox}>
        <div className={styles.mainTitle}>SW Jungle 코딩 대회</div>
        <div className={styles.countdownTime}>{unixToTime(countdown)}</div>
        {
          isLogin
          ? <div className={styles.mainBtn} onClick={() => setIsLogin(prev => !prev)}>참가 신청</div>
          : <div className={styles.loginBtn}  onClick={() => setIsLogin(prev => !prev)}>
              <Image src="/github.png" alt="github Logo" width={30} height={30} />
              <div className={styles.loginText}>로그인</div>
            </div>
        }
      </div>
      <div className={styles.floatingBtn}>🤔</div>
      {
        isPopup
        ? <Popup close={() => setIsPopup(false)} />
        : null
      }
    </Layout>
  )
}
