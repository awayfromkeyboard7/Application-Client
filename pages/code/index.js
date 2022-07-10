import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { dracula } from '@uiw/codemirror-theme-dracula';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';

import { 
  sendSocketMessage, 
  socketInfoReceived, 
  createNewSocketConnection,
} from '../../lib/socket';
import Problem from '../../components/code/problem';
import Result from '../../components/code/result';
import Ranking from '../../components/rank/list';
import Popup from '../../components/popup';

import 'react-reflex/styles.css';
import styles from '../../styles/pages/Code.module.scss';

export default function Code() {
  const router = useRouter();  
  const [problems, setProblems] = useState({});
  const [result, setResult] = useState({});
  const [problemText, setProblemText] = useState('');
  const [problemTitle, setProblemTitle] = useState('');
  const [codeText, setCodeText] = useState("print('hello world')");
  const [codeTitle, setCodeTitle] = useState('solution.py');
  const [codeResult, setCodeResult] = useState('');
  const [headerNotice, setHeaderNotice] = useState('');
  const [isSuccessResult, setIsSuccessResult] = useState(true);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);  
  const [isPopup, setIsPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupContent, setPopupContent] = useState('');
  const [popupLabel, setPopupLabel] = useState('');
  const [popupBtnFunc, setPopupBtnFunc] = useState(() => () => setIsPopup(false));
  const [selectedLang, setSelectedLang] = useState('Python');
  const [codemirrorExt, setCodemirrorExt] = useState([python()]);
  const [countdown, setCountdown] = useState(900);
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    // socketInfoReceived("receive_problem", (data) => {
    //   setProblemTitle(`SW Jungle 코딩 대회 > ${data.title}`);
    //   setProblemText(data.content);
    //   setCountdown(data.timeLimit);
    // });
    // socketInfoReceived("receive_result", (data) => {
    //   setHeaderNotice(`📢 ${data.userId}님이 문제를 ${data.success ? '통과' : '실패'}하였습니다.`)
    // });

    setRanks([
      {
        rank: 1,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 2,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 3,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 4,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 5,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 6,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 7,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 8,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 9,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 10,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 11,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 12,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 13,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 14,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 15,
        nickname: 'annie1229',
        info: 'swjungle',
        imageUrl: '/jinny.jpg'
      },
    ]);
    const date = new Date('2022-07-05T13:00:00');

    async function getProblem() {
      await fetch(`/api/problem`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(data => {
        console.log('success get problem!!', data);
        if(data.success) {
          setProblems(data.problems);
          setProblemTitle(data.problems.title);
          setProblemText(data.problems.content);
        }
      })
      .catch(error => console.log('error >> ', error));
    }
    getProblem();
    const interval = setInterval(() => {
      console.log(new Date());
      setCountdown(prev => {
        if(0 < prev) return prev - 1;
        else return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if(countdown === 0) {
      judgeCode();
      setIsPopup(true);
    }
  }, [countdown]);

  useEffect(() => {
    if(isSuccessResult) {
      setPopupTitle("정답입니다!🥳");
      setPopupContent(`문제를 맞추셨습니다.`);
      setPopupLabel("다음 문제로");
      setPopupBtnFunc(() => () => goToNextProblem());
    } else {
      setPopupTitle("아쉽지만 다음 기회에..😭");
      setPopupContent(`문제를 틀렸습니다.`);
      setPopupLabel("메인으로");
      setPopupBtnFunc(() => () => goToLobby());
    }
  }, [isSuccessResult, selectedLang]);
  
  useEffect(() => {
    onChangeLang(selectedLang);
    setIsSelectOpen(false);
  }, [selectedLang]);

  const secToTime = (s) => {
    const min = "0" + String(parseInt((s % 3600) / 60));
    const sec = "0" + String(parseInt(s % 60));
    
    return `남은 시간  [ ${min.substr(-2)}분 ${sec.substr(-2)}초 ]`;
  };

  const onChange = useCallback((value) => {
    console.log(value);
    // sendSocketMessage("message", { "code": value } );
    setCodeText(value);
  }, []);

  const onChangeLang = (lang) => {
    switch(lang) {
      case 'JavaScript':
        setCodemirrorExt([javascript()]);
        setCodeText("console.log('hello world');");
        setCodeTitle('solution.js');
        break;
      case 'Python':
        setCodemirrorExt([python()]);
        setCodeText("print('hello world')");
        setCodeTitle('solution.py');
        break;
      case 'C++':
        setCodemirrorExt([cpp()]);
        setCodeText('std::cout << "출력 ";');
        setCodeTitle('solution.cpp');
        break;
    }
  };

  const goToNextProblem = () => {
    // sendSocketMessage("problem", { problemId: "1" } );
    onChangeLang(selectedLang);
    setCodeResult('');
    setIsPopup(false);
  };

  const goToLobby = () => {
    setIsPopup(false);
    router.push('/');
  };

  // const getProblem = async() => {
  //   await fetch(`/api/problem`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     if(data.success) {
  //       setProblemTitle(data.title);
  //       setProblemText(data.content);
  //     }
  //   })
  //   .catch(error => console.log('error >> ', error));
  // };

  const judgeCode = async() => {
    await fetch(`/api/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code: codeText 
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.result) setIsSuccessResult(true);
      else setIsSuccessResult(false);
      setResult(data);
      // sendSocketMessage("result", { userId: "annie1229", success: data.success } );
    })
    .catch(error => console.log('error >> ', error));
  };

  const judgeCodeWithSocket = async() => {
    await fetch(`/api/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code: codeText 
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.result) setIsSuccessResult(true);
      else setIsSuccessResult(false);

      // let newSocket = createNewSocketConnection('http://localhost:56');
      // sendSocketMessage('judge', {}, newSocket);
      // setCodeResult('');
      // socketInfoReceived("judge_result", (data) => {
      //   setCodeResult(prev => prev + `${data.success === true ? '통과' : '실패'}\n`);
      // }, newSocket);
      // socketInfoReceived("close", (data) => {
      //   console.log('react new socket close');
      // }, newSocket);
      // sendSocketMessage("result", { userId: "annie1229", success: data.success } );
    })
    .catch(error => console.log('error >> ', error));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Code IDE</title>
        <meta name="description" content="Online Judge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReflexContainer>
      <div className={styles.header}>
        <div className={styles.headerTitle}>{problemTitle}</div>
        <div className={styles.headerRow}>
          <div className={styles.textArea}>{headerNotice}</div>
          <div className={styles.btn} onClick={() => setIsRankingOpen(prev => !prev)}>랭킹 보기</div>
        </div>
      </div>
      <ReflexElement className={styles.body} flex={1}>
        <ReflexContainer orientation='vertical'>
          <ReflexElement className={styles.bodyCol}>
            <ReflexContainer orientation='horizontal'>
              <ReflexElement flex={0.8} minSize={40} style={{ overflow: 'hidden' }}>
                <div className={styles.timer}>{secToTime(countdown)}</div>
                <Problem problems={problems}/>
              </ReflexElement>
              <ReflexSplitter style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", height: "0.625rem", borderTop: "1px solid rgba(0,0,0,0.5)", borderBottom: "0" }} />
              <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                <div className={styles.textArea}></div>
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>
          <ReflexSplitter style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", width: "0.625rem", borderLeft: "0", borderRight: "1px solid rgba(0,0,0,0.5)" }} />
          <ReflexElement className={styles.bodyCol} flex={0.7}>
            <ReflexContainer orientation='horizontal'>
              <ReflexElement flex={0.8} minSize={40} style={{ overflow: 'hidden' }}>
                <div className={styles.codeHeader}>
                  <div className={styles.codeTitle}>{codeTitle}</div>
                  <div className={styles.toggleBtn} onClick={() => setIsSelectOpen(prev => !prev)}>
                    {selectedLang}
                  </div>
                </div>
                <div className={styles.codeArea}>
                  <CodeMirror
                    value={codeText}
                    width="auto"
                    height="100%"
                    className={styles.CodeMirror}
                    theme={dracula}
                    extensions={codemirrorExt}
                    onChange={onChange}
                  />
                </div>
              </ReflexElement>
              <ReflexSplitter style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", height: "0.625rem", borderTop: "1px solid rgba(0,0,0,0.5)", borderBottom: "0" }} />
              <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                <div className={styles.resultTitle}>실행 결과</div>
                <Result result={result}/>
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>
      <div className={styles.footer}>
        <div />
        <div className={styles.footerRight}>
          <div className={styles.btn} onClick={judgeCode}>코드 실행</div>
          <div className={`${styles.btn} ${styles.btnSubmit}`} onClick={judgeCodeWithSocket}>코드 제출</div>
        </div>
      </div>
      </ReflexContainer>
      <div className={isSelectOpen ? styles.selectList : styles.hidden}>
        <div className={styles.selectElem} onClick={() => setSelectedLang('C++')}>C++</div>
        <div className={styles.selectElem} onClick={() => setSelectedLang('Python')}>Python</div>
        <div className={styles.selectElem} onClick={() => setSelectedLang('JavaScript')}>JavaScript</div>
      </div>
      {
        isRankingOpen
        && <Ranking ranks={ranks} isAbsolute />
      }
      {
        isPopup
        && <Popup 
            title={popupTitle}
            content={popupContent}
            label={popupLabel}
            onClick={popupBtnFunc} 
          />
      }
    </div>
  )
}