import Item from './item';
import styles from '../../styles/components/friend.module.scss';

export default function FriendList({ friends, onClick }) {
  return (
    <div className={styles.friendContainer}> 
    {
      friends.map(friend => 
        <Item 
          key={friend.nickname}
          nickname={friend.nickname} 
          isOnline={friend.isOnline} 
          onClick={onClick}
        />
      )
    }
    </div>
  )
}