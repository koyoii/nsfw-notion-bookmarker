import { Title } from '@mantine/core';
import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>NSFW Bookmarker</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Title>Welcome to Mantine!</Title>
    </Layout>
  );
};

export default Home;
