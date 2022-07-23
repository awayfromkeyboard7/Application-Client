import styles from '../styles/components/userPopup.module.scss';
import Image from 'next/image'
import { useState, useEffect } from 'react';

export default function UserPopup({ targetGitId, ranking, onClick, myInfo }) {

    const [userName, setUserName] = useState('닉네임')
    const [userImg, setUserImg] = useState('/default_profile.jpg')
    const [userLang, setUserLang] = useState('Python')
    const [rankingInfo, setRankingInfo] = useState({});

    useEffect(() => {
        setData()
        setRankingInfo(ranking)
    })

    const setData = () => {

        let leng = Object.keys(rankingInfo).length;

        console.log("targetID >>>>>>>>>", targetGitId)
        for (let i = 0; i < leng; i++) {
            if (targetGitId === rankingInfo[i].gitId) {
                setUserName(rankingInfo[i].gitId);
                setUserImg(rankingInfo[i].avatarUrl);
                setUserLang(rankingInfo[i].mostLanguage);
            }
        }

    }


    return (
        <div className={styles.popupBackground} onClick={onClick}>
            <div className={styles.popupBox}>
                <div className={styles.userProfile}>
                    <div className={styles.image}>
                        <Image src={userImg} width={250} height={250} className={styles.profileIcon} alt="프로필이미지" />
                    </div>
                    <div className={styles.popupText}>
                        닉네임 : {userName}
                    </div>
                    {/* <div className={styles.popupText}>
                        티어 : {userTier}
                    </div> */}
                </div>
                <div className={styles.userRecord}>
                    <div className={styles.popupText}>
                        사용언어 : {userLang}
                    </div>
                    <div className={styles.popupText}>
                        평균 통과율 : {parseInt(myInfo?.totalPassRate / (myInfo?.totalSolo + myInfo?.totalTeam))}
                    </div>
                    <div className={styles.popupText}>
                        Solo 승률 : {parseInt(myInfo?.winSolo / myInfo?.totalSolo * 100)}%
                    </div>
                    <div className={styles.popupText}>
                        Team 승률 : {parseInt(myInfo?.winTeam / (myInfo?.totalTeam) * 100)}%
                    </div>
                </div>
            </div>
        </div>
    )
}