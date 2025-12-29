import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import type {
  StyleProp,
  ViewStyle,
  TextStyle,
  ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/colors';
import { SupportedLanguage } from '../types';
import { translationService } from '../services/translationService';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void | Promise<void>;
  style?: StyleProp<ViewStyle>;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const languages: LanguageOption[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
  },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  style,
  showLabel = true,
  size = 'medium',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = async (language: SupportedLanguage) => {
    try {
      // Update translation service
      translationService.setLanguage(language);
      
      // Notify parent component
      await Promise.resolve(onLanguageChange(language));
      
      // Close modal
      setIsModalVisible(false);
      
      // Show confirmation
      const confirmationMessages: Record<SupportedLanguage, string> = {
        hi: 'भाषा हिंदी में बदल गई',
        en: 'Language changed to English',
        or: 'ଭାଷା ଓଡ଼ିଆରେ ପରିବର୍ତ୍ତନ ହୋଇଛି',
      };
      
      Alert.alert(
        'Success',
        confirmationMessages[language],
        [{ text: 'OK', style: 'default' }]
      );
      
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(
        'Error',
        'भाषा बदलने में समस्या हुई'
      );
    }
  };

  const getSizeStyles = (): {
    container: ViewStyle;
    text: TextStyle;
    icon: number;
  } => {
    switch (size) {
      case 'small':
        return {
          container: { minHeight: 36, paddingHorizontal: theme.spacing.sm },
          text: { fontSize: theme.fontSizes.sm },
          icon: 16,
        };
      case 'large':
        return {
          container: { minHeight: 56, paddingHorizontal: theme.spacing.lg },
          text: { fontSize: theme.fontSizes.lg },
          icon: 28,
        };
      default:
        return {
          container: { minHeight: 44, paddingHorizontal: theme.spacing.md },
          text: { fontSize: theme.fontSizes.md },
          icon: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderLanguageItem: ListRenderItem<LanguageOption> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === currentLanguage && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item.code)}
      accessibilityRole="button"
      accessibilityLabel={`Select ${item.name} language`}
    >
      <View style={styles.languageInfo}>
        <Text style={[
          styles.languageName,
          item.code === currentLanguage && styles.selectedLanguageName,
        ]}>
          {item.nativeName}
        </Text>
        <Text style={[
          styles.languageSubtext,
          item.code === currentLanguage && styles.selectedLanguageSubtext,
        ]}>
          {item.name}
        </Text>
      </View>
      {item.code === currentLanguage && (
        <Ionicons 
          name="checkmark-circle" 
          size={24} 
          color={theme.colors.primary} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.selector, sizeStyles.container]}
        onPress={() => setIsModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`Current language: ${currentLang.nativeName}. Tap to change language`}
      >
        {showLabel && (
          <Text style={[styles.languageText, sizeStyles.text]}>
            {currentLang.nativeName}
          </Text>
        )}
        <Ionicons 
          name="chevron-down" 
          size={sizeStyles.icon} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                भाषा चुनें
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close language selector"
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.languageList}
            />

            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>
                भाषा बदलने से ऐप का इंटरफेस बदल जाएगा
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  languageText: {
    flex: 1,
    color: theme.colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '70%',
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  languageList: {
    padding: theme.spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.md,
  },
  selectedLanguageItem: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: theme.colors.primary,
  },
  languageSubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  selectedLanguageSubtext: {
    color: theme.colors.primary,
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceVariant,
  },
  footerText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LanguageSelector;