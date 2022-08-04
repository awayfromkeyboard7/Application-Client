import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Header from '../../../components/header';
import Wait from '../../../components/wait/box';
import Sidebar from '../../../components/sidebar';
import Loading from '../../../components/loading';
import CheckValidAccess from '../../../components/checkValidAccess';

export default function WaitPage() {
  const router = useRouter();
  const { data, status } = useSession();
  const [isLogin, setIsLogin] = useState(false);
  const defaultUsers = [
    {
      id: 1,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
    {
      id: 2,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
    {
      id: 3,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
    {
      id: 4,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
    {
      id: 5,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
    {
      id: 6,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
    {
      id: 7,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
    {
      id: 8,
      gitId: 'waiting...',
      avatarUrl: '/default_profile.jpg',
      userId: '',
      isPlayer: false
    },
  ];
  const [gameLogId, setGameLogId] = useState('');
  const [players, setPlayers] = useState(JSON.parse(JSON.stringify(defaultUsers)));
  const [countdown, setCountdown] = useState(179);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status]);

  useEffect(() => {
    socket.on('timeLimit', (ts) => {
      setCountdown(parseInt(ts / 1000));
    });
    if (router.isReady && isLogin) {
      if (router?.query?.mode === 'team'){
        if (router?.query?.roomId === data?.gitId) {
          socket.emit('createTeam');
        }
        socket.on('enterNewUserToTeam', (users) => {
          addPlayer(users);
        });
        socket.on('setUsers', (users) => {
          addPlayer(users);
        });

        socket.once('goToMatchingRoom', (bangjang) => {
          setIsMatching(true);
          router.replace({
            pathname: '/code/match',
            query: { mode: 'team', roomId: bangjang }
          })
        });

        socket.emit('getUsers', router?.query?.roomId);
      } else {
        socket.on('enterNewUser', (users) => {
          addPlayer(users);
        });
        socket.once('startGame', (gameLogId) => {
          setGameLogId(gameLogId);
        });
        socket.emit('waitGame');
      }
    }

    return () => {
      socket.off('timeLimit');
      socket.off('timeOut');
      socket.off('enterNewUserToTeam');
      socket.off('goToMatchingRoom');
      socket.off('setUsers');
      socket.off('enterNewUser');
      socket.off('startGame');
    };
  }, [router.isReady, isLogin]);

  useEffect(() => {
    if(countdown === 5) {
      if (router.isReady && isLogin) {
        if (router?.query?.mode === 'team'){
          if(players[0]?.gitId === data?.gitId && !isMatching) {
            goToMatch();
          }
        } else {
          if(players[0]?.gitId === data?.gitId) {
            goToCode();
          }
        }
      }
    }
  }, [countdown, router.isReady, isLogin]);

  useEffect(() => {
    if(router.isReady) {
      if(router?.query?.mode === 'team') {
        socket.on('exitTeamGame', () => {
          router.replace('/');
        });
      } else {
        socket.on('exitWait', (users) => {
          addPlayer(users);
        });
      }
  
      return () => {
        socket.off('exitTeamGame');
        socket.off('exitWait');
      };
    }

  }, [players, router.isReady]);

  useEffect(() => {
    if(gameLogId !== '') {
      router.replace({
        pathname: '/code',
        query: { gameLogId, mode: router?.query?.mode }
      });
    }
  }, [gameLogId]);

  useEffect(() => {
    let sendPlayers = [];
    for(let player of players) {
      if(player.isPlayer) {
        sendPlayers.push({ gitId: player.gitId, avatarUrl: player.avatarUrl, userId: player.userId })
      }
    };

    if (sendPlayers.length === 8 && players[0]?.gitId === data?.gitId) {
      goToCode();
    }
    
    socket.once('getRoomId', async (roomId, status) => {
      if(status === 'waiting') {
        await fetch(`/server/api/gamelog`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            players: sendPlayers,
            totalUsers: sendPlayers.length,
            roomId
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
          if(data.success && isLogin) {
            socket.emit('startGame', data.gameLogId);
          }
        })
        .catch(error => console.log('[/pages/code create GameLog error >> ', error));
      }
    });

    return () => {
      socket.off('getRoomId');
    }
  }, [players, isLogin]);
  
  const startGame = async() => {
    socket.emit('getRoomId');
  };

  const goToCode = async () => {
    await startGame();
  };

  const goToMatch = () => {
    socket.emit('goToMatchingRoom');
  };

  const goToLobby = () => {
    router.replace('/');
  };

  const goToMyPage = () => {
    router.replace('/mypage');
  };

  const addPlayer = (users) => {
    let copyPlayers = JSON.parse(JSON.stringify(defaultUsers));
    
    for(let i = 0; i < users?.length; i++) {
      copyPlayers[i].gitId = users[i].gitId;
      copyPlayers[i].avatarUrl = users[i].avatarUrl ?? '/default_profile.jpg';
      copyPlayers[i].userId = users[i].userId;
      copyPlayers[i].isPlayer = true;
    }
    
    setPlayers(copyPlayers);
  };

  return (
    <Layout 
      header={
        <Header 
          label="마이페이지" 
          onClickBtn={goToMyPage} 
          checkValidUser={(isValidUser) => setIsLogin(isValidUser)} 
        />
      }
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
          { router.isReady && <CheckValidAccess check={router?.query?.mode} message="메인 화면에서 모드를 선택해주세요." /> }
          { 
            isLogin
            && <Wait 
                type={router?.query?.mode} 
                players={players} 
                countdown={countdown}
                onClickGoToMain={goToLobby} 
                onClickPlayAgain={router?.query?.mode === 'team' ? goToMatch : goToCode}
              />
          }
          { isLogin && <Sidebar players={players} /> }
        </>
      }
    />
  )
}
