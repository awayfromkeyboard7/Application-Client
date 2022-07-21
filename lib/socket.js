import { io } from 'socket.io-client';

export let socket = io(process.env.NEXT_PUBLIC_SOCKET_PROVIDER, {
  rejectUnauthorized: false // WARN: please do not do this in production
});