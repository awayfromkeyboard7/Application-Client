import { useState, useEffect } from 'react';
import { Grid } from 'react-loader-spinner';
import Item from './item';
import styles from '../../styles/components/match.module.scss';

export default function MatchBox({ teamA, teamB, onClickGoToMain }) {
  const [countdown, setCountdown] = useState(0);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if(teamB.length !== 0) {
      setIsMatching(true);
      setCountdown(0);
    }
  }, [teamB]);

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
      {
        isMatching
        ? <div className={styles.countdown}>🤝🏻 팀전 매칭이 완료되었습니다!<div>{`${0 < 5 - countdown ? 5 - countdown : 1}초뒤에 게임이 시작됩니다.`}</div></div>
        : <div className={styles.countdown}>{secToTime(countdown)}</div>
      }
      <div className={styles.mainBody}> 
        <div className={styles.waitBox}>
        {
          teamA?.map(item => 
            <Item info={item} key={item.gitId} />
          )
        }
        </div>
        <div className={styles.waitBox}>
          {
            teamB.length === 0
            ? <div className={styles.loadingBox}>
                <Grid 
                  height={60} 
                  width={60} 
                  color="#282A35" 
                  ariaLabel="loading" 
                />
                <div className={styles.text}>매칭 중..</div>
              </div>
            : teamB?.map(item => 
                <Item info={item} key={item.gitId} />
              )
          }
        </div>
      </div>
      <div className={styles.mainFooter}>
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
    </div>
  )
}