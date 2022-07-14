import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Header from '../../../components/header';
import Wait from '../../../components/wait/box';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';

export default function WaitPage() {
  const router = useRouter();  
  const defaultUsers = [
    {
      id: 1,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
    {
      id: 2,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
    {
      id: 3,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
    {
      id: 4,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
    {
      id: 5,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
    {
      id: 6,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
    {
      id: 7,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
    {
      id: 8,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      isPlayer: false
    },
  ];
  const [gameLogId, setGameLogId] = useState('');
  const [players, setPlayers] = useState(defaultUsers);

  // useEffect(() => {
  //   // router.beforePopState(() => {
  //   //   alert('exit before leaving!!!!!');
  //   //   socket.emit('exitWait', getCookie('uname'));
  //   // })
  //   const handler = () => {
  //     alert('exit before leaving!!!!!');
  //     socket.emit('exitWait', getCookie('uname'));
  //     throw 'route change abort!!!';
  //   };
  //   router.events.on('routeChangeStart', handler);

  //   return () => {
  //     router.events.off('routeChangeStart', handler);
  //   }
  // }, [router]);

  useEffect(() => {
    // const exitWait = (e) => {
    //   e.preventDefault();
    //   // window.alert('exit page???');
    //   // alert('exit page???');
    //   // console.log('exit wait function!!!!!', getCookie('uname'));
    //   // socket.emit('exitWait', getCookie('uname'));
    //   e.returnValue = '';
    // };

    // window.addEventListener('beforeunload', exitWait);
    socket.on('enterNewUser', (users) => {
      addPlayer(users);
    });
    socket.on('startGame', (gameLogId) => {
      setGameLogId(gameLogId);
    });
    socket.emit('waitGame', { gitId: getCookie('uname'), avatarUrl: getCookie('uimg') });

    return () => {
      console.log('exit wait screen!!!!!', getCookie('uname'));
      // window.removeEventListener('beforeunload', exitWait);
      // socket.emit('exitWait', getCookie('uname'));
      // changeSocketConnection(process.env.NEXT_PUBLIC_SOCKET_PROVIDER);
    }
  }, []);


  useEffect(() => {
    socket.on('exitWait', (users) => {
      addPlayer(users);
    });
  }, [players]);

  useEffect(() => {
    if(gameLogId !== '') {
      router.push({
        pathname: '/code',
        query: { gameLogId, mode: router?.query?.mode }
      });
    }
  }, [gameLogId]);
  
  const startGame = async() => {
    let sendPlayers = [];
    for(let player of players) {
      if(player.isPlayer) {
        sendPlayers.push({ gitId: player.gitId, avatarUrl: player.avatarUrl})
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
        socket.emit('startGame', data.gameLogId);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  const goToCode = async () => {
    await startGame();
  };

  const goToLobby = () => {
    socket.emit('exitWait', getCookie('uname'));
    router.push('/');
  };

  const goToMyPage = () => {
    router.push('/mypage');
  };

  const addPlayer = (users) => {
    let copyPlayers = [...defaultUsers];
    console.log('add player>>>>>>>', users);
    for(let i = 0; i < users.length; i++) {
      if(copyPlayers[i].isPlayer === false) {
        copyPlayers[i].gitId = users[i].gitId;
        copyPlayers[i].avatarUrl = users[i].avatarUrl ?? '/jinny.jpg';
        copyPlayers[i].isPlayer = true;
      }
    }
    console.log('addplayer', copyPlayers);
    setPlayers(copyPlayers);
  }

  return (
    <Layout 
      header={<Header label="마이페이지" onClickBtn={goToMyPage} />}
      body={
        <>
          <Wait 
            type={router?.query?.mode} 
            players={players} 
            onClickGoToMain={goToLobby} 
            onClickPlayAgain={goToCode}
          />
          <Sidebar />
          <CheckValidUser />
        </>
      }
    />
  )
}
