import { useState } from 'react';
import Image from 'next/image';
import Friends from './friend/list';
import ChatRoomList from './chat/list';
import styles from '../styles/components/sidebar.module.scss';
import { socket } from '../lib/socket';
import { getCookie } from 'cookies-next';

export default function Sidebar({ menu='friends' }) {
  const [sidebarMenu, setSidebarMenu] = useState(menu);
  const [roomName, setRoomName] = useState('');

  const onClickFriend = (friend) => {
    setRoomName(friend);
    setSidebarMenu('chat');
    console.log(friend);
    socket.emit("getChatMessage", getCookie('gitId'), friend);
  };

  const onClickBack = () => {
    setSidebarMenu('friends');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
      {
        sidebarMenu === 'friends'
        ? <div className={styles.headerTitleActive} onClick={() => setSidebarMenu('friends')}>친구목록</div>
        : <div className={styles.headerTitleActive}>
            <div className={styles.header}>
              <div className={styles.icon} onClick={onClickBack}>
                <Image src="/back_white.png" width={25} height={25} className={styles.icon} />
              </div>
              <div className={styles.title}>{roomName}</div>
              <div className={styles.icon}></div>
            </div>
          </div>
      }
      </div>
      <div className={styles.sidebarBody}>
      {
        sidebarMenu === 'friends'
        ? <Friends onClick={friend => onClickFriend(friend)} />
        : <ChatRoomList roomName={roomName} />
      }
      </div>
      <div className={styles.sidebarFooter}>
      </div>
    </div>
  )
}