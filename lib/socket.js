import { io } from 'socket.io-client';
import { getCookie } from 'cookies-next';

export let socket = io(process.env.NEXT_PUBLIC_SOCKET_PROVIDER, {
  // transports: ['websocket'],
  rejectUnauthorized: false, // WARN: please do not do this in production
  closeOnBeforeunload: false,
  auth: {
    token: getCookie('jwt')
  },
});