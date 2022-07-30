import Image from 'next/image';
import styles from '../../styles/pages/mypage.module.scss';

const getRankName = (rank, ranking) => {
  let myrank = 'Bronze';
  switch (rank) {
    case 0:
      myrank = 'Bronze';
      break;
    case 1:
      myrank = 'Silver';
      break;
    case 2:
      myrank = 'Gold';
      break;
    case 3:
      myrank = 'Platinum';
      break;
    case 4:
      myrank = 'Diamond';
      break;
    case 5:
      myrank = 'Master';
      break;
    default:
      myrank = 'Bronze'
  }
  if (ranking === 1) {
    myrank = 'King';
  }
  return myrank;
};

const getRankImg = (rank, ranking) => {
  let imgUrl = '/rank/rank0.png';
  switch (rank) {
    case 0:
      imgUrl = '/rank/rank0.png';
      break;
    case 1:
      imgUrl = '/rank/rank1.png';
      break;
    case 2:
      imgUrl = '/rank/rank2.png';
      break;
    case 3:
      imgUrl = '/rank/rank3.png';
      break;
    case 4:
      imgUrl = '/rank/rank4.png';
      break;
    case 5:
      imgUrl = '/rank/rank5.png';
      break;
    default:
      imgUrl = '/rank/rank0.png';
  }
  if (ranking == 1) {
    imgUrl = '/rank/king.png';
  }
  return imgUrl;
};

const getPercent = (rank, total) => {
  if(rank && total) {
    return (parseInt(rank / total * 1000) / 10);
  }
  return 100;
};

export function MyInfoMini({ myInfo }) {
 return (
   <div className={styles.myInfoMini}>
    <div className={styles.myInfoRow}>
      <div className={styles.myProfileIcon}>
        <Image src={myInfo.avatarUrl ?? '/default_profile.jpg'} width={80} height={80} className={styles.myProfileIcon} alt="프로필이미지" />
        <div className={styles.myRank}>
          <Image src={getRankImg(myInfo.rank, myInfo.ranking) ?? '/rank/rank0.png'} width={30} height={30} className={styles.rankIcon} alt="프로필이미지" />
        </div>
      </div>
      <div className={styles.myInfoCol}>
        <div className={styles.nicknameDark}>{myInfo?.gitId}</div>
        <div className={styles.myInfoMiniRow}>
          <div className={styles.fieldTitleDark}>{getRankName(myInfo?.rank, myInfo?.ranking) ?? 0}</div>
          <div className={styles.pointTextDark}>{`${myInfo?.totalScore ?? 0 * 5} Point`}</div>
        </div>
        <div className={styles.myInfoMiniRow}>
          <div className={styles.fieldTitleDark}>내 랭킹</div>
          <div className={styles.pointTextDark}>{`${myInfo?.ranking ?? 0}등`}</div>
        </div>
      </div>
    </div>
  </div>
 )
}

export function MyInfoBox({ myInfo, totalUser=0 }) {
  return (
    <div className={styles.infoTab}>
      <div className={styles.myProfileBox}>
        <div className={styles.myProfileHeader}>
          <div className={styles.myProfileTitle}>내 정보</div>
        </div>
        <div className={styles.myProfileBody}>
          <div className={styles.myInfoRow}>
            <div className={styles.myProfileIcon}>
              <Image src={myInfo.avatarUrl ?? '/default_profile.jpg'} width={80} height={80} className={styles.myProfileIcon} alt="프로필이미지" />
              <div className={styles.myRank}>
                <Image src={getRankImg(myInfo.rank, myInfo.ranking) ?? '/rank/rank0.png'} width={30} height={30} className={styles.rankIcon} alt="프로필이미지" />
              </div>
            </div>
            <div className={styles.myInfoCol}>
              <div className={styles.nickname}>{myInfo?.gitId}</div>
              <div className={styles.rankBox}>
                <div className={styles.fieldTitle}>{getRankName(myInfo?.rank, myInfo?.ranking) ?? 0}</div>
                <div className={styles.pointText}>{`${myInfo?.totalScore ?? 0 * 5} Point`}</div>
              </div>
            </div>
          </div>
          <div className={styles.splitterHorizontal} />
          <div className={styles.myInfoRow}>
            <div className={styles.myInfoCol}>
              <div className={styles.fieldTitle}>내 랭킹</div>
              <div className={styles.percentText}>{`${myInfo?.ranking ?? 0}등 (상위 ${getPercent(myInfo?.ranking, totalUser)}%)`}</div>
            </div>
            <div className={styles.splitterVertical} />
            <div className={styles.myInfoCol}>
              <div className={styles.fieldTitle}>사용 언어</div>
              <div className={styles.percentText}>{myInfo?.mostLanguage ?? ''}</div>
            </div>
          </div>
          <div className={styles.splitterHorizontal} />
          <div className={styles.myInfoRow}>
            <div className={styles.myInfoCol}>
              <div className={styles.fieldTitle}>평균 통과율</div>
              <div className={styles.percentText}>{`${parseInt(myInfo?.totalPassRate / (myInfo?.totalSolo + myInfo?.totalTeam)) ?? 0}%`}</div>
            </div>
            <div className={styles.splitterVertical} />
            <div className={styles.myInfoCol}>
              <div className={styles.fieldTitle}>Solo 승률</div>
              <div className={styles.percentText}>{`${parseInt(myInfo?.winSolo / myInfo?.totalSolo * 100) ?? 0}%`}</div>
            </div>
            <div className={styles.splitterVertical} />
            <div className={styles.myInfoCol}>
              <div className={styles.fieldTitle}>Team 승률</div>
              <div className={styles.percentText}>{`${parseInt(myInfo?.winTeam / myInfo?.totalTeam * 100) ?? 0}%`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}