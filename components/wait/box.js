import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Item from './item';
import UserPopup from '../userPopup';
import styles from '../../styles/components/wait.module.scss';

export default function WaitBox({ type, players, countdown, onClickPlayAgain, onClickGoToMain }) {
  const router = useRouter();
  const { data } = useSession();
  const [targetId, setTatgetId] = useState('');
  const [isPopup, setIsPopup] = useState(false);

  const secToTime = (s) => {
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `⏳ ${min.substr(-2)}분 ${sec.substr(-2)}초 후 게임이 시작됩니다!`;
  };
  
  const onClickId = (userId) => {
    setTatgetId(userId);
    setIsPopup(true);
  };

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>{`${type === 'team' ? '팀' : '개인'}전`}</div>
      </div>
      {
        type === 'team'
        ? <div className={styles.countdown}>👫 팀을 구성하고 매칭을 시작하세요! 👬</div>
        : <div className={countdown <= 5 ? `${styles.countdown} ${styles.textRed}` : styles.countdown}>{secToTime(countdown)}</div>
      }
      <div className={styles.mainBody}> 
        <div className={styles.waitBox}>
        {
          players.slice(0, 4)?.map((item, idx) => 
            <Item info={item} key={idx} onClickId={() => onClickId(item.userId)} />
          )
        }
        </div>
        <div className={styles.waitBox}>
        {
          type !== 'team'
          && players.slice(4)?.map((item, idx) => 
            <Item info={item} key={idx} onClickId={() => onClickId(item.userId)}/>
          )
        }
        </div>
      </div>
      <div className={styles.mainFooter}>
      {
        type === 'team'
        ? <div className={router?.query?.roomId === data?.gitId ? styles.btn : styles.btnInactive} onClick={onClickPlayAgain}>팀전 매칭</div>
        : <div className={styles.btn} onClick={onClickPlayAgain}>게임 시작</div>
      }
      {
        5 < countdown
        ? <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
        : <div className={styles.btnInactive}>메인으로</div>
      }
      </div>
      {
        isPopup
        && <UserPopup
            userId={targetId}
            onClick={() => setIsPopup(false)}
          />
      }
    </div>
  )
}