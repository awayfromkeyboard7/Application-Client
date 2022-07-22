import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getCookie } from 'cookies-next';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Header from '../../../components/header';
import Wait from '../../../components/wait/box';
import Sidebar from '../../../components/sidebar';
import Loading from '../../../components/loading';
import CheckValidAccess from '../../../components/checkValidAccess';

export default function WaitPage() {
  const router = useRouter();
  const { status } = useSession();
  const gitId = getCookie('gitId');
  const avatarUrl = getCookie('avatarUrl');
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
  const [players, setPlayers] = useState(JSON.parse(JSON.stringify(defaultUsers)));
  const [countdown, setCountdown] = useState(179);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    socket.on('timeLimit', (ts) => {
      setCountdown(parseInt(ts / 1000));
    });
    if (router.isReady) {
      if (router?.query?.mode === 'team'){
        if (router?.query?.roomId === gitId) {
          socket.emit('createTeam', { gitId, avatarUrl });
        }
        socket.on('enterNewUserToTeam', (users) => {
          addPlayer(users);
        });
        socket.on('setUsers', (users) => {
          addPlayer(users);
        });

        // 팀전 대기 중 화면으로 이동
        socket.once('goToMatchingRoom', (bangjang) => {
          setIsMatching(true);
          router.push({
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
        socket.emit('waitGame', { gitId, avatarUrl });
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
  }, [router.isReady]);

  useEffect(() => {
    if(countdown === 5) {
      if (router.isReady) {
        if (router?.query?.mode === 'team'){
          if(players[0]?.gitId === gitId && !isMatching) {
            goToMatch();
          }
        } else {
          if(players[0]?.gitId === gitId) {
            goToCode();
          }
        }
      }
    }
  }, [countdown, router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      if (router?.query?.mode === 'team') {
        socket.on('exitTeamGame', () => {
          router.push('/');
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
    
    socket.emit('getRoomId');
    socket.once('getRoomId', async (roomId, status) => {
      if (status === 'waiting') {
        await fetch(`/server/api/gamelog/createNew`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            players: sendPlayers,
            totalUsers: sendPlayers.length,
            roomId : roomId
          }),
        })
        .then(res => res.json())
        .then(data => {
          if(data.success) {
            // setGameLogId(data.gameLogId);
            socket.emit('startGame', data.gameLogId);
          }
        })
        .catch(error => console.log('error >> ', error));
      }
    });

    return () => {
      socket.off('getRoomId');
    }
  };

  const goToCode = async () => {
    await startGame();
  };

  const goToMatch = () => {
    socket.emit('goToMatchingRoom', gitId);
  };

  const goToLobby = () => {
    router.push('/');
  };

  const goToMyPage = () => {
    router.push('/mypage');
  };

  const addPlayer = (users) => {
    console.log('add player >>> ', users);
    let copyPlayers = JSON.parse(JSON.stringify(defaultUsers));
    
    console.log('copy players >>> ', copyPlayers);
    for(let i = 0; i < users?.length; i++) {
      console.log('add player for >>. ', i);
      copyPlayers[i].gitId = users[i].gitId;
      copyPlayers[i].avatarUrl = users[i].avatarUrl ?? '/default_profile.jpg';
      copyPlayers[i].isPlayer = true;
    }
    
    console.log('copy players >>> ', copyPlayers);
    setPlayers(copyPlayers);
  }

  return (
    <Layout 
      header={<Header label="마이페이지" onClickBtn={goToMyPage} />}
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
          <CheckValidAccess check={router?.query?.mode} message="메인 화면에서 모드를 선택해주세요." />
          <Wait 
            type={router?.query?.mode} 
            players={players} 
            countdown={countdown}
            onClickGoToMain={goToLobby} 
            onClickPlayAgain={router?.query?.mode === 'team' ? goToMatch : goToCode}
          />
          <Sidebar />
        </>
      }
    />
  )
}
