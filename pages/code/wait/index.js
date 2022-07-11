import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { 
  socket,
  sendSocketMessage, 
  socketInfoReceived, 
  createNewSocketConnection,
} from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Wait from '../../../components/wait/box';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';
import styles from '../../../styles/components/wait.module.scss'

export default function WaitPage() {
  const router = useRouter();  
  const [gameLogId, setGameLogId] = useState('');
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
  const [players, setPlayers] = useState(defaultUsers);

  useEffect(() => {
    console.log('!!!!!!!!use effect game log id!', gameLogId);
    if(gameLogId !== '') {
      router.push({
        pathname: '/code',
        query: { gameLogId }
      });
    }
  }, [gameLogId]);

  useEffect(() => {
    // sendSocketMessage("waitGame", { "userName": getCookie("uname") });
    socket.on("enterNewUser", (users) => {
      console.log(users)
      addPlayer(users);
    });
    socket.on("startGame", (gameLogId) => {
      console.log('gameLogId>>>>>>>', gameLogId);
      setGameLogId(gameLogId);
    });
    socket.emit("waitGame", { uname: getCookie("uname"), imgUrl: getCookie("uimg") });
  }, []);

  const startGame = async() => {
    let sendPlayers = [];
    for(let player of players) {
      console.log('player >>', player);
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
      console.log('start game', data);
      if(data.success === true) {
        console.log('success get problem!!', data);
        setGameLogId(data.gameLogId);
        socket.emit("startGame", data.gameLogId);
        // setProblems(data["gameLogId"].problemId);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  const goToCode = async () => {
    await startGame();
    
    // router.push('/code');
  };

  const goToLobby = () => {
    router.push('/');
  };

  const addPlayer = (users) => {
    // console.log(info);
    // console.log(allPlayer);
    let copyPlayers = [...defaultUsers];
    
    for(let i = 0; i < users.length; i++) {
      if(players[i].isPlayer === false) {
        copyPlayers[i].nickname = users[i].uname;
        // copyPlayers[i].imageUrl = users[i].uimg === '' ? '/jinny.jpg' : users[i].uimg;
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
        {/* <CheckValidUser func={() => {}} /> */}
      </>
      }
    />
  )
}
