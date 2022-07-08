const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);


// https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js

async function createExecFile(lang, userCode, filename) {
  // * 받은 코드로 py 파일 생성 
  // ref: https://dydals5678.tistory.com/96
  console.log("createExecFile start");
  if (lang === 'python3') {
    await fs.writeFileSync('./code/' + filename +'.py', userCode, function(err) {
      if (err !== null) {
        console.log(`Fail to create file ${err.code}`);
        return false;
      }
    })
  }
  console.log("createExecFile end");
  return true;
}

async function execCode(filename) {
  // * py 파일 실행
  // ref: https://blog.outsider.ne.kr/551
  // ref: https://infotech-2.tistory.com/62
  // ref: https://balmostory.tistory.com/33

  try {
    let result = await exec('nohup python3 ./code/c1.py < ./code/input.txt');
    return result.stdout.toString();
  } catch (error) {
    let errCode = error.stderr.toString().split('\n');
    return errCode[3];
  }

}

async function compareOutput(userOutput) {
  const output = fs.readFileSync('./code/output.txt', 'utf-8');

  if (userOutput === output) {
    return true;
  } else {
    return false;
  }
}

async function deleteFile(filename) {
  await fs.unlink(filename, function(err) {
    if (err !== null) {
      console.log(`Fail to delete file ${err.code}`);
      return false;
    }
  })
  return true;
}

async function judgeCode(userCode) {
  await createExecFile('python3', userCode, 'c1');
  let userOutput = await execCode('dummy');
  let result = await compareOutput(userOutput);
  await deleteFile('./code/c1.py');

  return {
    success: result,
    msg: userOutput
  };
}

module.exports = judgeCode;