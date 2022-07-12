import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import styles from '../../styles/components/result.module.scss';

export default function ResultItem({ info }) {
  const myNickname = getCookie('uname');
  const [rankText, setRankText] = useState(info.ranking);
  const [isEmoji, setIsEmoji] = useState(false);

  useEffect(() => {
    switch(info.ranking) {
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
        setRankText(info.ranking);
        break;
    }
  }, [info.ranking]);

  const unixToTime = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = "0" + (date.getMonth()+1);
    const day = date.getDate();
    let hour = "0" + date.getHours();
    const min = "0" + date.getMinutes();
    const sec = "0" + date.getSeconds();
    const isAM = date.getHours() < 12 ? true : false;

    if(!isAM) hour = "0" + (date.getHours() - 12);
    
    return `${min.substr(-2)}:${sec.substr(-2)}`;
  };

  return (
    <div className={myNickname === info.nickname ? styles.resultItemMine : styles.resultItem}>
      <div className={isEmoji ? styles.rankEmoji : styles.rank}>{rankText}</div>
      <div className={styles.profileIcon}>
        <Image src={info.avatarUrl} width={40} height={40} className={styles.profileIcon} alt="프로필" />
      </div>
      <div className={styles.resultInfoBox}>
        <div className={styles.nickname}>{info.gitId}</div>
        {
          info.passRate < 0
          ? <div className={styles.text}>Clashing...</div>
          : <div className={styles.resultInfos}>
              <div className={styles.text}>✅ {info.passRate < 0 ? 'N/A' : `${info.passRate}%`}</div>
              <div className={styles.text}>⏳ {unixToTime(info.submitAt) ?? 'Clashing...'}</div>
              <div className={styles.text}>💻 {info.language}</div>
            </div>
        }
      </div>
    </div>
  )
}