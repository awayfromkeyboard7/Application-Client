import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/components/userPopup.module.scss';

export default function UserPopup({ targetGitId, ranking, onClick }) {
  const [userName, setUserName] = useState('닉네임');
  const [userImg, setUserImg] = useState('/default_profile.jpg');
  const [userLang, setUserLang] = useState('Python');
  const [rankingInfo, setRankingInfo] = useState({});
  const [myInfo, setMyInfo] = useState({});

  useEffect(() => {
    setData();
    getUserInfo();
    setRankingInfo(ranking);
  }, []);

  const setData = () => {
    let leng = Object.keys(rankingInfo).length;

    for (let i = 0; i < leng; i++) {
      if (targetGitId === rankingInfo[i].gitId) {
        setUserName(rankingInfo[i].gitId);
        setUserImg(rankingInfo[i].avatarUrl);
        setUserLang(rankingInfo[i].mostLanguage);
      }
    }
  };

  const getUserInfo = async () => {
    await fetch(`/server/api/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gitId: targetGitId
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setMyInfo(data.UserInfo);
      }
    })
    .catch(error => console.log('[/components/userPopup] getUserInfo error >> ', error));
  };

  return (
    <div className={styles.popupBackground} onClick={onClick}>
      <div className={styles.popupBox}>
        <div className={styles.userProfile}>
          <div className={styles.image}>
            <Image src={userImg} width={250} height={250} className={styles.profileIcon} alt="프로필이미지" />
          </div>
          <div className={styles.popupText}>{`닉네임 : ${userName}`}</div>
          <div className={styles.popupText}>{`티어 : 티어어어엉어어어어`}</div>
        </div>
        <div className={styles.userRecord}>
          <div className={styles.popupText}>{`사용언어 : ${userLang}`}</div>
          <div className={styles.popupText}>{`평균 통과율 : ${parseInt(myInfo?.totalPassRate / (myInfo?.totalSolo + myInfo?.totalTeam))}`}</div>
          <div className={styles.popupText}>{`Solo 승률 : ${parseInt(myInfo?.winSolo / myInfo?.totalSolo * 100)}%`}</div>
          <div className={styles.popupText}>{`Team 승률 : ${parseInt(myInfo?.winTeam / (myInfo?.totalTeam) * 100)}%`}</div>
        </div>
      </div>
    </div>
  )
}