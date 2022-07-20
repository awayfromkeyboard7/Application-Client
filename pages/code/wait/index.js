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

export default function WaitPage() {
  const router = useRouter();
  const { status } = useSession();
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
  const [countdown, setCountdown] = useState(179);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    socket.on('timeLimit', ts => {
      setCountdown(parseInt(ts / 1000));
    });
    console.log(router?.query?.mode);
    if (router.isReady) {
      if (router?.query?.mode === 'team'){
        if (router?.query?.roomId === getCookie('gitId')) {
          socket.emit('createTeam', { gitId: getCookie('gitId'), avatarUrl: getCookie('avatarUrl') });
        }
        socket.on('timeOut', () => {
          if(players[0]?.gitId === getCookie('gitId') && !isMatching) {
            goToMatch();
          }
        });
        socket.on('enterNewUserToTeam', (users) => {
          addPlayer(users);
        });
        socket.on('setUsers', (users) => {
          addPlayer(users);
        });

        // 팀전 대기 중 화면으로 이동
        socket.once("goToMachingRoom", (bangjang) => {
          setIsMatching(true);
          router.push({
            pathname: '/code/match',
            query: { mode: 'team', roomId: bangjang }
          })
        });
        
        socket.on('enterNewUserToTeam', (users) => {
          addPlayer(users);
        });
        socket.on('setUsers', (users) => {
          addPlayer(users);
        });
  
        // 팀전 대기 중 화면으로 이동
        socket.on("goToMachingRoom", (bangjang) => {
          router.push({
            pathname: '/code/match',
            query: { mode: 'team', roomId: bangjang }
          });
        })
        socket.emit('getUsers', router?.query?.roomId);
      } 
      else {
        socket.on('timeOut', () => {
          if(players[0]?.gitId === getCookie('gitId')) {
            goToCode();
          }
        });
        socket.on('enterNewUser', (users) => {
          addPlayer(users);
        });
        socket.on('startGame', (gameLogId) => {
          setGameLogId(gameLogId);
        });
        socket.emit('waitGame', { gitId: getCookie('gitId'), avatarUrl: getCookie('avatarUrl') });
      }
    }

    return () => {
      socket.off('timeLimit');
      socket.off('timeOut');
      socket.off('enterNewUserToTeam');
      socket.off('goToMachingRoom');
      socket.off('setUsers');
      socket.off('enterNewUser');
      socket.off('startGame');
    };
  }, [router.isReady]);


  useEffect(() => {
    if (router?.query?.mode === 'team') {
      socket.on('exitTeamGame', () => {
        router.push('/');
      });
    } 
    else {
      socket.on('exitWait', (users) => {
        addPlayer(users);
      });
    }

    return () => {
      socket.off('exitTeamGame');
      socket.off('exitWait');
    };
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

    await fetch(`/server/api/gamelog/createNew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        players: sendPlayers,
        totalUsers: sendPlayers.length
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

  const goToMatch = () => {
    console.log('matching players.........',getCookie('gitId'), players );
    socket.emit('goToMachingRoom', getCookie('gitId'));
  };

  const goToLobby = () => {
    if (router?.query?.mode === 'team') {
      socket.emit('exitTeamGame', router?.query?.roomId, getCookie('gitId'));
    } 
    else {
      socket.emit('exitWait', getCookie('gitId'));
      router.push('/');
  }
  };

  const goToMyPage = () => {
    router.push('/mypage');
  };

  const addPlayer = (users) => {
    let copyPlayers = [...defaultUsers];
    
    for(let i = 0; i < users?.length; i++) {
      copyPlayers[i].gitId = users[i].gitId;
      copyPlayers[i].avatarUrl = users[i].avatarUrl ?? '/jinny.jpg';
      copyPlayers[i].isPlayer = true;
    }
    
    setPlayers(copyPlayers);
  }

  return (
    <Layout 
      header={<Header label="마이페이지" onClickBtn={goToMyPage} />}
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
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
