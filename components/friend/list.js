import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import Item from './item';
import SearchItem from './searchItem';
import styles from '../../styles/components/friend.module.scss';

export default function FriendList({ onClick }) {
  const [userList, setUserList] = useState([
    {
      gitId: 'annie1229',
      avatarUrl: '/jinny.jpg',
      isOnline: true
    }
  ]);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    if(searchText === '') {
      getFriends();
      setIsSearch(false);
    }
  }, [searchText]);

  const getFriends = async() => {
    await fetch(`/server/api/gamelog/getGameLog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gitId: getCookie('uname')
      }),
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setUserList(data.friends);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  const findUser = async() => {
    await fetch(`/server/api/gamelog/getGameLog`, {
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
        setUserList([data.user]);
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
      // findUser();
      setIsSearch(true);
    }
  };

  const FollowingList = () => {
    if(userList.length === 0) {
      return <div className={styles.infoText}>팔로우중인 유저가 없습니다.</div>;
    }
    return (
      userList.map(user => 
        <Item 
          key={user.gitId}
          gitId={user.gitId} 
          isOnline={user.isOnline} 
          onClick={() => onClick(user.gitId)}
        />
      )
    )
  };

  const SearchList = () => {
    if(userList.length === 0) {
      return <div className={styles.infoText}>{`${searchText} 유저가 없습니다.`}</div>;
    }
    return (
      userList.map(user => 
        <SearchItem 
          key={user.gitId}
          gitId={user.gitId} 
          isOnline={user.isOnline} 
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