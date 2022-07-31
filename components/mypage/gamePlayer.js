import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/pages/mypage.module.scss';

export default function GamePlayer({ info, onClickPlayer, onClickId, myInfo = null }) {
  const [isEmoji, setIsEmoji] = useState(false);
  const ranking = useMemo(() => convertRank(), [info.ranking]);

  useEffect(() => {
    convertRank()
  }, [])

  function convertRank() {
    switch (info.ranking) {
      case 0:
        setIsEmoji(false);
        return '-';
      case 1:
        setIsEmoji(true);
        return '🥇';
      case 2:
        setIsEmoji(true);
        return '🥈';
      case 3:
        setIsEmoji(true);
        return '🥉'
      default:
        setIsEmoji(false);
        return info.ranking;
    }
  };

  return (
    <div className={styles.gameHistoryPlayerItem}>
      <div className={isEmoji ? styles.rankEmoji : styles.gameHistoryPlayerRanking}>{ranking}</div>
      <div className={styles.gameHistoryPlayerProfileImage} onClick={onClickId}>
        <Image src={myInfo ? myInfo.avatarUrl : info.avatarUrl} width={20} height={20} alt="profile" className={styles.gameHistoryPlayerProfileImage} />
      </div>
      <div className={styles.gameHistoryPlayerInfoBox}>
        <div className={styles.gameHistoryPlayerNickname} onClick={onClickId}>{myInfo ? myInfo.gitId : info.gitId}</div>
        <div className={styles.gameHistoryPlayerPassRate}>{`✅ ${parseInt(info.passRate)}%`}</div>
        <div className={styles.gameHistoryPlayerLanguage} onClick={onClickPlayer}>{info.language}</div>
      </div>
    </div>
  )
}