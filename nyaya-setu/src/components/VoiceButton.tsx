import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme/colors';

interface VoiceButtonProps {
  onVoiceInput?: (text: string) => void;
  onSpeechResult?: (text: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: string;
  delayMs?: number;
}

const MOCK_PROMPTS = [
  'FRA के तहत कौन से दस्तावेज़ चाहिए?',
  'सामुदायिक वन अधिकार का दावा कैसे करें?',
  'MGNREGA में जल-संरक्षण योजना के लिए आवेदन की प्रक्रिया बताएं।',
  'क्या FRA दावे में गवाह की लिखित सहमति ज़रूरी है?',
  'छात्रवृत्ति फॉर्म भरने की अंतिम तिथि क्या है?',
  'वन धन सहायता केंद्र कहां मिलता है?'
];

// Export as both named and default export
export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onVoiceInput,
  onSpeechResult,
  disabled = false,
  style,
  color,
  delayMs,
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePress = () => {
    if (disabled) return;

    const randomInput = MOCK_PROMPTS[Math.floor(Math.random() * MOCK_PROMPTS.length)];
    const simulatedDelay = typeof delayMs === 'number'
      ? delayMs
      : 900 + Math.floor(Math.random() * 700); // 900ms - 1600ms

    console.log('VoiceButton pressed, simulating capture delay:', simulatedDelay, 'ms');

    timeoutRef.current = setTimeout(() => {
      console.log('Delivering mock voice input:', randomInput);
      onVoiceInput?.(randomInput);
      onSpeechResult?.(randomInput);
    }, simulatedDelay);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.button,
        color ? { backgroundColor: color } : null,
        disabled ? { opacity: 0.5 } : null,
        style,
      ]}
      activeOpacity={0.6}
    >
      <Text style={styles.icon}>🎤</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: theme.colors.onPrimary,
  }
});

// Also export as default for compatibility
export default VoiceButton;
