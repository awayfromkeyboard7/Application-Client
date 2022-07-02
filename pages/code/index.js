import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { dracula } from '@uiw/codemirror-theme-dracula';
import io from 'socket.io-client';
// const socket = io.connect("http://localhost:80");
// import { sendSocketMessage } from '../../lib/socket';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';
import Ranking from '../../components/widgets/ranking';

import reflexStyles from 'react-reflex/styles.css';
import styles from '../../styles/pages/Code.module.css';

export default function Code() {
  const [problemText, setProblemText] = useState(`세 차례의 코딩 테스트와 두 차례의 면접이라는 기나긴 블라인드 공채를 무사히 통과해 카카오에 입사한 무지는 파일 저장소 서버 관리를 맡게 되었다.

  저장소 서버에는 프로그램의 과거 버전을 모두 담고 있어, 이름 순으로 정렬된 파일 목록은 보기가 불편했다. 파일을 이름 순으로 정렬하면 나중에 만들어진 ver-10.zip이 ver-9.zip보다 먼저 표시되기 때문이다.
  
  버전 번호 외에도 숫자가 포함된 파일 목록은 여러 면에서 관리하기 불편했다. 예컨대 파일 목록이 ["img12.png", "img10.png", "img2.png", "img1.png"]일 경우, 일반적인 정렬은 ["img1.png", "img10.png", "img12.png", "img2.png"] 순이 되지만, 숫자 순으로 정렬된 ["img1.png", "img2.png", "img10.png", img12.png"] 순이 훨씬 자연스럽다.
  
  무지는 단순한 문자 코드 순이 아닌, 파일명에 포함된 숫자를 반영한 정렬 기능을 저장소 관리 프로그램에 구현하기로 했다.
  
  소스 파일 저장소에 저장된 파일명은 100 글자 이내로, 영문 대소문자, 숫자, 공백(" "), 마침표("."), 빼기 부호("-")만으로 이루어져 있다. 파일명은 영문자로 시작하며, 숫자를 하나 이상 포함하고 있다.
  
  파일명은 크게 HEAD, NUMBER, TAIL의 세 부분으로 구성된다.
  
  HEAD는 숫자가 아닌 문자로 이루어져 있으며, 최소한 한 글자 이상이다.
  NUMBER는 한 글자에서 최대 다섯 글자 사이의 연속된 숫자로 이루어져 있으며, 앞쪽에 0이 올 수 있다. 0부터 99999 사이의 숫자로, 00000이나 0101 등도 가능하다.
  TAIL은 그 나머지 부분으로, 여기에는 숫자가 다시 나타날 수도 있으며, 아무 글자도 없을 수 있다.`);
  const [codeText, setCodeText] = useState('');
  const [codeTitle, setCodeTitle] = useState('solution.py');
  const [codeResult, setCodeResult] = useState('테스트를 통과하였습니다');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Python');
  const [codemirrorExt, setCodemirrorExt] = useState([python()]);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const date = new Date('2022-07-05T13:00:00');

    const interval = setInterval(() => {
      console.log(new Date());
      setCountdown(prev => {
        if(0 < prev) return prev - 1;
        else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const secToTime = (s) => {
    // const hour = "0" + String(parseInt(s / 3600));
    const min = "0" + String(parseInt((s % 3600) / 60));
    const sec = "0" + String(parseInt(s % 60));
    
    return `남은 시간  [ ${min.substr(-2)}분 ${sec.substr(-2)}초 ]`;
  };

  const onChange = useCallback((value) => {
    console.log(value);
    // sendSocketMessage("code", value);
    // socket.emit("message", { "code": value });
    setCodeText(value);
  }, []);

  useEffect(() => {
    return () => {
      // socket.close();
    }
  }, []);

  useEffect(() => {
    switch(selectedLang) {
      case 'javascript':
        setCodemirrorExt([javascript()]);
        setCodeText("console.log('hello world');");
        setCodeTitle('solution.js');
        break;
      case 'python':
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
    setIsSelectOpen(false);
  }, [selectedLang]);

  const judgeCode = async() => {
    await fetch(`${process.env.API_PROVIDER}/api/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code: codeText 
      }),
    })
    .then(res => res.json())
    .then(data => setCodeResult(`${data.success} ${data.msg}`))
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
        <div className={styles.headerTitle}>문제 제목</div>
        <div className={styles.btn} onClick={() => setIsRankingOpen(prev => !prev)}>랭킹 보기</div>
      </div>
      <ReflexElement className={styles.body} flex={1}>
        <ReflexContainer orientation='vertical'>
          <ReflexElement className={styles.bodyCol}>
            <div className={styles.timer}>{secToTime(countdown)}</div>
            <div className={styles.textArea}>{problemText}</div>
          </ReflexElement>
          <ReflexSplitter style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", width: "0.625rem", borderLeft: "0", borderRight: "1px solid rgba(0,0,0,0.5)" }} />
          <ReflexElement className={styles.bodyCol} flex={0.7}>
            <ReflexContainer orientation='horizontal'>
              <ReflexElement flex={0.8} minSize={40} style={{ overflow: 'hidden' }}>
                <div className={styles.codeHeader}>
                  <div className={styles.codeTitle}>{codeTitle}</div>
                  <div className={styles.toggleBtn} onClick={() => {setIsSelectOpen(prev => !prev)}}>
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
                <div className={styles.resultArea}>{codeResult}</div>
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>
      <div className={styles.footer}>
        <div />
        <div className={styles.footerRight}>
          <div className={styles.btn} onClick={judgeCode}>코드 실헹</div>
          <div className={`${styles.btn} ${styles.btnSubmit}`} onClick={judgeCode}>코드 제출</div>
        </div>
      </div>
      </ReflexContainer>
      <div className={isSelectOpen ? styles.selectList : styles.hidden}>
        <div className={styles.selectElem} onClick={() => {setSelectedLang('C++')}}>C++</div>
        <div className={styles.selectElem} onClick={() => {setSelectedLang('python')}}>Python</div>
        <div className={styles.selectElem} onClick={() => {setSelectedLang('javascript')}}>JavaScript</div>
      </div>
      {
        isRankingOpen
        ? <Ranking />
        : null
      }
    </div>
  )
}