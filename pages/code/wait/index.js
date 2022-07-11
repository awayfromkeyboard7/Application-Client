import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import Layout from '../../../components/layouts/main';
import Wait from '../../../components/wait/box';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';
import styles from '../../../styles/components/wait.module.scss'

export default function WaitPage() {
  const router = useRouter();  
  const [isLogin, setIsLogin] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPlayers([
      {
        id: 1,
        nickname: 'annie1229',
        imageUrl: `data:image/jpeg;base64,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`,
        isPlayer: true
      },
      {
        id: 2,
        nickname: 'waiting...',
        imageUrl: '/default_profile.jpg',
        isPlayer: false
      },
      {
        id: 3,
        nickname: 'waiting...',
        imageUrl: '/default_profile.jpg',
        isPlayer: false
      },
      {
        id: 4,
        nickname: 'waiting...',
        imageUrl: '/default_profile.jpg',
        isPlayer: false
      },
      {
        id: 5,
        nickname: 'waiting...',
        imageUrl: '/default_profile.jpg',
        isPlayer: false
      },
      {
        id: 6,
        nickname: 'waiting...',
        imageUrl: '/default_profile.jpg',
        isPlayer: false
      },
      {
        id: 7,
        nickname: 'waiting...',
        imageUrl: '/default_profile.jpg',
        isPlayer: false
      },
      {
        id: 8,
        nickname: 'waiting...',
        imageUrl: '/default_profile.jpg',
        isPlayer: false
      },
    ]);
  }, []);

  useEffect(() => {
    const token = getCookie('uid');
    if(token) {
      // token이 있으면 서버에 유효한 토큰인지 확인하고 true
      // 유효하지 않으면 false
      setIsLogin(true);
    } else {
      // token이 없으면 false
      setIsLogin(false);
    }
  }, [isLogin]);

  const goToCode = () => {
    router.push('/code');
  };

  const goToLobby = () => {
    router.push('/');
  };

  const addPlayer = (info) => {
    let copyPlayers = [...players];

    for(let i = 0; i < 8; i++) {
      if(players[i].isPlayer === false) {
        copyPlayers[i].nickname = info.nickname;
        copyPlayers[i].imageUrl = info.imageUrl === '' ? '/jinny.jpg' : info.imageUrl;
        copyPlayers[i].isPlayer = true;
        break;
      }
    }

    setPlayers(copyPlayers);
  }

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerTitle} onClick={goToLobby}>BLUEFROG</div>
        <div className={styles.myPageBtn}>마이페이지</div>
      </>
      }
      body={
      <>
        <Wait 
          type="personal" 
          players={players} 
          onClickGoToMain={goToLobby} 
          onClickPlayAgain={goToCode}
          addPlayer={info => addPlayer(info)}
        />
        <Sidebar />
        <CheckValidUser func={() => {}} />
      </>
      }
    />
  )
}
