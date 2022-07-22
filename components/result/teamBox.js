import { useState, useEffect } from 'react';
import Item from './teamItem';
import styles from '../../styles/components/result.module.scss';

export default function TeamResultBox({ ranks, startAt, onClickPlayAgain, onClickGoToMain }) {
  const [maxTeamLength, setMaxTeamLength] = useState(1);

  useEffect(() => {
    ranks.map(team => {
      setMaxTeamLength(prev => {
        if(prev < team.length) {
          return team.length;
        } else {
          return prev;
        }
      })
    })
  }, [ranks]);

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>팀전 결과</div>
      </div>
      <div className={styles.mainBody}> 
        <div className={styles.resultBox}>
        {
          ranks?.map((item, idx) => 
            <Item teamInfo={item} startAt={startAt} maxLength={maxTeamLength} key={item[0].gitId} idx={idx} />
          )
        }
        </div>
      </div>
      <div className={styles.mainFooter}>
        <div className={styles.btn} onClick={onClickPlayAgain}>한번 더 하기</div>
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
    </div>
  )
}