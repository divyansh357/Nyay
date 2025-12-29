import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  TextInput,
  Card,
  Title,
  Paragraph,
  useTheme,
  Text,
  Avatar,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppStore } from '../store';
import { Message, NyayaMitraRequest } from '../types';
import { api } from '../services/api';
import { speechService } from '../services/speechService';
import { useLanguage } from '../contexts/LanguageContext';
import OfflineIndicator from '../components/OfflineIndicator';
import VoiceButton from '../components/VoiceButton';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CustomTheme } from '../theme/types';

type NyayaMitraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NyayaMitra'
>;

const NyayaMitraScreen = () => {
  const { colors, roundness } = useTheme() as CustomTheme;
  const navigation = useNavigation<NyayaMitraScreenNavigationProp>();
  const { t, language } = useLanguage();

  // Use individual selectors to prevent unnecessary rerenders
  const isInternetReachable = useAppStore(state => state.isInternetReachable);
  const user = useAppStore(state => state.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const showInfo = useCallback((message: string) => {
    const infoMessage: Message = {
      id: `info-${Date.now()}`,
      text: message,
      sender: 'bot',
      isInfo: true,
    };
    setMessages(prev => [...prev, infoMessage]);
  }, []);

  const fetchQuickQuestions = useCallback(async () => {
    try {
      const questions = await api.getQuickQuestions(language);
      setQuickQuestions(questions);
    } catch (error) {
      console.error('Failed to fetch quick questions:', error);
    }
  }, [language]);

  // Store speech callbacks in refs to avoid recreation on each render
  const speechCallbacksRef = useRef({
    onResults: (results: string[]) => {
      setInput(results[0] || '');
      setIsListening(false);
    },
    onError: (error: string) => {
      console.error(error);
      showInfo(t('nyaya_mitra_voice_clear'));
      setIsListening(false);
    }
  });

  // Update the callbacks ref when dependencies change
  useEffect(() => {
    speechCallbacksRef.current = {
      onResults: (results: string[]) => {
        setInput(results[0] || '');
        setIsListening(false);
      },
      onError: (error: string) => {
        console.error(error);
        showInfo(t('nyaya_mitra_voice_clear'));
        setIsListening(false);
      }
    };
  }, [showInfo, t]);

  // Initialize speech and welcome message once
  useEffect(() => {
    const initializeSpeech = async () => {
      await speechService.requestPermissions();
    };
    initializeSpeech();

    setMessages([
      {
        id: 'welcome',
        text: t('nyaya_mitra_welcome_text'),
        sender: 'bot',
      },
    ]);
    fetchQuickQuestions();
  }, [fetchQuickQuestions, t]);

  // Handle speech listening state changes
  useEffect(() => {
    if (isListening) {
      // Start listening using the current callbacks from ref
      speechService.startListening(
        speechCallbacksRef.current.onResults,
        speechCallbacksRef.current.onError,
        language,
      );
    } else {
      // Stop listening when isListening becomes false
      speechService.stopListening();
    }

    // Clean up when component unmounts
    return () => {
      speechService.stopListening();
    };
  }, [isListening, language]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = useCallback(async (text: string = input) => {
    if (!text.trim()) {
      showInfo(t('nyaya_mitra_enter_question'));
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Skip offline check for development
    // if (!isInternetReachable) {
    //   const offlineMessage: Message = {
    //     id: `bot-${Date.now()}`,
    //     text: `${t('nyaya_mitra_offline_fallback')} ${t(
    //       'nyaya_mitra_offline_alert',
    //     )}`,
    //     sender: 'bot',
    //   };
    //   setMessages(prev => [...prev, offlineMessage]);
    //   setIsTyping(false);
    //   return;
    // }

    try {
      const request: NyayaMitraRequest = {
        userId: user?.userId || 'anonymous',
        language,
        question: text,
      };
      const botResponse = await api.sendMessage(request);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse.response,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: 'Sorry, something went wrong.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [input, language, showInfo, t, user]);

  // Voice input is now handled directly by the VoiceButton component
  const handleVoiceInput = useCallback((text: string) => {
    setInput(text);
    // Auto-send after a short delay to give the user time to see what was transcribed
    setTimeout(() => handleSend(text), 800);
  }, [handleSend]);

  const renderMessage = useCallback((msg: Message) => {
    const isUser = msg.sender === 'user';
    const isInfo = msg.isInfo;

    if (isInfo) {
      return (
        <View key={msg.id} style={styles.infoContainer}>
          <Icon name="information-outline" size={20} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.info }]}>
            {msg.text}
          </Text>
        </View>
      );
    }

    return (
      <View
        key={msg.id}
        style={[
          styles.messageRow,
          { justifyContent: isUser ? 'flex-end' : 'flex-start' },
        ]}>
        {!isUser && (
          <Avatar.Icon
            size={32}
            icon="robot"
            style={[styles.avatar, { backgroundColor: colors.primary }]}
          />
        )}
        <Card
          style={[
            styles.messageCard,
            {
              backgroundColor: isUser ? colors.primary : colors.surface,
              borderTopLeftRadius: isUser ? roundness : 0,
              borderTopRightRadius: isUser ? 0 : roundness,
            },
          ]}>
          <Paragraph style={{ color: isUser ? colors.onPrimary : colors.onSurface }}>
            {msg.text}
          </Paragraph>
        </Card>
        {isUser && (
          <Avatar.Icon
            size={32}
            icon="account"
            style={[styles.avatar, { backgroundColor: colors.secondary }]}
          />
        )}
      </View>
    );
  }, [colors, roundness]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={t('nyaya_mitra_ai_assistant')}
          subtitle={
            !isInternetReachable ? t('nyaya_mitra_offline_fallback') : undefined
          }
        />
      </Appbar.Header>

      <OfflineIndicator />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexGrow}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.flexGrow}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }>
          <Card style={styles.welcomeCard}>
            <Card.Content>
              <Title>{t('nyaya_mitra_welcome_title')}</Title>
              {messages
                .filter(m => m.id === 'welcome')
                .map(msg => renderMessage(msg))}
            </Card.Content>
          </Card>

          {messages
            .filter(m => m.id !== 'welcome')
            .map(msg => renderMessage(msg))}

          {isTyping && (
            <View style={[styles.messageRow, { justifyContent: 'flex-start' }]}>
              <Avatar.Icon
                size={32}
                icon="robot"
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              />
              <Card
                style={[
                  styles.messageCard,
                  {
                    backgroundColor: colors.surface,
                    borderTopLeftRadius: 0,
                  },
                ]}>
                <ActivityIndicator animating={true} color={colors.primary} />
              </Card>
            </View>
          )}

          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>
              {t('nyaya_mitra_quick_questions')}
            </Text>
            {quickQuestions.map((q, i) => (
              <TouchableOpacity key={i} onPress={() => handleSend(q)}>
                <Card style={styles.quickQuestionCard}>
                  <Text style={{ color: colors.primary }}>{q}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.inputArea, { backgroundColor: colors.surface }]}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder={t('nyaya_mitra_placeholder')}
            multiline
          />
          <View style={styles.buttonsContainer}>
            <VoiceButton
              size="small"
              onVoiceInput={handleVoiceInput}
              disabled={isTyping}
              style={{ marginRight: 8 }}
            />
            <IconButton
              icon="send"
              size={24}
              onPress={() => handleSend()}
              disabled={isTyping || !input.trim()}
              style={{ backgroundColor: colors.primary }}
              iconColor={colors.onPrimary}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexGrow: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  welcomeCard: {
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  avatar: {
    marginHorizontal: 8,
  },
  messageCard: {
    maxWidth: '80%',
    padding: 8,
    borderRadius: 16,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  infoText: {
    marginLeft: 8,
  },
  quickQuestionsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quickQuestionCard: {
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default NyayaMitraScreen;