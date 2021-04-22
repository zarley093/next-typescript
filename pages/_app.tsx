import React from 'react';
import '../styles/globals.css'
import 'antd/dist/antd.css'
import AppHead from '../components/AppHead';

import { useRouter } from 'next/router';

const MyApp = ({ Component, pageProps })  => {
  const router = useRouter();
  return (
    <div>
      <AppHead />
      <Component {...pageProps} />
    </div>
    
  )
}

export default MyApp
