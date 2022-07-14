import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Item from './item';
import styles from '../../styles/components/wait.module.scss';

export default function WaitBox({ type, players, onClickPlayAgain, onClickGoToMain }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if(0 < prev) return prev - 1;
        else return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const secToTime = (s) => {
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `⏳ ${min.substr(-2)}분 ${sec.substr(-2)}초 후 게임이 시작됩니다!`;
  };

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>{`${type === 'team' ? '팀' : '개인'}전`}</div>
      </div>
      <div className={styles.countdown}>{secToTime(countdown)}</div>
      <div className={styles.mainBody}> 
        <div className={styles.waitBox}>
        {
          players.map((item, idx) => 
            <Item info={item} key={`${item.id}${idx}`} />
          )
        }
        </div>
      </div>
      <div className={styles.mainFooter}>
        <div className={styles.btn} onClick={onClickPlayAgain}>게임 시작</div>
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
      {
        router?.query?.mode === 'team'
        && <div className={styles.floatingBtn}>🗣</div>
      }
    </div>
  )
}