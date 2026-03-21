import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface AdBannerProps {
  adId?: string;
  size?: 'banner' | 'rectangle';
}

function WebAdBanner({ adId, size }: { adId: string; size: 'banner' | 'rectangle' }) {
  const width = size === 'banner' ? 320 : 300;
  const height = size === 'banner' ? 50 : 250;

  // 同一ドメインの静的HTMLを読み込むことで、正しいリファラーでAdMaxスクリプトを実行
  const adUrl = `/ad.html?id=${adId}`;

  return (
    <View style={[styles.container, { minHeight: height }]}>
      <iframe
        src={adUrl}
        width={width}
        height={height}
        style={{
          border: 'none',
          overflow: 'hidden',
          display: 'block',
          margin: '0 auto',
        }}
        scrolling="no"
        title="ad"
      />
    </View>
  );
}

export function AdBanner({ adId, size = 'banner' }: AdBannerProps) {
  const height = size === 'banner' ? 50 : 250;

  if (Platform.OS === 'web' && adId) {
    return <WebAdBanner adId={adId} size={size} />;
  }

  return (
    <View style={[styles.placeholder, { height }]}>
      <Text style={styles.placeholderText}>- 広告 -</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
  placeholder: {
    marginTop: 24,
    backgroundColor: '#F5F0E8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0D8CC',
  },
  placeholderText: {
    fontSize: 14,
    color: '#B0A090',
  },
});
