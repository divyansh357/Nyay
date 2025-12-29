import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Modal, Alert, View } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Button,
  List,
  IconButton,
  Divider,
  Avatar,
  Chip,
} from 'react-native-paper';
import { useAppStore } from '../store';
import { useLanguage } from '../contexts/LanguageContext';
import { Scheme } from '../types';
import { CustomTheme } from '../theme/types';

const AdhikarSamparkScreen: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const { t } = useLanguage();
  const schemes = useAppStore(state => state.schemes);
  const user = useAppStore(state => state.user);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const userName = user?.name || 'मित्र';

  const schemeMap = useMemo(() => {
    const map = new Map<string, Scheme>();
    schemes.forEach(scheme => map.set(scheme.schemeId, scheme));
    return map;
  }, [schemes]);

  type PersonalizedRightsCard = {
    id: string;
    title: string;
    question: string;
    answer: string;
    insight: string;
    keyActions: string[];
    tags: string[];
    schemeIds: string[];
  };

  const personalizedRights = useMemo<PersonalizedRightsCard[]>(() => {
    const cards: PersonalizedRightsCard[] = [
      {
        id: 'fra-individual-title',
        title: 'वन भूमि पर व्यक्तिगत अधिकार',
        question: `${userName}, क्या आपका परिवार 13 दिसंबर 2005 से पहले जंगल की भूमि पर रह रहा है?`,
        answer:
          'आपको वनाधिकार अधिनियम (FRA) के तहत व्यक्तिगत अधिकार के लिए दावा करने का हक़ है। ग्राम सभा आपके दावे की सुनवाई करके शासन को अनुशंसा भेजती है।',
        insight:
          'अपना पट्टा मिलने से आप घर, खेती और आजीविका के लिए सरकारी योजनाओं का लाभ उठा पाएँगे।',
        keyActions: [
          'ग्राम सभा से व्यक्तिगत दावा फ़ॉर्म (Form-A) लेकर पूर्ण विवरण के साथ भरें',
          'वन भूमि पर कब्ज़े का प्रमाण (राशन कार्ड, स्कूल प्रमाण पत्र, उपग्रह चित्र) तैयार रखें',
          'ग्राम वनाधिकार समिति की बैठक में अपनी बात रखें और रसीद अवश्य लें',
        ],
        tags: ['#FRA', '#LandTitle', '#ForestRights'],
        schemeIds: ['PMAY-G', 'MGNREGA'],
      },
      {
        id: 'community-forest',
        title: 'सामुदायिक वन संसाधन अधिकार',
        question: 'क्या आपका गाँव जंगल से लघु वनोपज, बांस, महुआ या तेंदू पत्ता इकठ्ठा करता है?',
        answer:
          'सामुदायिक वन संसाधन अधिकार से ग्राम सभा पूरे वन क्षेत्र पर प्रबंधन और उपयोग का अधिकार प्राप्त कर सकती है। इससे सामूहिक आजीविका और वन संरक्षण दोनों मजबूत होते हैं।',
        insight:
          'सामुदायिक पट्टा मिलने से वन उत्पादों का मूल्य गाँव तय कर सकता है और बाज़ार से सीधे जुड़ाव संभव होता है।',
        keyActions: [
          'ग्राम सभा की विशेष बैठक बुलाकर समुदाय के पारंपरिक उपयोग का मानचित्र तैयार करें',
          'प्रत्येक परिवार से लिखित प्रमाण एकत्रित करें कि संसाधनों का उपयोग किस प्रकार होता है',
          'दावा फ़ाइल में पारंपरिक नियम एवं संरक्षण योजना संलग्न करें',
        ],
        tags: ['#CommunityRights', '#ForestProduce', '#Livelihood'],
        schemeIds: ['MGNREGA'],
      },
    ];

    if (!user?.hasLandTitle) {
      cards.push({
        id: 'support-title',
        title: 'पट्टा सहायता और दस्तावेज़ तैयार करना',
        question: 'आपको भूमि के कागज़ तैयार करने में दिक्कत हो रही है?',
        answer:
          'NyayaSetu आपकी पंचायत, वन विभाग और विकासखंड से आवश्यक दस्तावेज़ जुटाने में मदद कर सकता है।',
        insight:
          'सही दस्तावेज़ होने से दावा जल्दी स्वीकृत होता है और भविष्य में किसी भी योजना का लाभ लेने में आसानी रहती है।',
        keyActions: [
          'परिवार की मतदाता सूची प्रति और निवास प्रमाण की कॉपी निकालें',
          'जंगल पर निर्भरता के प्रमाण के लिए वरिष्ठ सदस्यों का शपथ पत्र तैयार करें',
          'ग्राम सचिव से संपत्ति का नक्शा या राजस्व अभिलेख की प्रति प्राप्त करें',
        ],
        tags: ['#Documentation', '#Support', '#NyayaMitra'],
        schemeIds: ['PMAY-G'],
      });
    }

    if (user?.hasSchoolChildren || user?.hasSchoolChildren === undefined) {
      cards.push({
        id: 'education-rights',
        title: 'बच्चों की शिक्षा और छात्रवृत्ति अधिकार',
        question: 'क्या आपके घर में स्कूल जाने वाले बच्चे हैं?',
        answer:
          'अनुसूचित जनजाति छात्रों के लिए Eklavya Model Residential School और छात्रवृत्ति योजनाएँ उपलब्ध हैं।',
        insight:
          'सही योजना से बच्चों की शिक्षा खर्च में बड़ी सहायता मिलती है और उच्च शिक्षा का मार्ग खुलता है।',
        keyActions: [
          'निकटतम एकलव्य विद्यालय या कन्या छात्रावास की जानकारी एकत्र करें',
          'विद्यालय में जाति और आय प्रमाण पत्र जमा करके छात्रवृत्ति आवेदन करें',
          'राज्य पोर्टल पर प्री-मैट्रिक / पोस्ट-मैट्रिक छात्रवृत्ति की समय सीमा जांचें',
        ],
        tags: ['#Education', '#Scholarship', '#Youth'],
        schemeIds: ['PM-KISAN'],
      });
    }

    if (user?.primaryOccupation === 'Agriculture' || !user?.primaryOccupation) {
      cards.push({
        id: 'livelihood-support',
        title: 'वन-आधारित जीविका को मज़बूत करें',
        question: 'क्या आप जंगल के साथ खेती या लघु वनोपज पर निर्भर हैं?',
        answer:
          'एमएसपी आधारित खरीद, वन धन विकास केंद्र और कृषि वानिकी योजनाएँ आपके परिवार की आय बढ़ा सकती हैं।',
        insight:
          'स्थायी आय से परिवार की सुरक्षा बढ़ती है और भविष्य की योजनाएँ बनाने में मदद मिलती है।',
        keyActions: [
          'वन धन सहायता केंद्र या SHG से संपर्क कर मूल्य संवर्धन प्रशिक्षण लें',
          'MGNREGA से खेत तालाब/सॉयल मॉइस्चर कार्य स्वीकृत करवाएँ',
          'कृषि विभाग से बांस, फलदार पेड़ों की रोपाई योजना पर चर्चा करें',
        ],
        tags: ['#Livelihood', '#MSP', '#VillageEnterprise'],
        schemeIds: ['MGNREGA', 'PM-KISAN'],
      });
    }

    return cards;
  }, [user?.hasLandTitle, user?.hasSchoolChildren, user?.primaryOccupation, userName]);

  const recommendedSchemes = useMemo(() => {
    const ids = new Set<string>();
    personalizedRights.forEach(card => {
      card.schemeIds.forEach(id => ids.add(id));
    });
    return Array.from(ids)
      .map(id => schemeMap.get(id))
      .filter((scheme): scheme is Scheme => Boolean(scheme));
  }, [personalizedRights, schemeMap]);

  const handleSchemePress = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setModalVisible(true);
  };

  const getSchemeIcon = (schemeId: string) => {
    switch (schemeId) {
      case 'PMAY-G':
        return 'home-group';
      case 'MGNREGA':
        return 'excavator';
      case 'PM-KISAN':
        return 'leaf';
      default:
        return 'text-box-outline';
    }
  };

  const renderSchemeCard = (scheme: Scheme) => (
    <Card
      key={scheme.schemeId}
      style={styles.card}
      onPress={() => handleSchemePress(scheme)}
    >
      <Card.Title
        title={scheme.name}
        subtitle={scheme.description}
        subtitleNumberOfLines={2}
        left={props => (
          <Avatar.Icon
            {...props}
            icon={getSchemeIcon(scheme.schemeId)}
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
        )}
        right={props => <IconButton {...props} icon="chevron-right" />}
      />
      <Card.Content>
        <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
          {t('adhikar_sampark_main_benefit')}
        </Text>
        {scheme.benefits.slice(0, 1).map((benefit, index) => (
          <Text key={index} style={styles.benefitText}>
            {benefit}
          </Text>
        ))}
      </Card.Content>
    </Card>
  );

  const renderSchemeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Card style={styles.modalCard}>
        <ScrollView>
          <Card.Title
            title={selectedScheme?.name}
            titleVariant="headlineSmall"
            right={props => (
              <IconButton
                {...props}
                icon="close"
                onPress={() => setModalVisible(false)}
              />
            )}
          />
          <Card.Content>
            <Text style={styles.modalDescription}>
              {selectedScheme?.description}
            </Text>
            <List.Section>
              <List.Subheader>{t('adhikar_sampark_benefits')}</List.Subheader>
              {selectedScheme?.benefits.map((benefit, index) => (
                <List.Item
                  key={`benefit-${index}`}
                  title={benefit}
                  titleNumberOfLines={3}
                  left={() => <List.Icon icon="check-circle-outline" color={theme.colors.success} />}
                />
              ))}
            </List.Section>
            <Divider />
            <List.Section>
              <List.Subheader>{t('adhikar_sampark_eligibility')}</List.Subheader>
              {selectedScheme?.eligibilityCriteria.map((criteria, index) => (
                <List.Item
                  key={`criteria-${index}`}
                  title={criteria}
                  titleNumberOfLines={3}
                  left={() => <List.Icon icon="account-check-outline" color={theme.colors.info} />}
                />
              ))}
            </List.Section>
            <Divider />
            <List.Section>
              <List.Subheader>{t('adhikar_sampark_application_process')}</List.Subheader>
              <Text style={styles.processText}>
                {selectedScheme?.applicationProcess}
              </Text>
            </List.Section>
          </Card.Content>
        </ScrollView>
        <Card.Actions style={styles.modalActions}>
          <Button
            mode="contained"
            icon="file-document-edit-outline"
            onPress={() => {
              setModalVisible(false);
              Alert.alert(t('adhikar_sampark_apply'), t('questionnaire_feature_soon'));
            }}
          >
            {t('adhikar_sampark_apply')}
          </Button>
        </Card.Actions>
      </Card>
    </Modal>
  );

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
              {t('adhikarSampark')}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>
              {t('adhikar_sampark_subtitle')}
            </Text>
            <Button
              mode="contained"
              icon="account-question-outline"
              style={styles.questionnaireButton}
              onPress={() => Alert.alert(t('adhikar_sampark_find_schemes'), t('questionnaire_feature_soon'))}
            >
              {t('adhikar_sampark_find_schemes')}
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title
            title="आपके व्यक्तिगत अधिकार मार्गदर्शक"
            subtitle={`${userName}, आपके प्रोफ़ाइल के आधार पर कुछ प्रमुख सुझाव:`}
            subtitleNumberOfLines={2}
            left={props => (
              <Avatar.Icon
                {...props}
                icon="account-check-outline"
                style={{ backgroundColor: theme.colors.primaryContainer }}
              />
            )}
          />
          <Card.Content style={styles.personalizedContent}>
            {personalizedRights.map(item => {
              const relatedSchemes = item.schemeIds
                .map(id => schemeMap.get(id))
                .filter((scheme): scheme is Scheme => Boolean(scheme));

              return (
                <Card key={item.id} style={styles.rightsCard} mode="elevated">
                  <Card.Content style={styles.rightsCardContent}>
                    <Text style={styles.rightsTitle}>{item.title}</Text>
                    <Text style={styles.rightsQuestion}>{item.question}</Text>
                    <Text style={styles.rightsAnswer}>{item.answer}</Text>
                    <Text style={styles.rightsInsight}>{item.insight}</Text>

                    <List.Section style={styles.actionSection}>
                      <List.Subheader>अभी क्या करें?</List.Subheader>
                      {item.keyActions.map((action, index) => (
                        <List.Item
                          key={`${item.id}-action-${index}`}
                          title={action}
                          titleNumberOfLines={3}
                          left={() => (
                            <List.Icon icon="arrow-right-circle" color={theme.colors.primary} />
                          )}
                        />
                      ))}
                    </List.Section>

                    <View style={styles.tagContainer}>
                      {item.tags.map(tag => (
                        <Chip key={`${item.id}-${tag}`} mode="outlined" style={styles.tagChip}>
                          {tag}
                        </Chip>
                      ))}
                    </View>

                    {relatedSchemes.length > 0 && (
                      <View style={styles.schemeSuggestionContainer}>
                        <Text style={styles.schemeSuggestionLabel}>
                          सुझाई गई योजनाएँ
                        </Text>
                        {relatedSchemes.map(scheme => (
                          <List.Item
                            key={`${item.id}-${scheme.schemeId}`}
                            title={scheme.name}
                            description={scheme.benefits[0]}
                            descriptionNumberOfLines={2}
                            onPress={() => handleSchemePress(scheme)}
                            left={() => (
                              <List.Icon icon="hand-heart" color={theme.colors.secondary} />
                            )}
                            right={props => <IconButton {...props} icon="chevron-right" />}
                          />
                        ))}
                      </View>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Content>
        </Card>

        {recommendedSchemes.length > 0 && (
          <Card style={styles.card}>
            <Card.Title
              title="आपके लिए प्रमुख योजनाएँ"
              subtitle="इन योजनाओं से संबंधित दस्तावेज़ और पात्रता अपने सलाहकार से अवश्य जाँचें"
              left={props => (
                <Avatar.Icon
                  {...props}
                  icon="lightbulb-on"
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                />
              )}
            />
            <Card.Content>
              {recommendedSchemes.map(scheme => (
                <List.Item
                  key={`recommended-${scheme.schemeId}`}
                  title={scheme.name}
                  description={scheme.description}
                  descriptionNumberOfLines={2}
                  onPress={() => handleSchemePress(scheme)}
                  left={() => <List.Icon icon="shield-star" color={theme.colors.primary} />}
                  right={props => <IconButton {...props} icon="chevron-right" />}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Title title={t('adhikar_sampark_schemes_list')} />
          <Card.Content>
            {schemes.length > 0 ? (
              schemes.map(renderSchemeCard)
            ) : (
              <Text>{t('adhikar_sampark_no_schemes')}</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      {renderSchemeModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    
  },
  headerContent: {
    alignItems: 'center',
    gap: 16,
  },
  questionnaireButton: {
    width: '100%',
  },
  card: {
    
  },
  personalizedContent: {
    gap: 16,
  },
  rightsCard: {
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
  },
  rightsCardContent: {
    gap: 12,
  },
  rightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
  },
  rightsQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#37474F',
  },
  rightsAnswer: {
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
  },
  rightsInsight: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E65100',
    backgroundColor: 'rgba(255, 152, 0, 0.08)',
    borderRadius: 12,
    padding: 12,
  },
  actionSection: {
    marginTop: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderColor: '#B0BEC5',
  },
  schemeSuggestionContainer: {
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#CFD8DC',
    paddingTop: 12,
    gap: 4,
  },
  schemeSuggestionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  benefitText: {
    marginTop: 4,
  },
  modalCard: {
    flex: 1,
    marginVertical: 40,
    marginHorizontal: 16,
  },
  modalDescription: {
    marginBottom: 16,
    lineHeight: 22,
  },
  processText: {
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  modalActions: {
    justifyContent: 'flex-end',
    padding: 16,
  },
});

export default AdhikarSamparkScreen;