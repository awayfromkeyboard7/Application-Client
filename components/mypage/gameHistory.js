import { useState, useEffect, useRef } from 'react';
import GameBox from './gameBox';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameHistory({ gameLogs, ranking, myInfo }) {
  const listRef = useRef();
  const [gameLogIdx, setGameLogIdx] = useState(10);
  // const [gameLogIdx, setGameLogIdx] = useState(gameLogs.length);

  const [filter, setFilter] = useState('all');

  const onScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    // console.log('on scroll e >>> ', scrollHeight, clientHeight, scrollTop);
    if((scrollHeight - scrollTop) < clientHeight + 180) {
      setGameLogIdx(prev => {
        if(prev + 5 < gameLogs.length) {
          return prev + 5;
        }
        return gameLogs.length;
      });
    }
  };

  return (
    <div className={styles.historyTab}>
      <div className={styles.gameHistoryHeader}>
        <div className={styles.gameHistoryHeaderLeft}>
          <div className={styles.title}>게임 기록</div>
        </div>
        <div className={styles.gameHistoryHeaderRight}>
          <div className={styles.filterBox}>
            <div className={filter === 'all' ? styles.filterBtnActive : styles.filterBtn} onClick={() => setFilter('all')}>전체</div>
            <div className={filter === 'solo' ? styles.filterBtnActive : styles.filterBtn} onClick={() => setFilter('solo')}>개인전</div>
            <div className={filter === 'team' ? styles.filterBtnActive : styles.filterBtn} onClick={() => setFilter('team')}>팀전</div>
          </div>
        </div>
      </div>
      <div className={styles.gameHistoryBody} ref={listRef} onScroll={onScroll}>
      {
        gameLogs?.map((gameLogId, idx) => 
          <GameBox gameLogId={gameLogId} gameLogIdx={gameLogIdx} idx={idx} filter={filter} key={gameLogId} ranking={ranking} myInfo={myInfo} />
        )
      }
      </div>
    </div>
  )
}