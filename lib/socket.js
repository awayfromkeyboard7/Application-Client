import { io } from 'socket.io-client';

export let socket = io("http://localhost:80", {transports: ["websocket"]});
export const initSocketConnection = () => {
  if(socket) return;
  socket.connect();
};

export const sendSocketMessage = (cmd, body = null) => {
  if(socket == null || socket.connected === false) {
    initSocketConnection();
  }
  socket.emit("message", {
    cmd,
    body
  });
};

let cbMap = new Map();

export const socketInfoReceived = (cbType, cb) => {
  cbMap.get(cbType, cb);

  if(socket.hasListeners("message")) {
    socket.off("message");
  }

  socket.on("message", ret => {
    for(let [, cbValue] of cbMap) {
      cbValue(null, ret);
    }
  });
};

export const disconnectSocket = () => {
  if(socket == null || socket.connect === false) {
    return;
  }
  socket.disconnect();
  socket = undefined;
};