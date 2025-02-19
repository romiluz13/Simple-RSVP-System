import { handleAuth, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  callback: handleCallback,
  logout: handleLogout({
    returnTo: process.env.AUTH0_LOGOUT_URL
  })
});

export const POST = handleAuth(); 