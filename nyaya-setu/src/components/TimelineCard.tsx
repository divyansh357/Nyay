import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomTheme } from '../theme/types';

export interface TimelineCardProps {
  status: string;
  timestamp: Date | string;
  description: string;
  officeName: string;
  isLastItem?: boolean;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  status,
  timestamp,
  description,
  officeName,
  isLastItem = false,
}) => {
  const theme = useTheme<CustomTheme>();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  const getStatusStyle = () => {
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          icon: 'check-circle' as const,
          color: theme.colors.success,
        };
      case 'rejected':
        return {
          icon: 'close-circle' as const,
          color: theme.colors.error,
        };
      case 'under review':
      case 'submitted':
        return {
          icon: 'clock-outline' as const,
          color: theme.colors.tertiary,
        };
      default:
        return {
          icon: 'information-outline' as const,
          color: theme.colors.secondary,
        };
    }
  };

  const { icon, color } = getStatusStyle();

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        {!isLastItem && (
          <View
            style={[styles.line, { backgroundColor: theme.colors.outline }]}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={{ color }}>
            {status}
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
            {date.toLocaleDateString()}
          </Text>
        </View>
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
          {officeName}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  description: {
    marginBottom: 4,
  },
});

export default TimelineCard;