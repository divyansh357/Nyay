import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ClaimTrackerScreen from '../screens/ClaimTrackerScreen';
import NyayaMitraScreen from '../screens/NyayaMitraScreen';
import AdhikarSamparkScreen from '../screens/AdhikarSamparkScreen';
import MappingToolScreen from '../screens/MappingToolScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import theme
import { useTheme } from 'react-native-paper';
import { CustomTheme } from '../theme/types';
import { useLanguage } from '../contexts/LanguageContext';

const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Home: undefined;
  ClaimTracker: { claimId?: string };
  NyayaMitra: undefined;
  AdhikarSampark: undefined;
  MappingTool: undefined;
  Profile: undefined;
};

const AppNavigator: React.FC = () => {
  const { colors } = useTheme() as CustomTheme;
  const { t } = useLanguage();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              case 'ClaimTracker':
                iconName = focused ? 'document-text' : 'document-text-outline';
                break;
              case 'NyayaMitra':
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                break;
              case 'AdhikarSampark':
                iconName = focused ? 'list' : 'list-outline';
                break;
              case 'MappingTool':
                iconName = focused ? 'map' : 'map-outline';
                break;
              default:
                iconName = 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: colors.elevation.level2,
            borderTopColor: colors.outline,
          },
          headerStyle: {
            backgroundColor: colors.elevation.level2,
          },
          headerTitleStyle: {
            color: colors.onSurface,
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home') }} />
        <Tab.Screen
          name="ClaimTracker"
          component={ClaimTrackerScreen}
          options={{ title: t('claimTracker') }}
        />
        <Tab.Screen
          name="NyayaMitra"
          component={NyayaMitraScreen}
          options={{ title: t('nyayaMitra') }}
        />
        <Tab.Screen
          name="AdhikarSampark"
          component={AdhikarSamparkScreen}
          options={{ title: t('adhikarSampark') }}
        />
        <Tab.Screen
          name="MappingTool"
          component={MappingToolScreen}
          options={{ title: t('mappingTool') }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;