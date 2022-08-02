import { useState } from 'react';
import Image from 'next/image';
import Chart from '../../components/chart';
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
  }
  if (ranking == 1) {
    imgUrl = '/rank/king.png';
  }
  return imgUrl;
};

export const MyInfoMini = ({ myInfo, data }) => {
 return (
   <div className={styles.myInfoMini}>
    <div className={styles.myInfoRow}>
      <div className={styles.myProfileIcon}>
        <Image src={myInfo?.avatarUrl ? myInfo.avatarUrl : (data?.avatarUrl ?? '/default_profile.jpg')} width={80} height={80} className={styles.myProfileIcon} alt="프로필이미지" />
        <div className={styles.myRank}>
          <Image src={getRankImg(myInfo.rank, myInfo.ranking)} width={30} height={30} className={styles.rankIcon} alt="프로필이미지" />
        </div>
      </div>
      <div className={styles.myInfoCol}>
        <div className={styles.nicknameDark}>{myInfo?.gitId ? myInfo.gitId : data?.gitId}</div>
        <div className={styles.myInfoMiniRow}>
          <div className={styles.fieldTitleDark}>{getRankName(myInfo?.rank, myInfo?.ranking) ?? 0}</div>
          <div className={styles.pointTextDark}>{`${myInfo?.totalScore ?? 0 * 5} Point`}</div>
        </div>
        <div className={styles.myInfoMiniRow}>
          <div className={styles.fieldTitleDark}>내 랭킹</div>
          <div className={styles.pointTextDark}>{`${myInfo?.ranking === 9999999999 ? '-' : `${myInfo?.ranking ?? 0}등`}`}</div>
        </div>
      </div>
    </div>
  </div>
  )
}

export const MyInfoBox = ({ myInfo, data }) => {
  const [isDetail, setIsDetail] = useState(false);

  return (
    <div className={styles.infoTab}>
      <div className={styles.myProfileBox}>
        <div className={styles.myProfileHeader}>
          <div className={styles.myProfileTitle}>내 정보</div>
        </div>
        <div className={styles.myProfileBody}>
          <div className={styles.myInfoRow}>
            <div className={styles.myProfileIcon}>
              <Image src={myInfo?.avatarUrl ? myInfo.avatarUrl : (data?.avatarUrl ?? '/default_profile.jpg')} width={80} height={80} className={styles.myProfileIcon} alt="프로필이미지" />
              <div className={styles.myRank}>
                <Image src={getRankImg(myInfo.rank, myInfo.ranking)} width={30} height={30} className={styles.rankIcon} alt="프로필이미지" />
              </div>
            </div>
            <div className={styles.myInfoCol}>
              <div className={styles.nickname}>{myInfo?.gitId ? myInfo.gitId : data?.gitId}</div>
              <div className={styles.rankBox}>
                <div className={styles.fieldTitle}>{getRankName(myInfo?.rank, myInfo?.ranking)}</div>
                <div className={styles.pointText}>{`${myInfo?.totalScore ?? 0 * 5} Point`}</div>
              </div>
            </div>
          </div>
          <div className={styles.splitterHorizontal} />
          <div className={styles.myInfoRow} style={{ margin: '-0.25rem' }}onClick={() => setIsDetail(prev => !prev)}>
            <Image src={isDetail ? '/arrow_up.png' : '/arrow_down.png'} width={20} height={20} alt="load more.." />
          </div>
          {
            isDetail
            && <>
                <div className={styles.splitterHorizontal} />
                <div className={styles.myInfoRow}>
                  <div className={styles.myInfoCol}>
                    <div className={styles.fieldTitle}>내 랭킹</div>
                    <div className={styles.percentText} style={{ paddingTop: '0.25rem', paddingBottom: 0, overflow: 'hidden' }}>{`${myInfo?.ranking === 9999999999 ? '-' : `${myInfo?.ranking ?? 0}등`}\n(상위 ${myInfo?.rankingPercent ?? 100}%)`}</div>
                  </div>
                  <div className={styles.splitterVertical} />
                  <div className={styles.myInfoCol}>
                    <div className={styles.fieldTitle}>사용 언어</div>
                    <div className={styles.percentText}>{myInfo?.mostLanguage ? myInfo?.mostLanguage : '-'}</div>
                  </div>
                  <div className={styles.splitterVertical} />
                  <div className={styles.chartBox}>
                    <Chart data={myInfo?.language} />
                  </div>
                </div>
                <div className={styles.splitterHorizontal} />
                <div className={styles.myInfoRow}>
                  <div className={styles.myInfoCol}>
                    <div className={styles.fieldTitle}>평균 통과율</div>
                    <div className={styles.percentText}>{`${(myInfo?.totalSolo + myInfo?.totalTeam) ? parseInt(myInfo?.totalPassRate / (myInfo?.totalSolo + myInfo?.totalTeam)) : 0}%`}</div>
                  </div>
                  <div className={styles.splitterVertical} />
                  <div className={styles.myInfoCol}>
                    <div className={styles.fieldTitle}>Solo 승률</div>
                    <div className={styles.percentText}>{`${myInfo?.totalSolo ? parseInt(myInfo?.winSolo / myInfo?.totalSolo * 100) : 0}%`}</div>
                  </div>
                  <div className={styles.splitterVertical} />
                  <div className={styles.myInfoCol}>
                    <div className={styles.fieldTitle}>Team 승률</div>
                    <div className={styles.percentText}>{`${myInfo?.totalTeam ? parseInt(myInfo?.winTeam / myInfo?.totalTeam * 100) : 0}%`}</div>
                  </div>
                  </div>
                </>
          }
        </div>
      </div>
    </div>
  )
}