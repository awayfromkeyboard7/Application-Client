import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import Item from './item';
import SearchItem from './searchItem';
import styles from '../../styles/components/friend.module.scss';

export default function FriendList({ onClick, players=null }) {
  const router = useRouter();
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
    getMyInfo();

    return () => {
      socket.off('followingUserConnect');
      socket.off('followingUserDisconnect');
      socket.off('getFollowingList');
    };
  }, []);

  useEffect(() => {
    if(searchText === '') {
      getFriends();
      setIsSearch(false);
      setSearchResultText('');
    }
  }, [searchText]);

  const getFriends = async() => {
    socket.emit('getFollowingList', getCookie('nodeId'));
  };

  const getMyInfo = async() => {
    await fetch(`/server/api/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gitId: getCookie('gitId')
      }),
    })
    .then(res => res.json())
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
    await fetch(`/server/api/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gitId: searchText
      }),
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setSearchList([data.UserInfo]);
        getMyInfo();
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
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.inputBox}>
          <input className={styles.input} type="text" placeholder="???????????? ???????????????." value={searchText} onChange={onChange} />
          {
            searchText !== ''
            && <div className={styles.closeBtn} onClick={() => setSearchText('')}>
                <Image src="/close.png" width={20} height={20} alt="delete search friends"/>
              </div>
          }
        </div>
        <input className={styles.searchBtn} type="submit" value="??????" />
      </form>
      {
        isSearch
        ? <>
          {
            searchList?.length === 0
            ? <div className={styles.infoText}>{`${searchResultText} ????????? ????????????.`}</div>
            : <>
              {
                searchList?.map(user => 
                  <SearchItem 
                    key={user.gitId}
                    user={user}
                    myInfo={myInfo}
                    isOnline={false} 
                    onClick={() => setSearchText('')}
                  />
                )
              }
              </>
          }
          </>
        : <>
          {
            !userList || userList?.length === 0
            ? <div className={styles.infoText}>?????? ???????????? ????????? ????????????.</div>
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