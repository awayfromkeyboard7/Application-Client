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

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status]);

  const getUserInfo = async() => {
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
      if(data.success) {
        setMyInfo(data.UserInfo);
        setGameLogs(data.UserInfo.gameLogHistory.reverse());
      }
    })
    .catch(error => console.log('[/pages/mypage] getUserInfo error >> ', error));
  };

  const logout = async() => {
    deleteCookie('nodeId');
    deleteCookie('gitId');
    deleteCookie('avatarUrl');
    signOut();
    router.replace('/');
  };

  return (
    <Layout 
      header={<Header label="로그아웃" onClickBtn={logout} />}
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
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
                  <GameHistory gameLogId={gameLogId} filter={filter} key={gameLogId} />
                )
              }
              </div>
            </div>
            <div className={styles.mainCol}>
              <div className={styles.profileBox}>
                <div className={styles.profileIcon}>
                  <Image src={myInfo.avatarUrl ?? '/default_profile.jpg'} width={100} height={100} className={styles.profileIcon} alt="프로필이미지" />
                </div>
                <div className={styles.nickname}>{myInfo?.gitId}</div>
              </div>
              <div className={styles.rankingBox}>
                <div className={styles.textMenu}>내 랭킹</div>
                <Rank 
                  rank={myInfo?.ranking} 
                  nickname={myInfo?.gitId} 
                  info={myInfo?.totalScore}
                  image={myInfo?.avatarUrl} 
                />
                {/* <div className={styles.textMenu}>전체 랭킹</div> */}
                {/* {
                  ranks.map((elem, idx) => 
                    <Rank 
                      key={elem.ranking}
                      rank={elem.ranking} 
                      nickname={elem.gitId} 
                      info={elem.info} 
                      image={elem.avatarUrl} 
                    />
                  )
                } */}
              </div>
            </div>
          </div>
        </>
      }
    />
  )
}