import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Animated, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Text,
  Button,
  Searchbar,
  useTheme,
  Badge,
  Avatar,
  IconButton,
  Divider,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppStore } from '../store';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CustomTheme } from '../theme/types';
import OfflineIndicator from '../components/OfflineIndicator';
import { api } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define the type for navigation
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { colors } = useTheme() as CustomTheme;
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t, currentLanguage } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  const { user, isInternetReachable } = useAppStore(state => ({
    user: state.user,
    isInternetReachable: state.isInternetReachable,
  }));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await api.searchClaims(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const userName = user?.name || t('welcome_user_default');
  
  const recentNews = [
    {
      id: '1',
      title: t('home_news_title_1') || "Forest Rights Act Amendment Proposal",
      date: '2023-05-15',
      description: t('home_news_desc_1') || "New amendments proposed to streamline the claim verification process and reduce processing time.",
      image: require('../../assets/image.png'),
    },
    {
      id: '2',
      title: t('home_news_title_2') || "Community Claims Workshop",
      date: '2023-05-01',
      description: t('home_news_desc_2') || "Free workshop on preparing community forest rights claims to be held next month.",
      image: require('../../assets/image.png'),
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header>
        <Image 
          source={require('../../assets/Nyayasetu logo.png')} 
          style={styles.headerLogo} 
          resizeMode="contain"
        />
        <Appbar.Content title="NyayaSetu" subtitle={t('app_tagline') || "Your Bridge to Justice"} />
        <Appbar.Action 
          icon="bell" 
          onPress={() => setShowNotificationBadge(false)} 
          style={styles.notificationIcon}
        />
        {showNotificationBadge && (
          <Badge
            size={8}
            style={styles.notificationBadge}
          />
        )}
        <Appbar.Action icon="cog" onPress={() => {/* Open settings */}} />
      </Appbar.Header>

      <OfflineIndicator />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome section with animation */}
        <Animated.View 
          style={[
            styles.welcomeSection, 
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={[styles.welcomeText, { color: colors.primary }]}>
                {t('welcome_title') || "Welcome"} {userName}!
              </Text>
              <Text style={styles.subtitle}>{t('welcome_subtitle') || "Track your claims and get legal assistance"}</Text>
            </View>
            <Avatar.Image 
              size={50} 
              source={user?.avatar ? { uri: user.avatar } : require('../../assets/icon.png')} 
            />
          </View>
          
          <View style={styles.languageChip}>
            <Chip 
              icon="translate" 
              onPress={() => navigation.navigate('AuthScreen', { showLanguageSelector: true })}
              style={{ backgroundColor: colors.primaryContainer }}
            >
              {currentLanguage === 'en' ? 'English' : currentLanguage === 'hi' ? 'हिंदी' : 'ଓଡ଼ିଆ'}
            </Chip>
          </View>
        </Animated.View>

        {/* Search bar with enhanced design */}
        <Card style={styles.searchCard}>
          <Card.Content>
            <Title>{t('search_title') || "Search Claims"}</Title>
            <Searchbar
              placeholder={t('search_placeholder') || "Enter claim ID or keywords"}
              onChangeText={setSearchQuery}
              value={searchQuery}
              onSubmitEditing={handleSearch}
              loading={isSearching}
              style={styles.searchBar}
              icon="magnify"
            />
          </Card.Content>
        </Card>

        {/* Services Grid */}
        <Title style={styles.sectionTitle}>{t('home_services') || "Services"}</Title>
        <View style={styles.servicesGrid}>
          <TouchableOpacity 
            style={styles.serviceItem}
            onPress={() => navigation.navigate('ClaimTracker')}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: colors.primaryContainer }]}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color={colors.primary} />
            </View>
            <Text style={styles.serviceTitle}>{t('home_service_claims') || "Claims"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.serviceItem}
            onPress={() => navigation.navigate('NyayaMitra')}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: colors.secondaryContainer }]}>
              <MaterialCommunityIcons name="chat-processing-outline" size={24} color={colors.secondary} />
            </View>
            <Text style={styles.serviceTitle}>{t('home_service_mitra') || "Nyaya Mitra"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.serviceItem}
            onPress={() => navigation.navigate('MappingTool')}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: colors.tertiaryContainer }]}>
              <MaterialCommunityIcons name="map-outline" size={24} color={colors.tertiary} />
            </View>
            <Text style={styles.serviceTitle}>{t('home_service_mapping') || "Mapping"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.serviceItem}
            onPress={() => navigation.navigate('AdhikarSampark')}
          >
            <View style={[styles.serviceIconContainer, { backgroundColor: '#e1f5fe' }]}>
              <MaterialCommunityIcons name="phone-outline" size={24} color="#0288d1" />
            </View>
            <Text style={styles.serviceTitle}>{t('home_service_contact') || "Contact"}</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Updates */}
        <Title style={styles.sectionTitle}>{t('home_recent_updates') || "Recent Updates"}</Title>
        <Card style={styles.newsCard}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newsScrollContainer}
          >
            {recentNews.map((item) => (
              <Card key={item.id} style={styles.newsItem}>
                <Card.Cover source={item.image} style={styles.newsImage} />
                <Card.Content>
                  <Title numberOfLines={1} style={styles.newsTitle}>{item.title}</Title>
                  <Paragraph numberOfLines={2} style={styles.newsDescription}>
                    {item.description}
                  </Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button>{t('read_more') || "Read More"}</Button>
                </Card.Actions>
              </Card>
            ))}
          </ScrollView>
        </Card>

        {/* Quick Actions */}
        <Title style={styles.sectionTitle}>{t('home_quick_actions') || "Quick Actions"}</Title>

        {/* Claim Tracker Quick Action */}
        <Card
          style={styles.card}
          onPress={() => navigation.navigate('ClaimTracker')}
          mode="elevated">
          <Card.Content style={styles.quickAction}>
            <View style={styles.quickActionText}>
              <Title>{t('home_qa_claim_title') || "Track Your Claim"}</Title>
              <Paragraph>{t('home_qa_claim_subtitle') || "Check status and updates for your forest rights claims"}</Paragraph>
            </View>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('ClaimTracker')}>
              {t('open') || "Open"}
            </Button>
          </Card.Content>
        </Card>

        {/* Nyaya Mitra Quick Action */}
        <Card
          style={styles.card}
          onPress={() => navigation.navigate('NyayaMitra')}
          mode="elevated">
          <Card.Content style={styles.quickAction}>
            <View style={styles.quickActionText}>
              <Title>{t('home_qa_mitra_title') || "Nyaya Mitra"}</Title>
              <Paragraph>{t('home_qa_mitra_subtitle') || "Get guidance and answers to your forest rights questions"}</Paragraph>
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('NyayaMitra')}>
              {t('ask') || "Ask"}
            </Button>
          </Card.Content>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <Title style={styles.sectionTitle}>{t('search_results') || "Search Results"}</Title>
            {searchResults.map((result, index) => (
              <Card key={index} style={styles.resultCard}>
                <Card.Content>
                  <Title>{result.referenceId}</Title>
                  <View style={styles.resultStatusContainer}>
                    <Chip
                      style={{ backgroundColor: 
                        result.currentStatus.toLowerCase().includes('approved') ? '#e6f4ea' :
                        result.currentStatus.toLowerCase().includes('reject') ? '#fce8e6' :
                        '#fff8e1'
                      }}
                    >
                      {result.currentStatus}
                    </Chip>
                  </View>
                  <Paragraph>{result.latestDescription}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => navigation.navigate('ClaimTracker', { claimId: result.referenceId })}>
                    {t('view_details') || "View Details"}
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </>
        )}

        {/* Footer space */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 NyayaSetu</Text>
          <Text style={styles.footerVersion}>v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginLeft: 8,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  languageChip: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  searchCard: {
    marginBottom: 24,
    elevation: 2,
  },
  searchBar: {
    marginTop: 8,
    elevation: 0,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceItem: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  newsCard: {
    marginBottom: 24,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  newsScrollContainer: {
    paddingBottom: 8,
  },
  newsItem: {
    width: width * 0.75,
    marginRight: 12,
    overflow: 'hidden',
  },
  newsImage: {
    height: 140,
  },
  newsTitle: {
    fontSize: 16,
  },
  newsDescription: {
    fontSize: 14,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  quickAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickActionText: {
    flex: 1,
    marginRight: 8,
  },
  resultCard: {
    marginBottom: 8,
    elevation: 1,
  },
  resultStatusContainer: {
    marginVertical: 8,
  },
  footer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.6,
    fontSize: 12,
  },
  footerVersion: {
    opacity: 0.5,
    fontSize: 12,
    marginTop: 4,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 62,
    backgroundColor: '#f44336',
  },
});

export default HomeScreen;