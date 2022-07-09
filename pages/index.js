import { useState } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Layout from '../components/layouts/lobby';
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter();  
  const [isLogin, setIsLogin] = useState(false);
  const friends = [
    {
      nickname: 'annie1229',
      isOnline: true
    },
    {
      nickname: 'prof.choi',
      isOnline: true
    },
    {
      nickname: 'codeking_moonjiro',
      isOnline: false
    },
    {
      nickname: 'afk7',
      isOnline: false
    },
    {
      nickname: 'larger',
      isOnline: true
    }
  ];
  
  const goToCode = () => {
    router.push('/code');
  };

  return (
    <Layout>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>BLUEFROG</div>
          {
            isLogin
            ? <div className={styles.myPageBtn} onClick={() => setIsLogin(prev => !prev)}>마이페이지</div>
            : <div className={styles.loginBtn}  onClick={() => setIsLogin(prev => !prev)}>
                <Image src="/github.png" alt="github Logo" width={20} height={20} />
                <div className={styles.loginText}>로그인</div>
              </div>
          }
        </div>
        <div className={styles.body}>
          <div className={styles.box} onClick={goToCode}>
            <div>
              <Image src="/personal.png" alt="personalGame" width={150} height={150} />
              <div className={styles.boxText}>개인전</div>
            </div>
          </div>
          <div className={styles.box}>
            <div>
              <Image src="/team.png" alt="teamGame" width={150} height={150} />
              <div className={styles.boxText}>팀전</div>
            </div>
          </div>
          {
            isLogin
            && <div className={styles.friendsList}>
                <div className={styles.friendsHeader}>친구목록</div>
                {
                  friends.map(friend => <div className={styles.friendElem} key={friend.nickname}>
                    <div className={styles.friendNickname}>{friend.nickname}</div>
                    <div className={styles.connectInfo}>
                      <Image src={friend.isOnline ? '/online.png' : '/offline.png'} alt="online" width={10} height={10} />
                      <div className={styles.infoText}>{friend.isOnline ? 'online' : 'offline'}</div>
                    </div>
                  </div>)
                }
              </div>
          }
        </div>
      </div>
    </Layout>
  )
}
