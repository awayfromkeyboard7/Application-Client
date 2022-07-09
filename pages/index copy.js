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
    const date = new Date('2022-07-05T18:00:00+0900').getTime();

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
    if(ts <= 0) return 'D-day  00 : 00 : 00';
    const day = Math.floor(ts / (1000 * 60 * 60 * 24));
    const hour = "0" + Math.floor((ts % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const min = "0" + Math.floor((ts % (1000 * 60 * 60)) / (1000 * 60));
    const sec = "0" + Math.floor((ts % (1000 * 60)) / 1000);
    
    return `D-${day ? day : 'day'}  ${hour.substr(-2)} : ${min.substr(-2)} : ${sec.substr(-2)}`;
  };

  return (
    <Layout>
      <div className={styles.mainBox}>
        <div className={styles.mainTitle}>SW Jungle 코딩 대회</div>
        <div className={styles.countdownTime}>{unixToTime(countdown)}</div>
        {/* <div className={isLogin ? styles.info : styles.hidden}>🧑🏻‍💻9256명이 대회를 기다리고 있어요⏳</div> */}
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
        ? <Popup 
            title="아쉽지만 다음 기회에.."
            content="문제를 틀렸습니다."
            label="메인으로"
            onClick={() => setIsPopup(false)} 
          />
        : null
      }
    </Layout>
  )
}
