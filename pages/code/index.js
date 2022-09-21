import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useMediaQuery } from 'react-responsive';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { socket } from '../../lib/socket';
const Voice = dynamic(() => import('../../components/voice'));
import Layout from '../../components/layouts/main';
import Header from '../../components/header';
import { CodeEditor } from '../../components/codeEditor';
import Problem from '../../components/code/problem';
import Player from '../../components/code/player';
import TeamPlayer from '../../components/code/teamPlayer';
import Output from '../../components/code/output';
import Loading from '../../components/loading';
import CheckValidAccess from '../../components/checkValidAccess';
import 'react-reflex/styles.css';
import styles from '../../styles/pages/code.module.scss';

export default function Code() {
  const router = useRouter();  
  const { data, status } = useSession();
  const [isLogin, setIsLogin] = useState(false);
  const [problems, setProblems] = useState({});
  const [playerList, setPlayerList] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [outputs, setOutputs] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [passRate, setPassRate] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [codeTitle, setCodeTitle] = useState('solution.py');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Python');
  const [countdown, setCountdown] = useState(899);
  const [doc, setDoc] = useState();
  const [provider, setProvider] = useState();
  const [isDoc, setIsDoc] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  let yDoc = new Y.Doc();

  useEffect(() => {
    if(router.isReady) {
      socket.on('timeLimitCode', (ts) => {
        setCountdown(parseInt(ts / 1000));
      });
      socket.on('timeOutCode', () => {
        setCountdown(0);
      });
      socket.on('submitCode', (submitInfo) => {
        setPlayerList(submitInfo);
      });
      socket.on('submitCodeTeam', (result) => {
        setPlayerList([result[0], result[1]]);
      });
      socket.on('teamGameOver', () => {
        router.replace({
          pathname: '/code/result',
          query: { 
            gameLogId: router?.query?.gameLogId,
            mode: router?.query?.mode 
          }
        });
      });
      socket.on('shareJudgedCode', (data) => {
        setOutputs(data);
      });
    }
    
    return () => {
      socket.off('timeLimitCode');
      socket.off('timeOutCode');
      socket.off('submitCode');
      socket.off('submitCodeTeam');
      socket.off('teamGameOver');
      socket.off('shareJudgedCode');
    };
  }, [router.isReady]);

  useEffect(() => {
    if(router.isReady && data?.gitId) {
      if(router?.query?.gameLogId && router.query.gameLogId !== '' && playerList.length === 0) {
        getProblem();
      }

      if(isDoc === false && router?.query?.gameLogId) {
        const url = router?.query?.mode === 'team' ? `${router?.query?.roomId}_${router?.query?.gameLogId}` : `${data?.gitId}_${router?.query?.gameLogId}`
        let yProvider = new WebrtcProvider(url, yDoc, { signaling: ['wss://hjannie.shop/yjs'] });
        setDoc(yDoc);
        setProvider(yProvider);
        setIsDoc(true);
      }
    }

    return () => {
      provider?.destroy();
    }
  }, [router.isReady, data?.gitId, provider]);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status]);

  useEffect(() => {
    const timeOutJudge = async() => {
      await judgeCode(true);
    }

    if(countdown === 0 && isTimeout === false) {
      if(router.isReady) {
        if(router?.query?.mode === 'team') {
          if(router?.query?.roomId === data?.gitId) {
            timeOutJudge();
          }
        } else {
          timeOutJudge();
        }
      }
      setIsTimeout(true);
    }
  }, [countdown, router.isReady]);
  
  useEffect(() => {
    const submitResult = async() => {
      if(router.isReady && isLogin) {
        if (router?.query?.mode === 'team'){
          await submitCodeTeam();
          socket.emit('submitCodeTeam', router?.query?.gameLogId, router?.query?.roomId);
        }
        else {
          await submitCode();
          socket.emit('submitCode', router?.query?.gameLogId);
        };
        router.replace({
          pathname: '/code/result',
          query: { 
            gameLogId: router?.query?.gameLogId,
            mode: router?.query?.mode 
          }
        });
      }
    };

    if(isSubmit) {
      submitResult();
    }
  }, [isSubmit, router.isReady, isLogin]);

  useEffect(() => {
    onChangeLang(selectedLang);
    setIsSelectOpen(false);
  }, [selectedLang]);

  const secToTime = (s) => {
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `${min.slice(-2)}분 ${sec.slice(-2)}초`;
  };

  const onChangeLang = (lang) => {
    switch(lang) {
      case 'JavaScript':
        setCodeTitle('solution.js');
        break;
      case 'Python':
        setCodeTitle('solution.py');
        break;
    }
  };

  const goToLobby = () => {
    router.replace('/');
  };

  const goToResult = async() => {
    if(!isSubmit) {
      setIsExecuting(true);
      await judgeCode(true);
    }
  };

  const execCode = async() => {
    setIsExecuting(true);
    await judgeCode();
  };

  const checkMyTeam = (team) => {
    for(let member of team) {
      if(member.gitId === data?.gitId) {
        return true;
      }
    }
    return false;
  };
  
  const checkValidUser = (userList) => {
    for(let user of userList) {
      if(user.gitId === data?.gitId) {
        if(0 <= user.passRate) {
          alert('이미 완료된 게임입니다!');
          router.replace('/');
        }
      }
    }
  };

  const getProblem = async() => {
    await fetch(`/server/api/gamelog/problem?mode=${router?.query?.mode}&id=${router?.query?.gameLogId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
        return;
      }
      return res.json();
    })
    .then(data => {
      if(data.success) {
        setProblems(data.info.problemId);
        if(router?.query?.mode === 'team') {
          if(checkMyTeam(data.info.teamA)) {
            checkValidUser(data.info.teamA);
            setMyTeam(data.info.teamA);
          } else {
            checkValidUser(data.info.teamB);
            setMyTeam(data.info.teamB);
          }
          setPlayerList([data.info.teamA, data.info.teamB]);
        } else {
          checkValidUser(data.info.userHistory);
          setPlayerList(data.info.userHistory);
        }
      }
    })
    .catch(error => console.log('[/pages/code] getProblem error >> ', error));
  };

  const submitCode = async() => {
    const code = doc?.getText('codemirror');

    await fetch(`/server/api/gamelog/solo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gameId: router.query.gameLogId,
        gitId: data?.gitId,
        code,
        language: selectedLang,
        ranking: 0,
        passRate,
        submitAt: new Date()
      })
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
      }
      return;
    })
    .catch(error => console.log('[/pages/code] submitCode error >> ', error));
  };

  const submitCodeTeam = async() => {
    const code = doc?.getText('codemirror');

    await fetch(`/server/api/gamelog/team`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gameId: router.query.gameLogId,
        gitId: data?.gitId,
        code,
        language: selectedLang,
        ranking: 0,
        passRate,
        moderater: router?.query?.roomId,
        submitAt: new Date()
      })
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
      }
      return;
    })
    .catch(error => console.log('[/pages/code] submitCodeTeam error >> ', error));
  }

  const judgeCode = async(submit=false) => {
    const code = doc?.getText('codemirror');
    await fetch(`/server/api/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gitId: data?.gitId,
        code: code ?? '',
        problemId: problems?._id ?? '',
        language: selectedLang,
        gameLogId: router.query.gameLogId,
        submit
      })
    })
    .then(res => {
      if(res.status === 403) {
        router.replace({
          pathname: '/',
          query: { msg: 'loginTimeout' }
        });
        return;
      }
      return res.json();
    })
    .then(data => {
      if (router?.query?.mode === 'team' && isLogin) {
        socket.emit('shareJudgedCode', data, router?.query?.roomId);
      }
      setIsExecuting(false);
      setOutputs(data);
      setPassRate(data.passRate);
      if(submit === true) {
        setIsSubmit(true);
      }
    })
    .catch(error => console.log('[/pages/code] judgeCode error >> ', error));
  };

  return (
    <Layout 
      header={
        <Header 
          isCustom 
          customHeader={
            <>
              <div className={styles.headerRow}>
                <div className={styles.headerLogo} onClick={goToLobby}>{`{ CODE: ‘뚝딱’ }`}</div>
                <div className={styles.headerTitle}>{` > ${problems.title ?? ''}`}</div>
              </div>
              <div className={styles.headerRow}>
                <div className={styles.timerIcon}>⏳</div>
                <div className={styles.timer}>{secToTime(countdown)}</div>
              </div>
            </>
          } 
          checkValidUser={(isValidUser) => setIsLogin(isValidUser)} 
        />
      }
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
          { router.isReady && <CheckValidAccess check={router?.query?.gameLogId} message="유효하지 않은 게임입니다." /> }
          {
            isLogin
            && <>
            {
              isMobile
              ? <div className={styles.bodyColMobile}>
                  <div className={styles.codeHeaderMobile}>
                  <div className={styles.codeTitle}>언어선택</div>
                    <div className={styles.toggleBtn} onClick={() => setIsSelectOpen(prev => !prev)}>
                      {selectedLang}
                    </div>
                  </div>
                  { problems && <Problem problems={problems} />}
                  <div className={styles.codeHeaderMobile}>
                    <div className={styles.codeTitle}>{codeTitle}</div>
                  </div>
                  <div className={styles.codeAreaMobile}>
                    <CodeEditor 
                      doc={doc} 
                      provider={provider} 
                      gitId={data?.gitId} 
                      selectedLang={selectedLang}
                    />
                  </div>
                  <div className={styles.resultTitle}>실행 결과</div>
                  <Output outputs={outputs} isExecuting={isExecuting} />
                  <div className={styles.resultTitle}>플레이어</div>
                  {
                    router?.query?.mode === 'team'
                    ? <TeamPlayer teams={playerList} />
                    : <Player players={playerList} />
                  }
                  <div className={styles.footer}>
                  {
                    router?.query?.mode === 'team'
                    ? <Voice team={myTeam}/>
                    : <div />
                  }
                    <div className={styles.footerRight}>
                      <div className={`${styles.btn} ${isExecuting ? styles.btnDisable : null}`} onClick={isExecuting ? () => {} : execCode}>코드 실행</div>
                      <div className={`${styles.btn} ${styles.btnSubmit} ${isExecuting ? styles.btnDisable : null}`} onClick={isExecuting ? () => {} : goToResult}>코드 제출</div>
                    </div>
                  </div>
                </div>
              : <ReflexContainer>
                  <ReflexElement className={styles.body} flex={1}>
                    <ReflexContainer orientation='vertical'>
                      <ReflexElement className={styles.bodyCol}>
                        <ReflexContainer orientation='horizontal'>
                          <ReflexElement flex={0.7} style={{ overflow: 'hidden' }}>
                            { problems && <Problem problems={problems}/>}
                          </ReflexElement>
                          <ReflexSplitter style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '0.625rem', borderTop: '1px solid rgba(0,0,0,0.5)', borderBottom: '0' }} />
                          <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                            <div className={styles.resultTitle}>플레이어</div>
                            {
                              router?.query?.mode === 'team'
                              ? <TeamPlayer teams={playerList} />
                              : <Player players={playerList} />
                            }
                          </ReflexElement>
                        </ReflexContainer>
                      </ReflexElement>
                      <ReflexSplitter style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', width: '0.625rem', borderLeft: '0', borderRight: '1px solid rgba(0,0,0,0.5)' }} />
                      <ReflexElement className={styles.bodyCol} flex={0.65}>
                        <ReflexContainer orientation='horizontal'>
                          <ReflexElement flex={0.7} minSize={40} style={{ overflow: 'hidden' }}>
                            <div className={styles.codeHeader}>
                              <div className={styles.codeTitle}>{codeTitle}</div>
                              <div className={styles.toggleBtn} onClick={() => setIsSelectOpen(prev => !prev)}>
                                {selectedLang}
                              </div>
                            </div>
                            <div className={styles.codeArea}>
                              <CodeEditor 
                                doc={doc} 
                                provider={provider} 
                                gitId={data?.gitId} 
                                selectedLang={selectedLang}
                              />
                            </div>
                          </ReflexElement>
                          <ReflexSplitter style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '0.625rem', borderTop: '1px solid rgba(0,0,0,0.5)', borderBottom: '0' }} />
                          <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                            <div className={styles.resultTitle}>실행 결과</div>
                            <Output outputs={outputs} isExecuting={isExecuting} />
                          </ReflexElement>
                        </ReflexContainer>
                      </ReflexElement>
                    </ReflexContainer>
                  </ReflexElement>
                  <div className={styles.footer}>
                  {
                    router?.query?.mode === 'team'
                    ? <Voice team={myTeam}/>
                    : <div />
                  }
                    <div className={styles.footerRight}>
                      <div className={`${styles.btn} ${isExecuting ? styles.btnDisable : null}`} onClick={isExecuting ? () => {} : execCode}>코드 실행</div>
                      <div className={`${styles.btn} ${styles.btnSubmit} ${isExecuting ? styles.btnDisable : null}`} onClick={isExecuting ? () => {} : goToResult}>코드 제출</div>
                    </div>
                  </div>
                </ReflexContainer>
            }
            <div className={isSelectOpen ? (isMobile ? styles.selectListMobile : styles.selectList) : styles.hidden}>
              <div className={styles.selectElem} onClick={() => setSelectedLang('Python')}>Python</div>
              <div className={styles.selectElem} onClick={() => setSelectedLang('JavaScript')}>JavaScript</div>
            </div>
          </>
          }
        </>
      }
    />
  )
}