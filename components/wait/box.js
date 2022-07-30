import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Item from './item';
import styles from '../../styles/components/wait.module.scss';
import UserPopup from '../userPopup'

export default function WaitBox({ type, players, countdown, onClickPlayAgain, onClickGoToMain }) {
  const router = useRouter();
  const { data } = useSession();
  const [userLine1, setUserLine1] = useState([]);
  const [userLine2, setUserLine2] = useState([]);
  //도현
  const [targetId, setTatgetId] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [info, setInfo] = useState({});

  useEffect(() => {
    setUserLine1(players.slice(0, 4));
    setUserLine2(players.slice(4));
  }, [players]);

  const secToTime = (s) => {
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `⏳ ${min.substr(-2)}분 ${sec.substr(-2)}초 후 게임이 시작됩니다!`;
  };
  //도현
  const onClickId = (gitId) => {
    getUserInfo()
    setTatgetId(gitId);
    setIsPopup(true);
  };

  
  const getUserInfo = async () => {
    await fetch(`/server/api/user/getUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gitId: data.gitId
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setInfo(data.UserInfo);
                // console.log("showmedata!@!@!@!#!@#!@#!@",data.UserInfo)
            }
        })
        .catch(error => console.log('[/pages/mypage] getUserInfo error >> ', error));
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
          userLine1?.map((item, idx) => 
            <Item info={item} key={idx} onClickId={() => onClickId(item.gitId)} />
          )
        }
        </div>
        <div className={styles.waitBox}>
        {
          type !== 'team'
          && userLine2?.map((item, idx) => 
            <Item info={item} key={idx} onClickId={() => onClickId(item.gitId)}/>
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
        //도현
        isPopup
        && <UserPopup
          targetGitId={targetId}
          onClick={() => { setIsPopup(false) }}
          myInfo={info}
        />
      }
    </div>
  )
}