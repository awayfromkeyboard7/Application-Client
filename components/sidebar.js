import { useState } from 'react';
import Friends from './friend/list';
import ChatRoomList from './chat/list';
import styles from '../styles/components/sidebar.module.scss';

export default function Sidebar({ menu='friends' }) {
  const [sidebarMenu, setSidebarMenu] = useState(menu);
  const [roomName, setRoomName] = useState('A');

  const onClickFriend = (friend) => {
    setRoomName(friend);
    setSidebarMenu('chat');
  };

  const onClickBack = () => {
    setSidebarMenu('friends');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={sidebarMenu === 'friends' ? styles.headerTitleActive : styles.headerTitle} onClick={() => setSidebarMenu('friends')}>친구목록</div>
        <div className={sidebarMenu === 'friends' ? styles.headerTitle : styles.headerTitleActive} onClick={() => setSidebarMenu('chat')}>채팅</div>
      </div>
      <div className={styles.sidebarBody}>
      {
        sidebarMenu === 'friends'
        ? <Friends onClick={friend => onClickFriend(friend)} />
        : <ChatRoomList roomName={roomName} onClickBack={onClickBack} />
      }
      </div>
      <div className={styles.sidebarFooter}>
      </div>
    </div>
  )
}