// pages/sign_in.js
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function BlogHeader({text}) {

  return (
    <div>
      <p className ='blog-h2 roaming-brown-text'>{text}</p>
    </div>
  );
}
