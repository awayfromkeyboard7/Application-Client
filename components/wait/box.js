import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import Item from './item';
import styles from '../../styles/components/wait.module.scss';

export default function WaitBox({ type, players, countdown, onClickPlayAgain, onClickGoToMain }) {
  const router = useRouter();

  const secToTime = (s) => {
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `⏳ ${min.substr(-2)}분 ${sec.substr(-2)}초 후 게임이 시작됩니다!`;
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
          players.map((item, idx) => 
            <Item info={item} key={`${item.id}${idx}`} />
          )
        }
        </div>
      </div>
      <div className={styles.mainFooter}>
        <div className={router?.query?.mode === 'team' ? router?.query?.roomId === getCookie('gitId') ? styles.btn : styles.btnInactive : styles.btn} onClick={onClickPlayAgain}>{router?.query?.mode === 'team' ? '팀전 매칭' : '게임 시작'}</div>
        <div className={styles.btn} onClick={onClickGoToMain}>메인으로</div>
      </div>
      {
        router?.query?.mode === 'team'
        && <div className={styles.floatingBtn}>🗣</div>
      }
    </div>
  )
}