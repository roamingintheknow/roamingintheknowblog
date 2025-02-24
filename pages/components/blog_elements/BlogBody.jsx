// pages/sign_in.js
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function BlogBody({text}) {

  return (
    <div>
      <p className ='blog-body roaming-black-text'>{text}</p>
    </div>
  );
}
