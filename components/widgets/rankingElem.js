import Image from 'next/image';
import styles from '../../styles/components/ranking.module.css';

export default function RankingElem({ nickname, info, image }) {
  return (
    <div className={styles.rankingElem}>
      <div className={styles.profileIcon}>
        <Image src={image} width={40} height={40} className={styles.profileIcon} />
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.nickname}>{nickname}</div>
        <div className={styles.info}>{info}</div>
      </div>
    </div>
  )
}