import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import styles from '../../styles/components/friend.module.scss';

export default function FriendItem({ user, myInfo, isOnline, onClick }) {
  const nodeId = getCookie('nodeId');
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    // 이미 팔로우중인 사용자인지 확인하고 isFollow state 변경
    myInfo?.following?.map(userNodeId => {
      if(userNodeId === user.nodeId) {
        setIsFollow(true);
      }
    });
  }, [myInfo]);

  const onClickFollow = () => {
    socket.emit('followMember', nodeId, user.gitId);
    setIsFollow(true);
  };

  const onClickUnFollow = () => {
    socket.emit('unFollowMember', nodeId, user.gitId);
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