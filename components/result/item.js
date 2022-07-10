import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/components/result.module.scss';

export default function RankingElem({ rank, nickname, time, image }) {
  const [rankText, setRankText] = useState(rank);
  const [isEmoji, setIsEmoji] = useState(false);

  useEffect(() => {
    switch(rank) {
      case 1:
        setRankText('🥇');
        setIsEmoji(true);
        break;
      case 2:
        setRankText('🥈');
        setIsEmoji(true);
        break;
      case 3:
        setRankText('🥉');
        setIsEmoji(true);
        break;
      default:
        setRankText(rank);
        break;
    }
  }, [rank]);

  return (
    <div className={styles.resultItem}>
      <div className={isEmoji ? styles.rankEmoji : styles.rank}>{rankText}</div>
      <div className={styles.profileIcon}>
        <Image src={image} width={40} height={40} className={styles.profileIcon} alt="프로필" />
      </div>
      <div className={styles.nickname}>{nickname}</div>
      <div className={styles.time}>{time}</div>
    </div>
  )
}