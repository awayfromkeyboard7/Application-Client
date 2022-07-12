import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Wait from '../../../components/wait/box';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';
import styles from '../../../styles/components/wait.module.scss'

export default function WaitPage() {
  const router = useRouter();  
  const defaultUsers = [
    {
      id: 1,
      nickname: 'waiting...',
      imageUrl: '/default_profile.jpg',
      isPlayer: false
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
  ];
  const [gameLogId, setGameLogId] = useState('');
  const [players, setPlayers] = useState(defaultUsers);

  useEffect(() => {
    socket.on("enterNewUser", (users) => {
      addPlayer(users);
    });
    socket.on("startGame", (gameLogId) => {
      setGameLogId(gameLogId);
    });
    socket.emit("waitGame", { uname: getCookie("uname"), imgUrl: getCookie("uimg") });
  }, []);

  useEffect(() => {
    if(gameLogId !== '') {
      router.push({
        pathname: '/code',
        query: { gameLogId }
      });
    }
  }, [gameLogId]);
  
  const startGame = async() => {
    let sendPlayers = [];
    for(let player of players) {
      if(player.isPlayer) {
        sendPlayers.push(
          {
            gitId: player.nickname,
            avatarUrl: player.imageUrl
          }
        )
      }
    };

    console.log('send players', sendPlayers);

    await fetch(`/api/gamelog/createNew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        players: sendPlayers
      }),
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setGameLogId(data.gameLogId);
        socket.emit("startGame", data.gameLogId);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  const goToCode = async () => {
    await startGame();
  };

  const goToLobby = () => {
    router.push('/');
  };

  const addPlayer = (users) => {
    let copyPlayers = [...defaultUsers];
    
    for(let i = 0; i < users.length; i++) {
      if(players[i].isPlayer === false) {
        copyPlayers[i].nickname = users[i].uname;
        copyPlayers[i].imageUrl = users[i].imgUrl ?? '/jinny.jpg';
        copyPlayers[i].isPlayer = true;
      }
    }
    console.log('addplayer', copyPlayers);
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
          // addPlayer={info => addPlayer(info)}
        />
        <Sidebar />
        {/* <CheckValidUser /> */}
      </>
      }
    />
  )
}
