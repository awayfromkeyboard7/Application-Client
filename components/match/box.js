import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid } from 'react-loader-spinner';
import Item from './item';
import styles from '../../styles/components/match.module.scss';

export default function MatchBox({ players, onClickGoToMain }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(180);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCountdown(prev => {
  //       if(0 < prev) return prev - 1;
  //       else return prev;
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const secToTime = (s) => {
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `팀전 대기 중...${min.substr(-2)}분 ${sec.substr(-2)}초 ⏳`;
  };

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>팀전</div>
      </div>
      <div className={styles.countdown}>{secToTime(countdown)}</div>
      <div className={styles.mainBody}> 
        <div className={styles.waitBox}>
        {
          players?.map(item => 
            <Item info={item} key={item.gitId} />
          )
        }
        </div>
        <div className={styles.waitBox}>
          <div className={styles.loadingBox}>
            <Grid 
              height={60} 
              width={60} 
              color="#282A35" 
              ariaLabel="loading" 
            />
            <div className={styles.text}>매칭 중..</div>
          </div>
        </div>
      </div>
      <div className={styles.mainFooter}>
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
      {
        router?.query?.mode === 'team'
        && <div className={styles.floatingBtn}>🗣</div>
      }
    </div>
  )
}