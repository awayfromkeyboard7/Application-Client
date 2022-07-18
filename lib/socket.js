import { io } from 'socket.io-client';

export let socket = io(process.env.NEXT_PUBLIC_SOCKET_PROVIDER, {
  rejectUnauthorized: false // WARN: please do not do this in production
});

export const initSocketConnection = () => {
  if(socket) return;
  socket.connect();
};

export const changeSocketConnection = (url) => {
  disconnectSocket();
  socket = io(url);
  socket.connect();
};

// export const createNewSocketConnection = (url) => {
//   let newSocket = io(url);
//   newSocket.connect();
//   return newSocket;
// };

export const sendSocketMessage = (socketName, body, newSocket=null) => {
  if(socket == null || socket.connected === false) {
    initSocketConnection();
  }
  if(newSocket) newSocket.emit(socketName, body);
  else socket.emit(socketName, body);
};


export const socketInfoReceived = (socketName, callback, newSocket=null) => {
  if(newSocket) {
    if(newSocket.hasListeners(socketName)) {
      newSocket.off(socketName);
    }
  
    newSocket.on(socketName, ret => {
      console.log(socketName, 'socket received', ret);
      callback(ret);
    });
  } else {
    if(socket.hasListeners(socketName)) {
      socket.off(socketName);
    }
  
    socket.on(socketName, ret => {
      console.log(socketName, 'socket received', ret);
      callback(ret);
    });
  }
};

export const disconnectSocket = (newSocket=null) => {
  if(newSocket) {
    if(newSocket == null || newSocket.connect === false) {
      return;
    }
    newSocket.disconnect();
  } else {
    if(socket == null || socket.connect === false) {
      return;
    }
    socket.disconnect();
    socket = undefined;
  }
};