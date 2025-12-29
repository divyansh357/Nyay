# Implementation Guide for Enhanced NyayaSetu UI

This guide provides step-by-step instructions for implementing the enhanced UI components in the NyayaSetu mobile application.

## Prerequisites

- Ensure you have the latest code from the repository
- Node.js and npm/yarn installed
- React Native development environment set up

## Implementation Steps

### 1. Update the VoiceButton Import

The enhanced components use the VoiceButton component. Update the import statement in the enhanced screens:

```typescript
// Change from
import { VoiceButton } from '../components/VoiceButton';
// To
import VoiceButton from '../components/VoiceButton';
```

### 2. Update Translation Keys

Add the following translation keys to your language files:

```typescript
// Add these to your translation files in each supported language
{
  // Common
  "offline_mode_active": "You are currently in offline mode. Some features may be limited.",
  "dismiss": "Dismiss",
  "claim_saved_offline": "Claim has been saved for offline access",
  "tap_to_speak": "Tap to speak",
  "no_results_found": "No results found",
  "try_different_id": "Please try a different claim ID or check your internet connection",
  
  // Claim Tracker
  "claim_id_required": "Please enter a claim ID",
  "claim_not_found": "No claim found with this ID",
  "offline_search_error": "You're offline. Only saved claims can be accessed",
  "search_error": "Error searching for claim",
  "offline_title": "You're offline",
  "offline_refresh_message": "Cannot refresh claim details while offline",
  "refresh_error": "Failed to refresh claim details",
  "feature_coming_soon": "Coming Soon",
  "document_upload_soon": "Document upload feature will be available in the next update",
  "sharing_soon": "Sharing feature will be available in the next update",
  "claim_options": "Claim Options",
  "save_offline": "Save for offline use",
  "report_issue": "Report an issue",
  "share": "Share",
  "cancel": "Cancel",
  "search_claim": "Search for a Claim",
  "enter_claim_id": "Enter your claim reference ID",
  "search": "Search",
  "clear": "Clear",
  "recent_claims": "Recent Claims",
  "claim_details": "Claim Details",
  "claim_id": "Claim ID",
  "application_date": "Application Date",
  "claim_type": "Claim Type",
  "individual_claim": "Individual",
  "current_office": "Current Office",
  "last_updated": "Last Updated",
  "area_details": "Area Details",
  "additional_info": "Additional Information",
  "status_timeline": "Status Timeline",
  "no_status_updates": "No status updates available",
  "required_documents": "Required Documents",
  "upload_documents": "Upload Documents",
  "next_steps": "Next Steps",
  "ask_nyaya_mitra": "Ask NyayaMitra",
  "how_to_track": "How to Track Your Claim",
  "track_step_1": "Enter your claim reference ID in the search box above",
  "track_step_2": "View claim status, timeline, and required documents",
  "track_step_3": "Contact support if you need assistance or have questions",
  "view_details": "View Details",
  
  // Home Screen
  "welcome": "Welcome",
  "guest": "Guest",
  "home_subtitle": "Forest rights at your fingertips",
  "quick_actions": "Quick Actions",
  "track_claim": "Track Claim",
  "mapping_tool": "Mapping Tool",
  "nyaya_mitra": "Nyaya Mitra",
  "contact_support": "Contact Support",
  "your_claims": "Your Claims",
  "view_all": "View All",
  "schemes": "Government Schemes",
  "learn_more": "Learn More",
  "apply": "Apply",
  "news_updates": "News & Updates",
  "resources": "Resources",
  "need_help": "Need Help?",
  "support_description": "Get in touch with our support team for assistance with your claims or application process",
  
  // Adhikar Sampark Screen
  "adhikar_sampark": "Adhikar Sampark",
  "contact_support_title": "Connect with Support",
  "contact_support_description": "Get assistance from legal experts, government officials, NGOs, or community resources for help with your forest rights claims.",
  "contact_categories": "Contact Categories",
  "legal_aid": "Legal Aid",
  "government": "Government",
  "ngos": "NGOs",
  "community": "Community",
  "no_contacts_found": "No contacts found",
  "try_different_filter": "Try a different filter or category",
  "contact_form_title": "Send a Message",
  "your_name": "Your Name",
  "your_phone": "Phone Number",
  "subject": "Subject",
  "message": "Message",
  "submit": "Submit",
  "faqs": "Frequently Asked Questions",
  "faq_1_title": "What documents are required for a forest rights claim?",
  "faq_1_answer": "For individual forest rights claims, you'll need proof of identity, proof of residence, and evidence of occupation (photographs, statements from elders, government records, etc.). For community rights, you'll need details of community use patterns and Gram Sabha resolution.",
  "faq_2_title": "How long does the claim process take?",
  "faq_2_answer": "The process typically takes 3-6 months from submission to final decision, depending on verification complexity and case backlog. The verification stage takes about 1 month, field survey 2-3 weeks, and committee review 1-2 months.",
  "faq_3_title": "What if my claim is rejected?",
  "faq_3_answer": "If your claim is rejected, you have 60 days to file an appeal with the Sub-Divisional Level Committee (SDLC). Contact legal aid services through this app for assistance with the appeal process.",
  "filter_by_language": "Filter by Language",
  "all_languages": "All Languages",
  "local_dialect": "Local Dialect",
  "apply": "Apply",
  "call": "Call",
  "email": "Email",
  "close": "Close",
  "role": "Role",
  "organization": "Organization",
  "phone": "Phone",
  "address": "Address",
  "availability": "Availability",
  "languages": "Languages",
  "estimated_time": "Estimated Time",
  "days": "days"
}
```

### 3. Update the Store Interface

Add the `saveClaim` function to your app store:

```typescript
// In src/store/index.ts

// Add this to your AppState interface
interface AppState {
  // ... existing state properties
  claimStatuses: Array<any>; // Replace 'any' with your actual claim type
  loadClaimsFromStorage: () => Promise<void>;
  saveClaim: (claim: any) => Promise<void>; // Replace 'any' with your actual claim type
}

// Add this to your store implementation
const useAppStore = create<AppState>((set, get) => ({
  // ... existing state
  claimStatuses: [],
  
  loadClaimsFromStorage: async () => {
    try {
      const savedClaims = await AsyncStorage.getItem('savedClaims');
      if (savedClaims) {
        set({ claimStatuses: JSON.parse(savedClaims) });
      }
    } catch (error) {
      console.error('Failed to load claims from storage', error);
    }
  },
  
  saveClaim: async (claim) => {
    try {
      const { claimStatuses } = get();
      
      // Check if claim already exists
      const existingIndex = claimStatuses.findIndex(
        c => c.referenceId === claim.referenceId
      );
      
      let updatedClaims;
      if (existingIndex >= 0) {
        updatedClaims = [...claimStatuses];
        updatedClaims[existingIndex] = claim;
      } else {
        updatedClaims = [claim, ...claimStatuses];
      }
      
      // Limit to last 10 claims
      if (updatedClaims.length > 10) {
        updatedClaims = updatedClaims.slice(0, 10);
      }
      
      await AsyncStorage.setItem('savedClaims', JSON.stringify(updatedClaims));
      set({ claimStatuses: updatedClaims });
    } catch (error) {
      console.error('Failed to save claim', error);
    }
  },
}));
```

### 4. Update the Navigation Types

Update the `RootStackParamList` in `AppNavigator.tsx` to support the new parameters:

```typescript
export type RootStackParamList = {
  Home: undefined;
  ClaimTracker: { claimId?: string };
  NyayaMitra: undefined;
  AdhikarSampark: { 
    subject?: string;
    message?: string;
  };
  MappingTool: undefined;
};
```

### 5. Update Main App to Use Enhanced Components

Update `AppNavigator.tsx` to use the enhanced screen components:

```typescript
// Import enhanced screens
import HomeScreen from '../screens/EnhancedHomeScreen';
import ClaimTrackerScreen from '../screens/EnhancedClaimTrackerScreen';
import AdhikarSamparkScreen from '../screens/EnhancedAdhikarSamparkScreen';
import NyayaMitraScreen from '../screens/NyayaMitraScreen';
import MappingToolScreen from '../screens/MappingToolScreen';
```

### 6. Testing the Enhanced Components

1. Run the app in development mode
2. Test navigation between the screens
3. Test the claim tracking functionality
4. Test voice input in search and message forms
5. Test offline functionality
6. Verify all UI elements render correctly

### 7. Troubleshooting Common Issues

1. **Translation key errors**: Ensure all new translation keys are added to all language files
2. **Component import errors**: Verify the correct path for imported components
3. **Missing styles**: Check that all style definitions are present
4. **Type errors**: Verify that type definitions match the actual data structures

## Customization Options

### Theme Customization

The enhanced components use the app's theme context. Update the theme colors in your theme file:

```typescript
// Example theme customization
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50', // Forest green as the primary color
    secondary: '#2196F3', // Blue for secondary elements
    tertiary: '#FF9800', // Orange for tertiary elements
    success: '#4CAF50', // Green for success states
    warning: '#FF9800', // Orange for warnings
    error: '#F44336', // Red for errors
    info: '#2196F3', // Blue for information
  },
};
```

### Adapting Layout for Different Screen Sizes

The components use relative sizing, but you may want to adjust styles for different screen sizes:

```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Use width and height to create responsive styles
const styles = StyleSheet.create({
  container: {
    padding: width * 0.04, // 4% of screen width
  },
  title: {
    fontSize: width * 0.05, // 5% of screen width
  },
  // Other responsive styles
});
```

## Performance Optimization

- Enable component memoization for complex lists:

```typescript
import React, { memo } from 'react';

const TimelineCardComponent = ({ status, timestamp, description }) => {
  // Component implementation
};

export const TimelineCard = memo(TimelineCardComponent);
```

- Use `FlatList` with `keyExtractor` for optimal list performance
- Implement lazy loading for images and content where appropriate