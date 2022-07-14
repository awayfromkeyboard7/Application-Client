import Item from './item';

export default function FriendList({ friends, onClick }) {
  return (
    <> 
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
    </>
  )
}