import { signOut } from 'next-auth/react';
import { deleteCookie } from 'cookies-next';

export default async function logout() {
  deleteCookie('jwt');
  deleteCookie('sidebar');
  signOut({ callbackUrl: '/' });
};