import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const REWARD_AD_ID = '885eddc4d4ad85e4695a6ab1e5320460';
const COUNTDOWN_SECONDS = 10;

interface RewardAdModalProps {
  visible: boolean;
  onClose: () => void;
  onRewardEarned: () => void;
}

export function RewardAdModal({ visible, onClose, onRewardEarned }: RewardAdModalProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [rewarded, setRewarded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) {
      setCountdown(COUNTDOWN_SECONDS);
      setRewarded(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible]);

  const handleClaim = () => {
    if (countdown > 0) return;
    setRewarded(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onRewardEarned();
    setTimeout(onClose, 1200);
  };

  const adUrl = `/ad.html?id=${REWARD_AD_ID}`;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>🎬 広告を見てガチャ+1回</Text>
          <Text style={styles.subtitle}>
            {countdown > 0
              ? `あと${countdown}秒お待ちください...`
              : rewarded
              ? '🎉 ガチャ+1回ゲット！'
              : '広告の視聴が完了しました！'}
          </Text>

          {/* Ad display area */}
          <View style={styles.adContainer}>
            {Platform.OS === 'web' ? (
              <iframe
                src={adUrl}
                width={300}
                height={250}
                style={{ border: 'none', display: 'block' }}
                scrolling="no"
                title="reward-ad"
              />
            ) : (
              <View style={styles.adPlaceholder}>
                <Text style={styles.adPlaceholderText}>広告</Text>
              </View>
            )}
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100}%`,
                  backgroundColor: countdown > 0 ? '#FF6B35' : '#4CAF50',
                },
              ]}
            />
          </View>

          {/* Buttons */}
          {countdown === 0 && !rewarded && (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={handleClaim}
              activeOpacity={0.8}
            >
              <Text style={styles.claimButtonText}>🎰 ガチャ+1回もらう！</Text>
            </TouchableOpacity>
          )}

          {rewarded && (
            <View style={styles.rewardedBanner}>
              <Text style={styles.rewardedText}>✅ +1回追加されました！</Text>
            </View>
          )}

          {countdown > 0 && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>閉じる（報酬なし）</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D1B00',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 16,
  },
  adContainer: {
    width: 300,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F0E8',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adPlaceholder: {
    width: 300,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
  },
  adPlaceholderText: {
    fontSize: 16,
    color: '#B0A090',
  },
  progressBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0E6D8',
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  claimButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  claimButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rewardedBanner: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  rewardedText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4CAF50',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 10,
  },
  closeButtonText: {
    fontSize: 13,
    color: '#B0A090',
  },
});
