import Item from './item';
import styles from '../../styles/components/friend.module.scss';

export default function Ranking({ friends }) {
  return (
    <div className={styles.friendsList}>
      <div className={styles.friendsHeader}>친구목록</div>
      {
        friends.map(friend => 
          <Item 
            key={friend.nickname}
            nickname={friend.nickname} 
            isOnline={friend.isOnline} 
          />)
      }
    </div>
  )
}