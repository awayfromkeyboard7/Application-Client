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
          setRanking(data.data.rank);
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
                    <GameHistory gameLogId={gameLogId} filter={filter} key={gameLogId} ranking={ranking} />
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
                      <Image src={myInfo.avatarUrl ?? '/default_profile.jpg'} z-index={1} width={40} height={40} className={styles.profileIcon} alt="프로필이미지" />
                    </div>
                  </div>
                </div>
                <div className={styles.iconBox}>
                  <div className={styles.profileInfo}>
                    <div className={styles.nickname}>{myInfo?.gitId}</div>
                    <div className={styles.rankBox}>
                      <div className={styles.nickname}>{myInfo?.rank}</div>
                      <div className={styles.nickname}>{myInfo?.totalScore}Point</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.profileBox2}>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>사용 언어</div>
                  <div className={styles.nickname}>{myInfo?.mostLanguage}</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>평균 통과율</div>
                  <div className={styles.nickname}>{parseInt(myInfo?.totalPassRate / (myInfo?.totalSolo + myInfo?.totalTeam))}%</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>Solo 승률</div>
                  <div className={styles.nickname}>{parseInt(myInfo?.winSolo / myInfo?.totalSolo * 100)}%</div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.infoText}>Team 승률</div>
                  <div className={styles.nickname}>{parseInt(myInfo?.winTeam / (myInfo?.totalTeam) * 100)}%</div>
                </div>
              </div>
              <div className={styles.textMenu}>전체 랭킹</div>
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
                    />
                  )
                }
              </div>
              {/* <div className={styles.rankingBox}>
                {
                  ranking?.map(user => 
                    <Rank 
                    rank={user?.ranking} 
                    nickname={user?.gitId} 
                    info={user?.totalScore}
                    image={user?.avatarUrl} 
                    />
                  )
                }
              </div> */}
              {/* <div className={styles.textMenu}>전체 랭킹</div> */}

            </div>
          </div>
        </>
      }
    />
  )
}