import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    logout();
  }, []);

  function logout() {
    window.localStorage.setItem('loggedin', '');
    window.localStorage.setItem('login-type', '');
    window.location.href = '/';
  }

  return <></>;
}
