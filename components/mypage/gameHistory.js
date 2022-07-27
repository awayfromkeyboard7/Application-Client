import { useState } from 'react';
import GameBox from './gameBox';
import styles from '../../styles/pages/mypage.module.scss';

export default function GameHistory({ gameLogs, ranking, myInfo }) {
  const [filter, setFilter] = useState('all');
  
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
      <div className={styles.gameHistoryBody}>
      {
        gameLogs?.map(gameLogId =>
          <GameBox gameLogId={gameLogId} filter={filter} key={gameLogId} ranking={ranking} myInfo={myInfo} />
        )
      }
      </div>
    </div>
  )
}