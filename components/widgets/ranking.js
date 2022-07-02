import RankingElem from './rankingElem';
import styles from '../../styles/components/ranking.module.css';

export default function Ranking({ close }) {
  return (
    <div className={styles.rankingBox}>
      <div className={styles.rankingHeader}>🎉 실시간 랭킹 🎉</div>
      <div className={styles.rankingBody}>
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
        <RankingElem nickname="annie1229" info="swjungle" image="/jinny.jpg" />
      </div>
    </div>
  )
}