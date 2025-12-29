import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Title,
  useTheme,
  Divider,
  Snackbar,
  RadioButton,
} from 'react-native-paper';
import { CustomTheme } from '../theme/types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppStore } from '../store';
import { SupportedLanguage } from '../types';

const AuthScreen: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const { colors } = useTheme() as CustomTheme;
  const { t, language, setLanguage } = useLanguage();
  const updateUser = useAppStore(state => state.updateUser);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);

  const languages = [
    { label: 'English', value: 'en' as SupportedLanguage },
    { label: 'हिंदी', value: 'hi' as SupportedLanguage },
    { label: 'ଓଡ଼ିଆ', value: 'or' as SupportedLanguage },
  ];

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setSelectedLanguage(newLanguage);
    setLanguage(newLanguage).catch(err => {
      console.error("Error changing language:", err);
    });
  };

  const validatePhoneNumber = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleSendOtp = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      showSnackbar(t('auth_invalid_phone'));
      return;
    }
    
    if (!name.trim()) {
      showSnackbar(t('auth_enter_name'));
      return;
    }
    
    setLoading(true);
    
    // Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    // Simulate network request
    setTimeout(() => {
      setIsOtpSent(true);
      setLoading(false);
      showSnackbar(t('auth_otp_sent') + ' ' + newOtp);
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp) {
      showSnackbar(t('auth_invalid_otp'));
      return;
    }
    
    setLoading(true);
    
    // Simulate saving user data
    setTimeout(async () => {
      const userData = {
        userId: phoneNumber, // identify user by phone
        name: name,
        language: selectedLanguage,
        hasLandTitle: false,
        familySize: 4,
        hasSchoolChildren: false,
        primaryOccupation: 'Agriculture',
        eligibleSchemes: []
      };
      
      console.log('[AuthScreen] Saving user data:', userData);
      await updateUser(userData);
      console.log('[AuthScreen] User data saved, calling onAuthenticated');
      setLoading(false);
      onAuthenticated();
    }, 1500);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { backgroundColor: colors.background }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Nyayasetu logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Title style={[styles.appTitle, { color: colors.primary }]}>
              {t('app_name')}
            </Title>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Title style={[styles.cardTitle, { color: colors.primary }]}>
              {isOtpSent ? t('auth_verify_otp') : t('auth_welcome')}
            </Title>
            
            {!isOtpSent && (
              <>
                <Text style={[styles.subtitle, { color: colors.onSurface }]}>
                  {t('auth_subtitle')}
                </Text>

                <Text style={[styles.label, { color: colors.onSurface }]}>
                  {t('auth_select_language')}
                </Text>
                
                <RadioButton.Group
                  onValueChange={(value) => handleLanguageChange(value as SupportedLanguage)}
                  value={selectedLanguage}
                >
                  <View style={styles.languageContainer}>
                    {languages.map((lang) => (
                      <View key={lang.value} style={styles.radioItem}>
                        <RadioButton.Item
                          label={lang.label}
                          value={lang.value}
                          color={colors.primary}
                          labelStyle={{ color: colors.onSurface }}
                        />
                      </View>
                    ))}
                  </View>
                </RadioButton.Group>
                
                <Divider style={styles.divider} />
                
                <TextInput
                  label={t('auth_name')}
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={colors.primary}
                  activeOutlineColor={colors.primary}
                />

                <TextInput
                  label={t('auth_phone')}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  style={styles.input}
                  mode="outlined"
                  outlineColor={colors.primary}
                  activeOutlineColor={colors.primary}
                  left={<TextInput.Affix text="+91" />}
                  maxLength={10}
                />

                <Button
                  mode="contained"
                  onPress={handleSendOtp}
                  style={styles.button}
                  loading={loading}
                  disabled={loading}
                >
                  {t('auth_get_otp')}
                </Button>
              </>
            )}
            
            {isOtpSent && (
              <>
                <Text style={[styles.otpMessage, { color: colors.onSurface }]}>
                  {t('auth_otp_sent_to')} +91 {phoneNumber}
                </Text>
                
                <TextInput
                  label={t('auth_enter_otp')}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  style={styles.input}
                  mode="outlined"
                  outlineColor={colors.primary}
                  activeOutlineColor={colors.primary}
                  maxLength={6}
                />

                <Button
                  mode="contained"
                  onPress={handleVerifyOtp}
                  style={styles.button}
                  loading={loading}
                  disabled={loading}
                >
                  {t('auth_verify')}
                </Button>
                
                <Button
                  mode="text"
                  onPress={() => {
                    setIsOtpSent(false);
                    setOtp('');
                  }}
                  style={styles.textButton}
                  disabled={loading}
                >
                  {t('auth_change_number')}
                </Button>

                <Button
                  mode="text"
                  onPress={handleSendOtp}
                  style={styles.textButton}
                  disabled={loading}
                >
                  {t('auth_resend_otp')}
                </Button>
              </>
            )}
          </View>
          
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            style={{ backgroundColor: colors.secondary }}
          >
            {snackbarMessage}
          </Snackbar>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioItem: {
    width: '48%',
  },
  divider: {
    marginVertical: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  textButton: {
    marginTop: 8,
  },
  otpMessage: {
    fontSize: 14,
    marginBottom: 16,
  },
});

export default AuthScreen;