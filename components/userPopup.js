import { useState, useEffect } from 'react';
import styles from '../styles/components/userPopup.module.scss';
import Image from 'next/image'
import { getCookie } from 'cookies-next';
import { socket } from '../lib/socket';

export default function UserPopup({ targetGitId, onClick ,myInfo}) {

    const [info, setInfo] = useState({});
    const [nodeId, setNodeId] = useState();
    const [isFollow, setIsFollow] = useState(false);

    useEffect(() => {
        getUserInfo()
        setNodeId(getCookie('nodeId'))
        myInfo?.following?.map(userNodeId => {
            if(userNodeId === info.nodeId) {
              setIsFollow(true);
            }
        });
    })

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
                if (data.success) {
                    setInfo(data.UserInfo);
                    // console.log("showmedata!@!@!@!#!@#!@#!@",data.UserInfo)
                }
            })
            .catch(error => console.log('[/pages/mypage] getUserInfo error >> ', error));
        };

    const onClickFollow = () => {
        socket.emit('followMember', nodeId, info.gitId);
        setIsFollow(true);
        };
    
    const onClickUnFollow = () => {
        socket.emit('unFollowMember', nodeId, info.gitId);
        setIsFollow(false);
        };

    return (
        <div className={styles.popupBackground}>
            <div className={styles.popupBox}>
                <div className={styles.userProfile}>
                    <div className={styles.image}>
                        <Image src={info.avatarUrl??'/default_profile.jpg'} width={250} height={250} className={styles.profileIcon} alt="프로필이미지" />
                    </div>
                    <div className={styles.popupText}>
                        닉네임 : {info.gitId}
                    </div>
                    <div className={styles.popupText}>
                        등급 : {info.rank}
                    </div>
                </div>
                <div className={styles.userRecord}>
                    <div className={styles.popupText}>
                        사용언어 : {info.mostLanguage}
                    </div>
                    <div className={styles.popupText}>
                        평균 통과율 : {parseInt(info?.totalPassRate / (info?.totalSolo + info?.totalTeam))}%
                    </div>
                    <div className={styles.popupText}>
                        Solo 승률 : {parseInt(info?.winSolo / info?.totalSolo * 100)}%
                    </div>
                    <div className={styles.popupText}>
                        Team 승률 : {parseInt(info?.winTeam / (info?.totalTeam) * 100)}%
                    </div>
                    <div className={styles.popupText}>
                        전체 랭킹 : 
                        {/* {ranking.length}명 중 {info?.ranking}등
                        상위 {getPercent(info?.ranking, ranking.length)}% */}
                    </div>
                </div>
                    {       
                        isFollow
                        ? <div className={styles.inviteBtnClicked} onClick={onClickUnFollow}>언팔로우</div>
                        : <div className={styles.inviteBtn} onClick={onClickFollow}>팔로우</div>
                    }
                    {/* <div className={styles.popupBtn} onClick={onClick}>{label}</div> */}
                    
                    <div className={styles.btn} onClick={onClick}>닫기</div>
            </div>
        </div>
    )
}