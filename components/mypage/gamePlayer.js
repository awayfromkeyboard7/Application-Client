import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/pages/mypage.module.scss';

export default function GamePlayer({ info, onClickPlayer, myInfo=null }) {
  const [rankText, setRankText] = useState(info.ranking);
  const [isEmoji, setIsEmoji] = useState(false);

  useEffect(() => {
    switch(info.ranking) {
      case 0:
        setRankText('-');
        setIsEmoji(false);
        break;
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
        setRankText(info.ranking);
        break;
    }
  }, [info.ranking]);

  return (
    <div className={styles.gameHistoryPlayerItem}>
      <div className={isEmoji ? styles.rankEmoji : styles.gameHistoryPlayerRanking}>{rankText}</div>
      <div className={styles.gameHistoryPlayerProfileImage}>
        <Image src={myInfo ? myInfo.avatarUrl : info.avatarUrl} width={20} height={20} alt="profile" className={styles.gameHistoryPlayerProfileImage} />
      </div>
      <div className={styles.gameHistoryPlayerInfoBox}>
        <div className={styles.gameHistoryPlayerNickname}>{myInfo ? myInfo.gitId : info.gitId}</div>
        <div className={styles.gameHistoryPlayerPassRate}>{`✅ ${info.passRate}%`}</div>
        <div className={styles.gameHistoryPlayerLanguage} onClick={onClickPlayer}>{info.language}</div>
      </div>
    </div>
  )
}