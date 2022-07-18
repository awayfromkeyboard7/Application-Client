import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/components/ranking.module.scss';

export default function RankingItem({ rank, nickname, info, image }) {
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
    <div className={styles.rankingElem}>
      <div className={isEmoji ? styles.rankEmoji : styles.rank}>{rankText}</div>
      <div className={styles.profileIcon}>
        <Image src={image ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIcon} alt="프로필" />
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.nickname}>{nickname}</div>
        <div className={styles.info}>{info}</div>
      </div>
    </div>
  )
}