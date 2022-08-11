import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import Item from './item';
import SearchItem from './searchItem';
import { MyInfoMini } from '../mypage/myInfo';
import styles from '../../styles/components/friend.module.scss';

export default function FriendList({ onClick, players=null }) {
  const router = useRouter();
  const { data } = useSession();
  const [myInfo, setMyInfo] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResultText, setSearchResultText] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    socket.on('followingUserConnect', gitId => {
      setUserList(prev => {
        let newList = [...prev, { gitId, avatarUrl: '/default_profile.jpg' }];
        let mySet = new Set();
        const unique = newList.filter(item => {
          const alreadyHas = mySet.has(item.gitId)
          mySet.add(item.gitId)
          return !alreadyHas
        })
        return unique;
      })
    });
    socket.on('followingUserDisconnect', gitId => {
      setUserList(prev => prev.filter(friend => gitId !== friend.gitId));
    });
    socket.on('getFollowingList', users => {
      setUserList(users);
    });

    return () => {
      socket.off('followingUserConnect');
      socket.off('followingUserDisconnect');
      socket.off('getFollowingList');
    };
  }, []);

  useEffect(() => {
    if(data?.gitId) {
      getMyInfo();
    }
  }, [data?.gitId]);

  useEffect(() => {
    if(searchText === '') {
      getMyInfo();
      getFriends();
      setIsSearch(false);
      setSearchResultText('');
    }
  }, [searchText]);

  const getFriends = async() => {
    if(getCookie('jwt')) {
      socket.emit('getFollowingList');
    }
  };

  const getMyInfo = async() => {
    await fetch(`/server/api/user/info?id=getmyinformation`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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
      if(data.success) {
        setMyInfo(data.UserInfo);
      } else {
        setUserList([]);
      }
    })
    .catch(error => console.log('[/components/friend/list] getMyInfo error >> ', error));
  };

  const findUser = async() => {
    await fetch(`/server/api/user/search?gitid=${searchText}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
      if(data.success) {
        setSearchList([data.UserInfo]);
      } else {
        setSearchList([]);
      }
    })
    .catch(error => console.log('[/components/friend/list] findUser error >> ', error));
  };

  const onChange = (e) => {
    setSearchText(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if(searchText !== '') {
      findUser();
      setIsSearch(true);
      setSearchResultText(searchText);
    }
  };

  const checkInviteMember = (user) => {
    if(router?.pathname === '/code/wait' && router?.query?.mode === 'team') {
      if(players && players.length) {
        for(let player of players) {
          if(player.gitId === user.gitId) {
            return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <> 
      <MyInfoMini myInfo={myInfo} data={data} />
      <div className={styles.headerTitleActive}>친구목록</div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.inputBox}>
          <input className={styles.input} type="text" placeholder="아이디를 검색하세요." value={searchText} onChange={onChange} />
          {
            searchText !== ''
            && <div className={styles.closeBtn} onClick={() => setSearchText('')}>
                <Image src="/close.png" width={20} height={20} alt="delete search friends"/>
              </div>
          }
        </div>
        <input className={styles.searchBtn} type="submit" value="검색" />
      </form>
      {
        isSearch
        ? <>
          {
            searchList?.length === 0
            ? <div className={styles.infoText}>{`${searchResultText} 유저가 없습니다.`}</div>
            : <>
              {
                searchList?.map(user => 
                  <SearchItem 
                    key={user.gitId}
                    user={user}
                    myInfo={myInfo}
                    isOnline={false} 
                  />
                )
              }
              </>
          }
          </>
        : <>
          {
            !userList || userList?.length === 0
            ? <div className={styles.infoText}>현재 접속중인 유저가 없습니다.</div>
            : <>
              {
                userList?.map(user => 
                  <Item 
                    key={user.gitId}
                    user={user}
                    isOnline={true} 
                    isInvite={checkInviteMember(user)}
                    onClick={() => onClick(user)}
                  />
                )
              }
              </>
          }
          </>
        }
    </>
  )
}