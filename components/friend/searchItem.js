import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import styles from '../../styles/components/friend.module.scss';

export default function FriendItem({ gitId, isOnline, onClick }) {
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    // 이미 팔로우중인 사용자인지 확인하고 isFollow state 변경
  }, []);

  const onClickFollow = () => {
    if(isClick === false) {
      socket.emit('inviteMember', getCookie('gitId'), gitId);
      setIsFollow(true);
    }
  };

  return (
    <div className={styles.friendElem} key={gitId}>
      <div className={styles.connectInfo}>
        <Image src={isOnline ? '/online.png' : '/offline.png'} alt="online" width={10} height={10} />
      </div>
      <div className={styles.friendNickname} onClick={() => onClick(gitId)}>{gitId}</div>
      {
        isFollow
        ? <div className={styles.inviteBtnClicked} onClick={onClickFollow}>팔로우</div>
        : <div className={styles.inviteBtn}>팔로우</div>
      }
    </div>
  )
}