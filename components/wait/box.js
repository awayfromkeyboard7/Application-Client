import { useState, useEffect } from 'react';
import Item from './item';
import styles from '../../styles/components/wait.module.scss';

export default function WaitBox({ type, players, onClickPlayAgain, onClickGoToMain, addPlayer }) {
  const [countdown, setCountdown] = useState(180);
  const [nickname, setNickname] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if(0 < prev) return prev - 1;
        else return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const secToTime = (s) => {
    const min = "0" + String(parseInt((s % 3600) / 60));
    const sec = "0" + String(parseInt(s % 60));
    
    return `⏳ ${min.substr(-2)}분 ${sec.substr(-2)}초 후 게임이 시작됩니다!`;
  };

  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };

  const onChangeImageUrl = (e) => {
    setImageUrl(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    addPlayer({ nickname, imageUrl });
  }

  return (
    <div className={styles.body}>
      <div className={styles.mainHeader}>
        <div className={styles.mainTitle}>{`${type === 'team' ? '팀' : '개인'}전`}</div>
      </div>
      <div className={styles.countdown}>{secToTime(countdown)}</div>
      <div className={styles.mainBody}> 
        <div className={styles.waitBox}>
        {
          players.map(item => 
            <Item info={item} key={item.id} />
          )
        }
        </div>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} type="text" placeholder="nickname" value={nickname} onChange={onChangeNickname} />
        <input className={styles.input} type="text" placeholder="imageUrl" value={imageUrl} onChange={onChangeImageUrl} />
        <input className={styles.myPageBtn} type="submit" value="추가" />
      </form>
      <div className={styles.mainFooter}>
        <div className={styles.myPageBtn} onClick={onClickPlayAgain}>게임 시작</div>
        <div className={styles.myPageBtn} onClick={onClickGoToMain}>메인으로</div>
      </div>
    </div>
  )
}