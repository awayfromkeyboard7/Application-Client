import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/components/ranking.module.scss';

export default function RankingItem({ ranking, nickname, image, rankImg, language, winrate, onClickId }) {
  const [rankText, setRankText] = useState(ranking);
  const [rankingStyle, setRankingStyle] = useState(styles.ranking);

  useEffect(() => {
    switch(ranking) {
      case 1:
        setRankText('🥇');
        setRankingStyle(styles.rankEmoji);
        break;
      case 2:
        setRankText('🥈');
        setRankingStyle(styles.rankEmoji);
        break;
      case 3:
        setRankText('🥉');
        setRankingStyle(styles.rankEmoji);
        break;
      case 9999999999:
        setRankText('-');
        setRankingStyle(styles.ranking);
        break;
      default:
        setRankText(ranking);
        if(ranking < 100) {
          setRankingStyle(styles.ranking);
        } else if(ranking < 1000) {
          setRankingStyle(styles.ranking100);
        } else if(ranking < 10000) {
          setRankingStyle(styles.ranking1000);
        } else if(ranking < 100000) {
          setRankingStyle(styles.ranking10000);
        } else {
          setRankingStyle(styles.ranking100000);
        }
        break;
    }
  }, [ranking]);

  return (
    <div className={styles.rankingElem}>
      <div className={rankingStyle}>{rankText}</div>
      <div className={styles.rankIcon}>
        <Image src={rankImg ?? '/default_profile.jpg'} width={25} height={25} className={styles.rankIcon} alt="프로필" />
      </div>
      {/* <div className={styles.profileIcon}>
        <Image src={image ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIcon} alt="프로필" />
      </div> */}
        <div className={styles.nickname} onClick={onClickId}>{nickname}</div>
        <div className={styles.winRate}>{`${winrate}%`}</div>
      <div className={styles.rankIcon}>
        <Image src={language ?? '/default_profile.jpg'} width={20} height={20} className={styles.rankIcon} alt="프로필" />
      </div>
    </div>
  )
}