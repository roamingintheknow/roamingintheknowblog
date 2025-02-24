// pages/sign_in.js
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   // If the user is already signed in, redirect them
  //   if (status === 'authenticated') {
  //     router.push('/');
  //   }
  // }, [status]);

  return (
    <div>
      <h1>Sign In</h1>
      {!session && (
        <>
          <p>You are not signed in.</p>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
          <button onClick={() => signIn('github')}>Sign in with GitHub</button>
        </>
      )}
    </div>
  );
}
