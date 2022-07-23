import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react';
import { getCookie, deleteCookie } from 'cookies-next';
import Layout from '../../components/layouts/main';
import Header from '../../components/header';
import Rank from '../../components/rank/item';
import GameHistory from '../../components/mypage/gameHistory';
import Loading from '../../components/loading';
import styles from '../../styles/pages/mypage.module.scss'

export default function MyPage() {
  const router = useRouter();
  const { status } = useSession();
  const [myInfo, setMyInfo] = useState({});
  const [gameLogs, setGameLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    getUserInfo();
    getRanking();
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {

  }, [ranking]);

  const getUserInfo = async () => {
    await fetch(`/server/api/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gitId: getCookie('gitId')
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMyInfo(data.UserInfo);
          setGameLogs(data.UserInfo.gameLogHistory.reverse());
        }
      })
      .catch(error => console.log('[/pages/mypage] getUserInfo error >> ', error));
  };

  const getRanking = async () => {
    await fetch(`/server/api/ranking/getRanking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          setRanking(data.data);
        }
      })
      .catch(error => console.log('[/pages/mypage] getRanking error >> ', error));
  };


  const logout = async () => {
    deleteCookie('nodeId');
    deleteCookie('gitId');
    deleteCookie('avatarUrl');
    signOut();
    router.push('/');
  };

  const getRankImg = (rank, ranking) => {
    let imgUrl = '/rank/king.png';
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
      default:
        imgUrl = '/jinny.jpg';
    }
    if (ranking == 1) {
      imgUrl = '/rank/king.png';
    }
    return imgUrl;
  }

  const getLangImg = (language) => {
    let imgUrl = '/default_profile.jpg'
    switch (language) {
      case "Python":
        imgUrl = '/rank/Python.png';
        break;
      case "JavaScript":
        imgUrl = '/rank/JavaScript.png';
        break;
      default:
        imgUrl = '/default_profile.jpg';
    }
    return imgUrl;
  }

  const getPercent = (rank, total) => {
    return parseInt(rank / total * 1000) / 10
  }

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
      default:
        myrank = 'Bronze'
    }
    if (ranking == 1) {
      myrank = 'King';
    }
    return myrank;
  }

  return (
    <Layout
      header={<Header label="로그아웃" onClickBtn={logout} />}
      body={
        <>
          {status !== 'authenticated' && <Loading />}
          <div className={styles.mainRow}>
            <div className={styles.gameHistoryBox}>
              <div className={styles.gameHistoryHeader}>
                <div className={styles.gameHistoryHeaderLeft}>
                  <div className={styles.title}>게임 기록</div>
                </div>
                <div className={styles.gameHistoryHeaderRight}>
                  <div className={styles.filterBox}>
                    <div className={filter === 'all' ? styles.filterBtnActive : styles.filterBtn} onClick={() => setFilter('all')}>전체</div>
                    <div className={filter === 'solo' ? styles.filterBtnActive : styles.filterBtn} onClick={() => setFilter('solo')}>개인전</div>
                    <div className={filter === 'team' ? styles.filterBtnActive : styles.filterBtn} onClick={() => setFilter('team')}>팀전</div>
                  </div>
                </div>
              </div>
              <div className={styles.gameHistoryBody}>
                {
                  gameLogs?.map(gameLogId =>
                    <GameHistory gameLogId={gameLogId} filter={filter} key={gameLogId} ranking={ranking} myInfo={myInfo} />
                  )
                }
              </div>
            </div>
            <div className={styles.mainCol}>
              <div className={styles.profileBox}>
                <div className={styles.iconBox}>
                  <div className={styles.profileIcon}>
                    <Image src={myInfo.avatarUrl ?? '/default_profile.jpg'} z-index={0} width={100} height={100} className={styles.profileIcon} alt="프로필이미지" />
                    <div className={styles.myRank}>
                      <Image src={getRankImg(myInfo.rank, myInfo.ranking) ?? '/rank/rank0.png'} z-index={1} width={55} height={55} className={styles.profileIcon} alt="프로필이미지" />
                      {/* <Image src={'/rank/rank0.png'} z-index={1} width={60} height={60} className={styles.profileIcon} alt="프로필이미지" />                   
                      */}
                    </div>
                  </div>
                </div>
                <div className={styles.iconBox}>
                  <div className={styles.profileInfo}>
                    <div className={styles.nickname}>{myInfo?.gitId}</div>
                    <div className={styles.rankBox}>
                      <div className={styles.nickname}>{getRankName(myInfo?.rank, myInfo?.ranking)}</div>
                      <div className={styles.nickname}>{myInfo?.totalScore * 5}Point</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.profileBox2}>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>평균 통과율 :</div>
                  <div className={styles.infoValue}>{parseInt(myInfo?.totalPassRate / (myInfo?.totalSolo + myInfo?.totalTeam))}%</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>Solo 승률 :</div>
                  <div className={styles.infoValue}>{parseInt(myInfo?.winSolo / myInfo?.totalSolo * 100)}%</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>Team 승률 :</div>
                  <div className={styles.infoValue}>{parseInt(myInfo?.winTeam / (myInfo?.totalTeam) * 100)}%</div>
                </div>
              </div>
              <div className={styles.profileBox2}>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>내 랭킹 :</div>
                  <div className={styles.infoValue}>전체 {ranking.length}명 중 {myInfo?.ranking}등</div>
                  <div className={styles.infoValue}>(상위 {getPercent(myInfo?.ranking, ranking.length)}%)</div>
                </div>
              </div>
              <div className={styles.profileBox2}>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>사용 언어 :</div>
                  <div className={styles.infoValue}>{myInfo?.mostLanguage}</div>
                </div>
              </div>

              <div className={styles.textMenu}>전체 랭킹 :</div>
              <div className={styles.rankingInfo}>
                <div className={styles.rankingInfoElem1}>순위</div>
                <div className={styles.rankingInfoElem2}>등급</div>
                <div className={styles.rankingInfoElem3}>플레이어</div>
                <div className={styles.rankingInfoElem4}>승률</div>
                <div className={styles.rankingInfoElem5}>언어</div>
              </div>
              <div className={styles.rankingBox}>
                {/* <div className={styles.textMenu}>내 랭킹</div>
                <Rank 
                  rank={myInfo?.ranking} 
                  nickname={myInfo?.gitId} 
                  info={myInfo?.totalScore}
                  image={myInfo?.avatarUrl} 
                /> */}

                {
                  ranking?.map((elem, idx) =>
                    <Rank
                      key={elem.ranking}
                      rank={elem.ranking}
                      nickname={elem.gitId}
                      info={elem.info}
                      image={elem.avatarUrl}
                      rankImg={getRankImg(elem.rank, elem.ranking)}
                      language={getLangImg(elem.mostLanguage)}
                      winrate={elem.winRate}
                    />
                  )
                }
              </div>
            </div>
          </div>
        </>
      }
    />
  )
}