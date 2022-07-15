import { useState } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import styles from '../../styles/components/friend.module.scss';

export default function FriendItem({ nickname, isOnline, onClick }) {
  const [isClick, setIsClick] = useState(false);

  const onClickInvite = () => {
    if(isClick === false) {
      socket.emit('inviteMember', getCookie('uname'), nickname)
      setIsClick(true);
    }
  }

  return (
    <div className={styles.friendElem} key={nickname}>
      <div className={styles.connectInfo}>
        <Image src={isOnline ? '/online.png' : '/offline.png'} alt="online" width={10} height={10} />
      </div>
      <div className={styles.friendNickname} onClick={() => onClick(nickname)}>{nickname}</div>
      {
        isOnline
        ? <div className={isClick ? styles.inviteBtnClicked : styles.inviteBtn} onClick={onClickInvite}>초대</div>
        : <div className={styles.inviteBtnDisable}>초대</div>
      }
    </div>
  )
}