import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import GameBox from './gameBox';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameHistory({ totalLogs, teamLogs, soloLogs, winSolo, winTeam, totalSolo, totalTeam }) {
  const listRef = useRef();
  const [gameLogs, setGameLogs] = useState([]);
  const [gameLogIdx, setGameLogIdx] = useState(10);
  const [gameInfo, setGameInfo] = useState('');
  const [count, setCount] = useState(10);
  const [filter, setFilter] = useState('all');

  useLayoutEffect(() => {
    function updateListHeight() {
      if(listRef.current?.clientHeight) {
        if(gameLogIdx * 180 < listRef?.current?.clientHeight) {
          setGameLogIdx(parseInt(listRef?.current?.clientHeight / 180) * 1.5);
          setCount(parseInt(listRef?.current?.clientHeight / 180) * 1.5);
        }
      }
    }
    window.addEventListener('resize', updateListHeight);
    return () => {
      window.removeEventListener('resize', updateListHeight);
    }
  }, []);

  useEffect(() => {
    onChangeFilter(filter);
  }, [totalLogs]);

  const onChangeFilter = (select) => {
    switch(select) {
      case 'all':
        if(totalLogs) {
          setGameLogs(totalLogs);
          setGameInfo(`${totalSolo + totalTeam}게임 ${winSolo + winTeam}승 ${(totalSolo + totalTeam) - (winSolo + winTeam)}패`);
        }
        break;
      case 'solo':
        if(soloLogs) {
          setGameLogs(soloLogs);
          setGameInfo(`${totalSolo}게임 ${winSolo}승 ${(totalSolo) - (winSolo)}패`);
        }
        break;
      case 'team':
        if(teamLogs) {
          setGameLogs(teamLogs);
          setGameInfo(`${totalTeam}게임 ${winTeam}승 ${(totalTeam) - (winTeam)}패`);
        }
        break;
    }
    setGameLogIdx(count);
    setFilter(select);
  };

  const onScroll = (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    if((scrollHeight - scrollTop) < clientHeight + (180 * count * 0.5)) {
      setGameLogIdx(prev => prev + count < gameLogs.length ? prev + count : gameLogs.length);
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
      <div className={styles.gameHistorySubHeader}>{gameInfo}</div>
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