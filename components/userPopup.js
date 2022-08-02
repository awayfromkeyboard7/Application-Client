import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { hasCookie, getCookie, setCookie } from 'cookies-next';
import { socket } from '../lib/socket';
import Chart from '../components/chart';
import styles from '../styles/components/userPopup.module.scss';

export default function UserPopup({ userId, onClick }) {
  const router = useRouter();
  const { data } = useSession();
  const [info, setInfo] = useState({});
  const [myFollowing, setMyFollowing] = useState([]);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId]);

  useEffect(() => {
    if (!hasCookie('following')) {
      getMyInfo();
    } else {
      setMyFollowing(JSON.parse(getCookie('following')));
    }
  }, []);

  useEffect(() => {
    if (myFollowing.length) {
      setCookie('following', JSON.stringify(myFollowing));
    }
  }, [myFollowing]);

  useEffect(() => {
    myFollowing?.map(userId => {
      if (userId === info._id) {
        setIsFollow(true);
      }
    });
  }, [myFollowing, info]);

  const getRankName = (rank, ranking) => {
    let myrank = 'Bronze';
    switch (rank) {
      case 0:
        myrank = 'Bronze';
        break;
      case 1:
        myrank = 'Silver';
        break;
      case 2:
        myrank = 'Gold';
        break;
      case 3:
        myrank = 'Platinum';
        break;
      case 4:
        myrank = 'Diamond';
        break;
      case 5:
        myrank = 'Master';
        break;
    }
    if (ranking === 1) {
      myrank = 'King';
    }
    return myrank;
  };

  const getRankImg = (rank, ranking) => {
    let imgUrl = '/rank/rank0.png';
    switch (rank) {
      case 0:
        imgUrl = '/rank/rank0.png';
        break;
      case 1:
        imgUrl = '/rank/rank1.png';
        break;
      case 2:
        imgUrl = '/rank/rank2.png';
        break;
      case 3:
        imgUrl = '/rank/rank3.png';
        break;
      case 4:
        imgUrl = '/rank/rank4.png';
        break;
      case 5:
        imgUrl = '/rank/rank5.png';
        break;
    }
    if (ranking == 1) {
      imgUrl = '/rank/king.png';
    }
    return imgUrl;
  };

  const getMyInfo = async () => {
    await fetch(`/server/api/user/getMyInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
        return;
      }
      return res.json();
    })
    .then(data => {
      if(data.success) {
        setCookie('following', JSON.stringify(data.UserInfo.following));
        setMyFollowing(data.UserInfo.following);
      }
    })
    .catch(error => console.log('[/component/userPopup] getMyInfo error >> ', error));
  };

  const getUserInfo = async () => {
    await fetch(`/server/api/user/getUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId
      })
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
        return;
      }
      return res.json();
    })
    .then(data => {
      if(data.success) {
        setInfo(data.UserInfo);
      }
    })
    .catch(error => console.log('[/component/userPopup] getUserInfo error >> ', error));
  };

  const onClickFollow = () => {
    socket.emit('followMember', info._id);
    setMyFollowing(prev => [...prev, info._id]);
    setIsFollow(true);
  };

  const onClickUnFollow = () => {
    socket.emit('unFollowMember', info._id);
    setMyFollowing(prev => prev.filter(userId => userId !== info._id));
    setIsFollow(false);
  };

  return (
    <div className={styles.popupBackground}>
    {
      info.gitId
      && <div className={styles.infoTab}>
          <div className={styles.myProfileBox}>
            <div className={styles.myProfileHeader}>
              <div className={styles.myProfileTitle}>내 정보</div>
              {  
                data?.gitId === info.gitId  
                ? null
                : isFollow
                  ? <div className={styles.inviteBtnClicked} onClick={onClickUnFollow}>언팔로우</div>
                  : <div className={styles.inviteBtn} onClick={onClickFollow}>팔로우</div>
              }
            </div>
            <div className={styles.splitterHorizontalNoMargin} />
            <div className={styles.myProfileBody}>
              <div className={styles.myInfoRow}>
                <div className={styles.myProfileIcon}>
                  <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={80} height={80} className={styles.myProfileIcon} alt="프로필이미지" />
                  <div className={styles.myRank}>
                    <Image src={getRankImg(info.rank, info.ranking)} width={30} height={30} className={styles.rankIcon} alt="프로필이미지" />
                  </div>
                </div>
                <div className={styles.myInfoCol}>
                  <div className={styles.nickname}>{info?.gitId ?? ''}</div>
                  <div className={styles.rankBox}>
                    <div className={styles.fieldTitle}>{getRankName(info?.rank, info?.ranking)}</div>
                    <div className={styles.pointText}>{`${info?.totalScore ?? 0 * 5} Point`}</div>
                  </div>
                </div>
              </div>
              <div className={styles.splitterHorizontal} />
              <div className={styles.myInfoRow}>
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>랭킹</div>
                  <div className={styles.percentText} style={{ paddingTop: '0.25rem', paddingBottom: 0, overflow: 'hidden' }}>{`${info?.ranking ?? 0}등\n(상위 ${info?.rankingPercent ?? 100}%)`}</div>
                </div>
                <div className={styles.splitterVertical} />
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>사용 언어</div>
                  <div className={styles.percentText}>{info?.mostLanguage ? info?.mostLanguage : '-'}</div>
                </div>
                <div className={styles.splitterVertical} />
                <div className={styles.chartBox}>
                  <Chart data={info?.language} />
                </div>
              </div>
              <div className={styles.splitterHorizontal} />
              <div className={styles.myInfoRow}>
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>평균 통과율</div>
                  <div className={styles.percentText}>{`${(info?.totalSolo + info?.totalTeam) ? parseInt(info?.totalPassRate / (info?.totalSolo + info?.totalTeam)) : 0}%`}</div>
                </div>
                <div className={styles.splitterVertical} />
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>Solo 승률</div>
                  <div className={styles.percentText}>{`${info?.totalSolo ? parseInt(info?.winSolo / info?.totalSolo * 100) : 0}%`}</div>
                </div>
                <div className={styles.splitterVertical} />
                <div className={styles.myInfoCol}>
                  <div className={styles.fieldTitle}>Team 승률</div>
                  <div className={styles.percentText}>{`${info?.totalTeam ? parseInt(info?.winTeam / info?.totalTeam * 100) : 0}%`}</div>
                </div>
              </div>
              <div className={styles.splitterHorizontal} />
              <div className={styles.myInfoFooter}>
                <div className={styles.inviteBtn} onClick={onClick}>닫기</div>
              </div>
            </div>
          </div>
        </div>
    }
    </div>
  )
}