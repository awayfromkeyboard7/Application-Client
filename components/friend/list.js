import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import Item from './item';
import SearchItem from './searchItem';
import styles from '../../styles/components/friend.module.scss';

export default function FriendList({ onClick }) {
  const [myInfo, setMyInfo] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    socket.on('followingUserConnect', user => {
      console.log('following user connect!!!!!', user);
      // setUserList(prev => [...prev, { gitId: user, avatarUrl: '/default_profile.jpg' }]);
      setUserList(prev => {
        let newList = [...prev, { gitId: user, avatarUrl: '/default_profile.jpg' }];
        let mySet = new Set();
        const unique = newList.filter(item => {
          const alreadyHas = mySet.has(item.gitId)
          mySet.add(item.gitId)
          return !alreadyHas
        })
        return unique;
      })
    });
    socket.on('followingUserDisconnect', user => {
      console.log('following user disconnect!!!!!', user);
      setUserList(prev => prev.filter((friend) => user !== friend.gitId));
    });
    socket.on('getFollowingList', users => {
      console.log('get followingList!!!!!', users);
      setUserList(users);
    });
    getFriends();
    getMyInfo();
  }, []);

  useEffect(() => {
    if(searchText === '') {
      getFriends();
      setIsSearch(false);
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
        setUserList(null);
      }
    })
    .catch(error => console.log('error >> ', error));
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
        setUserList([data.UserInfo]);
      } else {
        setUserList([]);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  const onChange = (e) => {
    setSearchText(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if(searchText !== '') {
      findUser();
      setIsSearch(true);
    }
  };

  const FollowingList = () => {
    if(!userList || userList?.length === 0) {
      return <div className={styles.infoText}>팔로우중인 유저가 없습니다.</div>;
    }
    return (
      userList?.map(user => 
        <Item 
          key={user.gitId}
          gitId={user.gitId} 
          isOnline={true} 
          onClick={() => onClick(user.gitId)}
        />
      )
    )
  };

  const SearchList = () => {
    if(userList?.length === 0) {
      return <div className={styles.infoText}>{`${searchText} 유저가 없습니다.`}</div>;
    }
    return (
      userList?.map(user => 
        <SearchItem 
          key={user.gitId}
          gitId={user.gitId} 
          nodeId={user.nodeId}
          myInfo={myInfo}
          isOnline={false} 
          onClick={() => onClick(user.gitId)}
        />
      )
    )
  }

  return (
    <> 
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} type="text" placeholder="아이디를 검색하세요." value={searchText} onChange={onChange} />
        <input className={styles.searchBtn} type="submit" value="검색" />
      </form>
      {
        isSearch
        ? <SearchList />
        : <FollowingList />
      }
    </>
  )
}