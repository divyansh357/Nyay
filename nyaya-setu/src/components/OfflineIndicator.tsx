import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { theme } from '../theme/colors';

interface OfflineIndicatorProps {
  showDetails?: boolean;
  style?: StyleProp<ViewStyle>;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showDetails = true,
  style,
}) => {
  const { isOffline, lastSyncTime, syncInProgress } = useAppStore();

  const handlePress = () => {
    const statusMessage = isOffline
      ? 'आप ऑफलाइन मोड में हैं। कुछ सुविधाएं सीमित हो सकती हैं।'
      : 'आप ऑनलाइन हैं। सभी सुविधाएं उपलब्ध हैं।';
    
    const syncMessage = lastSyncTime
      ? `\n\nअंतिम अपडेट: ${lastSyncTime.toLocaleString('hi-IN')}`
      : '\n\nअभी तक कोई अपडेट नहीं';

    Alert.alert(
      'कनेक्शन स्थिति',
      statusMessage + syncMessage,
      [{ text: 'ठीक है', style: 'default' }]
    );
  };

  const getStatusColor = () => {
    if (syncInProgress) return theme.colors.warning;
    return isOffline ? theme.colors.offline : theme.colors.online;
  };

  const getStatusIcon = () => {
    if (syncInProgress) return 'sync';
    return isOffline ? 'cloud-offline' : 'cloud-done';
  };

  const getStatusText = () => {
    if (syncInProgress) return 'अपडेट हो रहा है...';
    return isOffline ? 'ऑफलाइन' : 'ऑनलाइन';
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`कनेक्शन स्थिति: ${getStatusText()}`}
      accessibilityHint="विस्तृत जानकारी के लिए दबाएं"
    >
      <View style={[styles.indicator, { backgroundColor: getStatusColor() }]}>
        <Ionicons
          name={getStatusIcon()}
          size={16}
          color={theme.colors.onPrimary}
        />
      </View>
      
      {showDetails && (
        <View style={styles.details}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          {lastSyncTime && !syncInProgress && (
            <Text style={styles.syncTime}>
              {lastSyncTime.toLocaleTimeString('hi-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  details: {
    flex: 1,
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  syncTime: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default OfflineIndicator;