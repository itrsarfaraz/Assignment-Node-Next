import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </Layout>
  );
}
