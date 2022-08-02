import { useState, useEffect, useRef } from 'react';
import GameBox from './gameBox';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameHistory({ totalLogs, teamLogs, soloLogs }) {
  const listRef = useRef();
  const [gameLogs, setGameLogs] = useState([]);
  const [gameLogIdx, setGameLogIdx] = useState(20);
  // const [gameLogIdx, setGameLogIdx] = useState(gameLogs.length);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if(totalLogs) {
      setGameLogs(totalLogs);
    }
  }, [totalLogs]);

  const onChangeFilter = (select) => {
    switch(select) {
      case 'all':
        if(totalLogs) {
          setGameLogs(totalLogs);
        }
        break;
      case 'solo':
        if(soloLogs) {
          setGameLogs(soloLogs);
        }
        break;
      case 'team':
        if(teamLogs) {
          setGameLogs(teamLogs);
        }
        break;
    }
    setGameLogIdx(20);
    setFilter(select);
  };

  const onScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    // console.log('on scroll e >>> ', scrollHeight - scrollTop, clientHeight);
    if((scrollHeight - scrollTop) < clientHeight + 900) {
      setGameLogIdx(prev => prev + 10 < gameLogs.length ? prev + 10 : gameLogs.length);
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
            <div className={filter === 'all' ? styles.filterBtnActive : styles.filterBtn} onClick={() => onChangeFilter('all')}>전체</div>
            <div className={filter === 'solo' ? styles.filterBtnActive : styles.filterBtn} onClick={() => onChangeFilter('solo')}>개인전</div>
            <div className={filter === 'team' ? styles.filterBtnActive : styles.filterBtn} onClick={() => onChangeFilter('team')}>팀전</div>
          </div>
        </div>
      </div>
      <div className={styles.gameHistoryBody} ref={listRef} onScroll={onScroll}>
      {
        gameLogs?.map((gameLogId, idx) => 
          idx < gameLogIdx
          && <GameBox gameLogId={gameLogId} isRender={true} filter={filter} key={`${filter}_${gameLogId}`} />
        ) 
      }
      </div>
    </div>
  )
}