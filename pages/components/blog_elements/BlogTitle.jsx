// pages/sign_in.js
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function BlogTitle({ text }) {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="blog-title roaming-black-text text-center">{text}</p>
    </div>
  );
}
