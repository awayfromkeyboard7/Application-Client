import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/components/ranking.module.scss';

export default function RankingItem({ rank, nickname, image, rankImg, language, winrate, onClickId}) {
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
      <div className={styles.rankIcon}>
        <Image src={rankImg ?? '/default_profile.jpg'} width={25} height={25} className={styles.rankIcon} alt="프로필" />
      </div>
      {/* <div className={styles.profileIcon}>
        <Image src={image ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIcon} alt="프로필" />
      </div> */}
        <div className={styles.nickname} onClick={onClickId}>{nickname}</div>
        <div className={styles.winRate}>{winrate}%</div>
      <div className={styles.rankIcon}>
        <Image src={language ?? '/default_profile.jpg'} width={20} height={20} className={styles.rankIcon} alt="프로필" />
      </div>
    </div>
  )
}