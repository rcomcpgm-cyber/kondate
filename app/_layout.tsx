import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useSubscriptionStore } from '../src/stores/subscriptionStore';

const OGP = {
  title: '献立ガチャ - 今日のごはん、ガチャで決めよう！',
  description:
    '毎日の献立に迷ったら、ガチャを回そう！AIが季節の食材を活かしたレシピを提案。レア度付きで楽しく料理。',
  url: 'https://kondate-nu.vercel.app',
  image: 'https://kondate-nu.vercel.app/og-image.png',
  siteName: '献立ガチャ',
};

export default function RootLayout() {
  const checkStatus = useSubscriptionStore((s) => s.checkStatus);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return (
    <>
      {Platform.OS === 'web' && (
        <Head>
          {/* Primary Meta */}
          <title>{OGP.title}</title>
          <meta name="description" content={OGP.description} />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={OGP.siteName} />
          <meta property="og:title" content={OGP.title} />
          <meta property="og:description" content={OGP.description} />
          <meta property="og:url" content={OGP.url} />
          <meta property="og:image" content={OGP.image} />
          <meta property="og:locale" content="ja_JP" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={OGP.title} />
          <meta name="twitter:description" content={OGP.description} />
          <meta name="twitter:image" content={OGP.image} />
        </Head>
      )}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFF8F0' },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
