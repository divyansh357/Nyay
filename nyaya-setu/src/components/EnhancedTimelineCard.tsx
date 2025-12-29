import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Chip, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomTheme } from '../theme/types';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const [expanded, setExpanded] = useState(false);

  const getStatusStyle = () => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('approved') || normalizedStatus.includes('issued')) {
      return {
        icon: 'check-circle' as const,
        color: theme.colors.success,
        background: '#e8f5e9',
      };
    }
    
    if (normalizedStatus.includes('reject') || normalizedStatus.includes('denied')) {
      return {
        icon: 'close-circle' as const,
        color: theme.colors.error,
        background: '#ffebee',
      };
    }
    
    if (normalizedStatus.includes('review') || normalizedStatus.includes('process')) {
      return {
        icon: 'clock-outline' as const,
        color: theme.colors.tertiary,
        background: '#ede7f6',
      };
    }
    
    if (normalizedStatus.includes('submit') || normalizedStatus.includes('receiv')) {
      return {
        icon: 'file-document-outline' as const,
        color: theme.colors.primary,
        background: '#e3f2fd',
      };
    }
    
    if (normalizedStatus.includes('verif') || normalizedStatus.includes('inspect')) {
      return {
        icon: 'magnify' as const,
        color: '#ff9800',
        background: '#fff3e0',
      };
    }
    
    // Default
    return {
      icon: 'information-outline' as const,
      color: theme.colors.secondary,
      background: '#f5f5f5',
    };
  };

  const { icon, color, background } = getStatusStyle();

  // Format date to show month, day and year
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate estimated days for each status
  const getEstimatedDays = () => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('submit')) return 14;
    if (normalizedStatus.includes('verif')) return 21;
    if (normalizedStatus.includes('review')) return 30;
    if (normalizedStatus.includes('survey')) return 14;
    if (normalizedStatus.includes('preparat')) return 30;
    if (normalizedStatus.includes('hearing')) return 60;
    
    // If already approved or rejected
    if (normalizedStatus.includes('approv') || normalizedStatus.includes('reject')) {
      return 0;
    }
    
    // Default
    return 30;
  };

  const estimatedDays = getEstimatedDays();

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.touchableArea}>
        <Card.Content>
          <View style={styles.container}>
            <View style={styles.indicatorContainer}>
              <Surface style={[styles.iconSurface, { backgroundColor: background }]}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
              </Surface>
              {!isLastItem && (
                <View
                  style={[styles.line, { backgroundColor: theme.colors.outlineVariant }]}
                />
              )}
            </View>
            
            <View style={styles.contentContainer}>
              <View style={styles.header}>
                <Text variant="titleMedium" style={[styles.status, { color }]}>
                  {status}
                </Text>
                <IconButton
                  icon={expanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  onPress={() => setExpanded(!expanded)}
                  style={styles.expandButton}
                />
              </View>
              
              <View style={styles.metaRow}>
                <Chip 
                  style={[styles.officeChip, { backgroundColor: background }]}
                  textStyle={{ color }}
                  icon="office-building"
                >
                  {officeName}
                </Chip>
                <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
                  {formattedDate}
                </Text>
              </View>
              
              {expanded && (
                <View style={styles.expandedContent}>
                  <Text variant="bodyMedium" style={styles.description}>
                    {description}
                  </Text>
                  
                  {estimatedDays > 0 && (
                    <View style={styles.estimatedTimeContainer}>
                      <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.primary} />
                      <Text variant="bodySmall" style={styles.estimatedTime}>
                        {t('estimated_time')}: ~{estimatedDays} {t('days')}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  touchableArea: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
  },
  indicatorContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  iconSurface: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
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
  status: {
    flex: 1,
    fontWeight: '500',
  },
  expandButton: {
    margin: -8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  officeChip: {
    height: 28,
  },
  expandedContent: {
    marginTop: 12,
  },
  description: {
    marginBottom: 12,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  estimatedTime: {
    fontSize: 12,
    marginLeft: 4,
    color: '#555',
  },
});

export default TimelineCard;