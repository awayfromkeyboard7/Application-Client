import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import styles from '../../styles/components/result.module.scss';

export default function ResultItem({ info }) {
  const myNickname = getCookie('uname');
  const [rankText, setRankText] = useState(info.rank);
  const [isEmoji, setIsEmoji] = useState(false);

  useEffect(() => {
    switch(info.rank) {
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
      case 0:
        setRankText('-');
        setIsEmoji(false);
        break;
      default:
        setRankText(info.rank);
        break;
    }
  }, [info.rank]);
  
  return (
    <div className={myNickname === info.nickname ? styles.resultItemMine : styles.resultItem}>
      <div className={isEmoji ? styles.rankEmoji : styles.rank}>{rankText}</div>
      <div className={styles.profileIcon}>
        <Image src={info.imageUrl} width={40} height={40} className={styles.profileIcon} alt="프로필" />
      </div>
      <div className={styles.resultInfoBox}>
        <div className={styles.nickname}>{info.nickname}</div>
        {
          info.rate < 0
          ? <div className={styles.text}>Clashing...</div>
          : <div className={styles.resultInfos}>
              <div className={styles.text}>✅ {info.rate < 0 ? 'N/A' : `${info.rate}%`}</div>
              <div className={styles.text}>⏳ {info.time ?? 'Clashing...'}</div>
              <div className={styles.text}>💻 {info.language}</div>
            </div>
        }
      </div>
    </div>
  )
}