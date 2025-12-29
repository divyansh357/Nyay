import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
  List,
  Divider,
  Text,
  useTheme,
  IconButton,
  Avatar,
  Surface,
  Chip,
  Dialog,
  Portal,
  RadioButton,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../contexts/LanguageContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OfflineIndicator from '../components/OfflineIndicator';
import { VoiceButton } from '../components/VoiceButton';
import { CustomTheme } from '../theme/types';

type AdhikarSamparkRouteProp = RouteProp<RootStackParamList, 'AdhikarSampark'>;
type AdhikarSamparkNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdhikarSampark'
>;

// Interface for contact option
interface ContactOption {
  id: string;
  name: string;
  role: string;
  organization: string;
  phone?: string;
  email?: string;
  address?: string;
  distance?: string; // Distance from user's location
  languages?: string[];
  availability?: string;
  icon: string;
}

const AdhikarSamparkScreen: React.FC = () => {
  const route = useRoute<AdhikarSamparkRouteProp>();
  const navigation = useNavigation<AdhikarSamparkNavigationProp>();
  const { colors } = useTheme() as CustomTheme;
  const { t } = useLanguage();
  
  // State variables
  const [subject, setSubject] = useState<string>(route.params?.subject || '');
  const [message, setMessage] = useState<string>(route.params?.message || '');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('legal');
  const [showContactDialog, setShowContactDialog] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<ContactOption | null>(null);
  const [filterDialog, setFilterDialog] = useState<boolean>(false);
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  
  // Mock contact options
  const contactOptions: Record<string, ContactOption[]> = {
    legal: [
      {
        id: '1',
        name: 'Adv. Rahul Sharma',
        role: 'Legal Aid Lawyer',
        organization: 'District Legal Services Authority',
        phone: '+91 9876543210',
        email: 'rahul.sharma@dlsa.gov.in',
        address: '123 Civil Court Complex, District HQ',
        distance: '5 km',
        languages: ['Hindi', 'English'],
        availability: 'Mon-Fri: 10 AM - 5 PM',
        icon: 'scale-balance',
      },
      {
        id: '2',
        name: 'Adv. Priya Singh',
        role: 'FRA Specialist',
        organization: 'Tribal Rights NGO',
        phone: '+91 9876543211',
        email: 'priya@tribalrights.org',
        address: '456 Community Center, Forest Colony',
        distance: '12 km',
        languages: ['Hindi', 'English', 'Gondi'],
        availability: 'Mon-Sat: 9 AM - 6 PM',
        icon: 'forest',
      },
      {
        id: '3',
        name: 'Adv. Mohan Gupta',
        role: 'Senior Advocate',
        organization: 'High Court',
        phone: '+91 9876543212',
        email: 'mohan.gupta@advocate.com',
        address: '789 High Court Complex',
        distance: '15 km',
        languages: ['Hindi', 'English', 'Marathi'],
        availability: 'By Appointment Only',
        icon: 'gavel',
      },
    ],
    government: [
      {
        id: '4',
        name: 'Shri Avinash Patel',
        role: 'District Forest Officer',
        organization: 'Forest Department',
        phone: '+91 9876543213',
        email: 'dfo@forestdept.gov.in',
        address: 'Forest Office Complex, District HQ',
        distance: '8 km',
        languages: ['Hindi', 'English'],
        availability: 'Mon-Fri: 10 AM - 4 PM',
        icon: 'pine-tree',
      },
      {
        id: '5',
        name: 'Smt. Sunita Verma',
        role: 'Tribal Welfare Officer',
        organization: 'Tribal Development Department',
        phone: '+91 9876543214',
        email: 'sunita.verma@tribal.gov.in',
        address: 'Tribal Welfare Office, District HQ',
        distance: '7 km',
        languages: ['Hindi', 'English', 'Tribal dialects'],
        availability: 'Mon-Fri: 9 AM - 5 PM',
        icon: 'office-building',
      },
    ],
    ngo: [
      {
        id: '6',
        name: 'Shri Rakesh Kumar',
        role: 'Field Coordinator',
        organization: 'Van Adhikar Samiti',
        phone: '+91 9876543215',
        email: 'rakesh@vanadhikar.org',
        address: 'Village Community Center',
        distance: '2 km',
        languages: ['Hindi', 'Local dialect'],
        availability: 'All days: 8 AM - 8 PM',
        icon: 'account-group',
      },
      {
        id: '7',
        name: 'Dr. Meena Kumari',
        role: 'Program Director',
        organization: 'Forest Rights Action',
        phone: '+91 9876543216',
        email: 'meena@forestrightsaction.org',
        address: 'NGO Office, District HQ',
        distance: '9 km',
        languages: ['Hindi', 'English', 'Bengali'],
        availability: 'Mon-Sat: 10 AM - 7 PM',
        icon: 'hand-heart',
      },
    ],
    community: [
      {
        id: '8',
        name: 'Shri Ganesh Bhagat',
        role: 'Gram Pradhan',
        organization: 'Village Panchayat',
        phone: '+91 9876543217',
        email: 'grampanchayat@gov.in',
        address: 'Gram Panchayat Office',
        distance: '0.5 km',
        languages: ['Hindi', 'Local dialect'],
        availability: 'All days',
        icon: 'home-city',
      },
      {
        id: '9',
        name: 'Smt. Lakshmi Devi',
        role: 'Community Mobilizer',
        organization: 'Self Help Group Federation',
        phone: '+91 9876543218',
        email: 'lakshmi@shg.org',
        address: 'Community Hall',
        distance: '1 km',
        languages: ['Hindi', 'Local dialect'],
        availability: 'Weekends primarily',
        icon: 'account-supervisor',
      },
    ],
  };

  const handleSubmit = () => {
    // Simple validation
    if (!subject.trim() || !message.trim() || !name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    // Simulate submission
    Alert.alert(
      'Success',
      'Your message has been submitted successfully. Someone will contact you shortly.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleCallContact = (phoneNumber: string) => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Linking.openURL(`telprompt:${phoneNumber}`);
    }
  };

  const handleEmailContact = (email: string) => {
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
  };

  const handleFilterContacts = () => {
    setFilterDialog(true);
  };

  // Filter contacts based on selected language
  const getFilteredContacts = (category: string) => {
    if (languageFilter === 'all') {
      return contactOptions[category];
    }
    
    return contactOptions[category].filter(contact => 
      contact.languages?.includes(languageFilter)
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('adhikar_sampark')} />
        <Appbar.Action icon="filter" onPress={handleFilterContacts} />
      </Appbar.Header>

      <OfflineIndicator />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Introduction Card */}
          <Card style={styles.introCard}>
            <Card.Content>
              <Title style={styles.introTitle}>{t('contact_support_title')}</Title>
              <Paragraph style={styles.introParagraph}>
                {t('contact_support_description')}
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Contact Categories */}
          <Card style={styles.categoriesCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>{t('contact_categories')}</Title>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedOption === 'legal' && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedOption('legal')}
                >
                  <MaterialCommunityIcons 
                    name="scale-balance" 
                    size={24} 
                    color={selectedOption === 'legal' ? '#fff' : colors.primary} 
                  />
                  <Text 
                    style={[
                      styles.categoryText, 
                      selectedOption === 'legal' ? { color: '#fff' } : { color: colors.primary }
                    ]}
                  >
                    {t('legal_aid')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedOption === 'government' && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedOption('government')}
                >
                  <MaterialCommunityIcons 
                    name="office-building" 
                    size={24} 
                    color={selectedOption === 'government' ? '#fff' : colors.primary} 
                  />
                  <Text 
                    style={[
                      styles.categoryText, 
                      selectedOption === 'government' ? { color: '#fff' } : { color: colors.primary }
                    ]}
                  >
                    {t('government')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedOption === 'ngo' && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedOption('ngo')}
                >
                  <MaterialCommunityIcons 
                    name="hand-heart" 
                    size={24} 
                    color={selectedOption === 'ngo' ? '#fff' : colors.primary} 
                  />
                  <Text 
                    style={[
                      styles.categoryText, 
                      selectedOption === 'ngo' ? { color: '#fff' } : { color: colors.primary }
                    ]}
                  >
                    {t('ngos')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedOption === 'community' && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedOption('community')}
                >
                  <MaterialCommunityIcons 
                    name="account-group" 
                    size={24} 
                    color={selectedOption === 'community' ? '#fff' : colors.primary} 
                  />
                  <Text 
                    style={[
                      styles.categoryText, 
                      selectedOption === 'community' ? { color: '#fff' } : { color: colors.primary }
                    ]}
                  >
                    {t('community')}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Contacts List */}
              <View style={styles.contactsContainer}>
                {getFilteredContacts(selectedOption).length > 0 ? (
                  getFilteredContacts(selectedOption).map((contact) => (
                    <Surface key={contact.id} style={styles.contactCard}>
                      <TouchableOpacity
                        style={styles.contactCardContent}
                        onPress={() => {
                          setSelectedContact(contact);
                          setShowContactDialog(true);
                        }}
                      >
                        <View style={styles.contactIconContainer}>
                          <Avatar.Icon 
                            icon={contact.icon} 
                            size={50} 
                            style={{ backgroundColor: colors.primary + '20' }}
                            color={colors.primary}
                          />
                        </View>
                        
                        <View style={styles.contactInfo}>
                          <Text style={styles.contactName}>{contact.name}</Text>
                          <Text style={styles.contactRole}>{contact.role}</Text>
                          <Text style={styles.contactOrg}>{contact.organization}</Text>
                          
                          <View style={styles.contactDetailRow}>
                            <MaterialCommunityIcons 
                              name="map-marker" 
                              size={14} 
                              color={colors.primary} 
                              style={styles.detailIcon} 
                            />
                            <Text style={styles.contactDistance}>{contact.distance}</Text>
                            
                            {contact.languages && (
                              <>
                                <MaterialCommunityIcons 
                                  name="translate" 
                                  size={14} 
                                  color={colors.primary} 
                                  style={[styles.detailIcon, { marginLeft: 8 }]} 
                                />
                                <Text style={styles.contactLanguages}>
                                  {contact.languages.join(', ')}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                        
                        <IconButton 
                          icon="chevron-right" 
                          size={24} 
                          iconColor={colors.primary}
                        />
                      </TouchableOpacity>

                      <Divider style={styles.contactDivider} />
                      
                      <View style={styles.contactActions}>
                        <TouchableOpacity 
                          style={styles.contactActionButton}
                          onPress={() => contact.phone && handleCallContact(contact.phone)}
                        >
                          <MaterialCommunityIcons name="phone" size={20} color={colors.primary} />
                          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                            {t('call')}
                          </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.contactActionButton}
                          onPress={() => contact.email && handleEmailContact(contact.email)}
                        >
                          <MaterialCommunityIcons name="email" size={20} color={colors.primary} />
                          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                            {t('email')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Surface>
                  ))
                ) : (
                  <View style={styles.noContactsContainer}>
                    <MaterialCommunityIcons 
                      name="account-search" 
                      size={48} 
                      color={colors.secondary} 
                    />
                    <Text style={styles.noContactsText}>
                      {t('no_contacts_found')}
                    </Text>
                    <Text style={styles.noContactsSubtext}>
                      {t('try_different_filter')}
                    </Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>

          {/* Direct Contact Form */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>{t('contact_form_title')}</Title>
              
              <TextInput
                label={t('your_name')}
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label={t('your_phone')}
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
              />
              
              <TextInput
                label={t('subject')}
                value={subject}
                onChangeText={setSubject}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label={t('message')}
                value={message}
                onChangeText={setMessage}
                style={styles.textarea}
                mode="outlined"
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.voiceContainer}>
                <VoiceButton
                  onVoiceInput={(text) => {
                    setMessage((prev) => prev + ' ' + text);
                  }}
                  size="medium"
                />
                <Text style={styles.voiceHint}>{t('tap_to_speak')}</Text>
              </View>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                {t('submit')}
              </Button>
            </Card.Content>
          </Card>

          {/* FAQs section */}
          <Card style={styles.faqCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>{t('faqs')}</Title>
              
              <List.Accordion
                title={t('faq_1_title')}
                left={(props) => <List.Icon {...props} icon="help-circle" />}
              >
                <List.Item
                  title={t('faq_1_answer')}
                  titleNumberOfLines={10}
                  titleStyle={styles.faqAnswer}
                />
              </List.Accordion>
              
              <List.Accordion
                title={t('faq_2_title')}
                left={(props) => <List.Icon {...props} icon="help-circle" />}
              >
                <List.Item
                  title={t('faq_2_answer')}
                  titleNumberOfLines={10}
                  titleStyle={styles.faqAnswer}
                />
              </List.Accordion>
              
              <List.Accordion
                title={t('faq_3_title')}
                left={(props) => <List.Icon {...props} icon="help-circle" />}
              >
                <List.Item
                  title={t('faq_3_answer')}
                  titleNumberOfLines={10}
                  titleStyle={styles.faqAnswer}
                />
              </List.Accordion>
            </Card.Content>
          </Card>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Contact Details Dialog */}
      <Portal>
        <Dialog
          visible={showContactDialog}
          onDismiss={() => setShowContactDialog(false)}
          style={styles.dialog}
        >
          {selectedContact && (
            <>
              <Dialog.Title style={styles.dialogTitle}>{selectedContact.name}</Dialog.Title>
              <Dialog.Content>
                <View style={styles.dialogIconContainer}>
                  <Avatar.Icon 
                    icon={selectedContact.icon} 
                    size={60} 
                    style={{ backgroundColor: colors.primary + '20' }}
                    color={colors.primary}
                  />
                </View>
                
                <View style={styles.dialogField}>
                  <MaterialCommunityIcons name="briefcase" size={20} color={colors.primary} />
                  <Text style={styles.dialogLabel}>{t('role')}</Text>
                  <Text style={styles.dialogValue}>{selectedContact.role}</Text>
                </View>
                
                <View style={styles.dialogField}>
                  <MaterialCommunityIcons name="office-building" size={20} color={colors.primary} />
                  <Text style={styles.dialogLabel}>{t('organization')}</Text>
                  <Text style={styles.dialogValue}>{selectedContact.organization}</Text>
                </View>
                
                {selectedContact.phone && (
                  <View style={styles.dialogField}>
                    <MaterialCommunityIcons name="phone" size={20} color={colors.primary} />
                    <Text style={styles.dialogLabel}>{t('phone')}</Text>
                    <Text style={styles.dialogValue}>{selectedContact.phone}</Text>
                  </View>
                )}
                
                {selectedContact.email && (
                  <View style={styles.dialogField}>
                    <MaterialCommunityIcons name="email" size={20} color={colors.primary} />
                    <Text style={styles.dialogLabel}>{t('email')}</Text>
                    <Text style={styles.dialogValue}>{selectedContact.email}</Text>
                  </View>
                )}
                
                {selectedContact.address && (
                  <View style={styles.dialogField}>
                    <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary} />
                    <Text style={styles.dialogLabel}>{t('address')}</Text>
                    <Text style={styles.dialogValue}>{selectedContact.address}</Text>
                  </View>
                )}
                
                {selectedContact.availability && (
                  <View style={styles.dialogField}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color={colors.primary} />
                    <Text style={styles.dialogLabel}>{t('availability')}</Text>
                    <Text style={styles.dialogValue}>{selectedContact.availability}</Text>
                  </View>
                )}
                
                {selectedContact.languages && (
                  <View style={styles.dialogField}>
                    <MaterialCommunityIcons name="translate" size={20} color={colors.primary} />
                    <Text style={styles.dialogLabel}>{t('languages')}</Text>
                    <View style={styles.languageChips}>
                      {selectedContact.languages.map((lang, index) => (
                        <Chip key={index} style={styles.languageChip}>
                          {lang}
                        </Chip>
                      ))}
                    </View>
                  </View>
                )}
              </Dialog.Content>
              <Dialog.Actions>
                {selectedContact.phone && (
                  <Button
                    icon="phone"
                    onPress={() => {
                      setShowContactDialog(false);
                      handleCallContact(selectedContact.phone!);
                    }}
                  >
                    {t('call')}
                  </Button>
                )}
                {selectedContact.email && (
                  <Button
                    icon="email"
                    onPress={() => {
                      setShowContactDialog(false);
                      handleEmailContact(selectedContact.email!);
                    }}
                  >
                    {t('email')}
                  </Button>
                )}
                <Button onPress={() => setShowContactDialog(false)}>{t('close')}</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>

      {/* Language Filter Dialog */}
      <Portal>
        <Dialog
          visible={filterDialog}
          onDismiss={() => setFilterDialog(false)}
          style={styles.filterDialog}
        >
          <Dialog.Title>{t('filter_by_language')}</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => setLanguageFilter(value)} value={languageFilter}>
              <RadioButton.Item label={t('all_languages')} value="all" />
              <RadioButton.Item label="Hindi" value="Hindi" />
              <RadioButton.Item label="English" value="English" />
              <RadioButton.Item label={t('local_dialect')} value="Local dialect" />
              <RadioButton.Item label="Gondi" value="Gondi" />
              <RadioButton.Item label="Marathi" value="Marathi" />
              <RadioButton.Item label="Bengali" value="Bengali" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFilterDialog(false)}>{t('apply')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  introCard: {
    marginBottom: 16,
    elevation: 2,
  },
  introTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  introParagraph: {
    opacity: 0.7,
  },
  categoriesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    minWidth: 90,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  contactsContainer: {
    marginTop: 8,
  },
  contactCard: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  contactCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIconContainer: {
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 14,
    opacity: 0.8,
  },
  contactOrg: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  contactDistance: {
    fontSize: 12,
    opacity: 0.7,
  },
  contactLanguages: {
    fontSize: 12,
    opacity: 0.7,
  },
  contactDivider: {
    height: 1,
  },
  contactActions: {
    flexDirection: 'row',
    padding: 8,
  },
  contactActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  noContactsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  noContactsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noContactsSubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 12,
  },
  textarea: {
    marginBottom: 16,
  },
  voiceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  voiceHint: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
  submitButton: {
    marginTop: 8,
  },
  faqCard: {
    marginBottom: 16,
    elevation: 2,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  bottomSpacing: {
    height: 20,
  },
  dialog: {
    borderRadius: 8,
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dialogLabel: {
    fontWeight: 'bold',
    marginHorizontal: 8,
    width: 100,
  },
  dialogValue: {
    flex: 1,
  },
  languageChips: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageChip: {
    margin: 2,
  },
  filterDialog: {
    borderRadius: 8,
  },
});

export default AdhikarSamparkScreen;