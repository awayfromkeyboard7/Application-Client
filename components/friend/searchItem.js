import { useState, useEffect } from 'react';
import Image from 'next/image';
import { setCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import styles from '../../styles/components/friend.module.scss';

export default function SearchItem({ user, myInfo, isOnline }) {
  const [myFollowing, setMyFollowing] = useState(myInfo.following);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if(myFollowing.length) {
      setCookie('following', JSON.stringify(myFollowing));
    }
  }, [myFollowing]);

  useEffect(() => {
    // 이미 팔로우중인 사용자인지 확인하고 isFollow state 변경
    myFollowing?.map(userId => {
      if(userId === user._id) {
        setIsFollow(true);
      }
    });
  }, [myFollowing, user]);

  const onClickFollow = () => {
    socket.emit('followMember', user._id);
    setMyFollowing(prev => [...prev, user._id]);
    setIsFollow(true);
  };
  
  const onClickUnFollow = () => {
    socket.emit('unFollowMember', user._id);
    setMyFollowing(prev => prev.filter(userId => userId !== user._id));
    setIsFollow(false);
  };

  return (
    <div className={styles.friendElem} key={user.gitId}>
      <div className={styles.connectInfo}>
        <Image src={isOnline ? '/online.png' : '/offline.png'} alt="online" width={10} height={10} />
      </div>
      <div className={styles.friendNickname}>{user.gitId}</div>
      {
        isFollow
        ? <div className={styles.inviteBtnClicked} onClick={onClickUnFollow}>언팔로우</div>
        : <div className={styles.inviteBtn} onClick={onClickFollow}>팔로우</div>
      }
    </div>
  )
}