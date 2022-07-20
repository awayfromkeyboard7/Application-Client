import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layouts/main";
import Header from "../../components/header";
import styles from "../../styles/pages/management.module.scss";
import axios from "axios";
import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.css";
import { useRouter } from "next/router";
import boxstyles from "../../styles/components/lobby.module.scss";

import MangementBox from "../../components/manage/box";

//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function Problemmanagement() {
  const router = useRouter();
  const [title, setTitle] = useState("타이틀 입니다");
  const [content, setContent] = useState("문제설명 입니다");
  const [inputText, setInputText] = useState("입력값 설명 입니다");
  const [outputTextm, setOutPutText] = useState("출력값 설명 입니다");
  const [testCaseInput, setTestCaseInput] = useState("예제 입력 예시 입니다");
  const [testCaseOutput, setTestCaseOutput] = useState("예제 출력 예시 입니다");

  const sendToProblem = async () => {
    // 문제 생성안될때 앞에 localhost 주소 붙혀주기
    await fetch(`api/problem/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `${title}`,
        content: `${content}`,
        inputText: `${inputText}`,
        outputText: `${outputTextm}`,
        examples: {
          inputText: `${testCaseInput}`,
          outputText: `${testCaseOutput}`,
        },
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.log("error >> ", error));
  };

  return (
    <Layout
      body={
        <div className={styles.mainArea}>
          <Form>
            <Form.Group className="mb-3" controlId="pltitle">
              <Form.Control
                type="text"
                placeholder={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="plcontent">
              <Form.Control
                type="text"
                placeholder={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="plinputtext">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="ploutputText">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder={outputTextm}
                onChange={(e) => {
                  setOutPutText(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pltinputText">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={testCaseInput}
                onChange={(e) => {
                  setTestCaseInput(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pltsoutputText">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={testCaseOutput}
                onChange={(e) => {
                  setTestCaseOutput(e.target.value);
                }}
              />
            </Form.Group>
            <Button className={styles.postBtn} variant="primary" type="submit">
              케이스 추가
            </Button>
            <Button
              className={styles.postBtn}
              variant="primary"
              onClick={() => {
                sendToProblem();
                console.log("ffff");
              }}
            >
              문제 생성
            </Button>
          </Form>
        </div>
      }
    />
  );
}
