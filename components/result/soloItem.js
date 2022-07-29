import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import styles from '../../styles/components/result.module.scss';

export default function SoloResultItem({ info, startAt, idx }) {
  const { data } = useSession();
  const [rankText, setRankText] = useState(info?.ranking);
  const [isEmoji, setIsEmoji] = useState(false);

  useEffect(() => {
    setRankText(info.passRate < 0 ? '-' : convertRank(idx + 1));
  }, [info.passRate, idx]);

  const convertRank = (rank) => {
    let result;
    switch(rank) {
      case 1:
        result = '🥇';
        setIsEmoji(true);
        break;
      case 2:
        result = '🥈';
        setIsEmoji(true);
        break;
      case 3:
        result = '🥉';
        setIsEmoji(true);
        break;
      case 0:
        result = '-';
        setIsEmoji(false);
        break;
      default:
        result = rank;
        break;
    }
    return result;
  }

  const unixToTime = (ts) => {
    const start = new Date(startAt).getTime();
    const end = new Date(ts).getTime();
    const s = parseInt((end - start) / 1000);
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `${min.substr(-2)}:${sec.substr(-2)}`;
  };

  return (
    <div className={data?.gitId === info.gitId ? styles.resultItemMine : styles.resultItem}>
      <div className={isEmoji ? styles.rankEmoji : styles.rank}>{rankText}</div>
      <div className={styles.profileIcon}>
        <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={40} height={40} className={styles.profileIcon} alt="프로필" />
      </div>
      <div className={styles.resultInfoBox}>
        <div className={styles.nickname}>{info.gitId}</div>
        {
          info.passRate < 0
          ? <div className={styles.text}>Clashing...</div>
          : <div className={styles.resultInfos}>
              <div className={styles.text}>✅ {info.passRate < 0 ? 'N/A' : `${parseInt(info.passRate)}%`}</div>
              <div className={styles.text}>⏳ {unixToTime(info.submitAt) ?? 'Clashing...'}</div>
              <div className={styles.codeBtn} onClick={onClickPlayer}>💻 {info.language}</div>
            </div>
        }
      </div>
    </div>
  )
}