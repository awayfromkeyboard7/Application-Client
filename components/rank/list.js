import Item from './item';
import styles from '../../styles/components/ranking.module.scss';

export default function RankingList({ ranks, isAbsolute=false }) {
  return (
    <div className={isAbsolute ? styles.rankingBoxAbsolute : styles.rankingBox}>
      <div className={styles.rankingHeader}>🎉 실시간 랭킹 🎉</div>
      <div className={styles.rankingBody}>
      {
        ranks.map(elem => 
          <Item 
            key={elem.rank}
            rank={elem.rank} 
            nickname={elem.nickname} 
            info={elem.info} 
            image={elem.avatarUrl} 
          />
        )
      }
      </div>
    </div>
  )
}