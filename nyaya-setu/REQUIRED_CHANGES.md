# Required Code Changes for NyayaSetu UI Enhancement

This file contains the necessary code changes required to make the enhanced UI components work correctly.

## 1. VoiceButton Import Fix

The `VoiceButton` component needs to be imported correctly in files that use it:

```typescript
// Instead of
import { VoiceButton } from '../components/VoiceButton';

// Use
import VoiceButton from '../components/VoiceButton';
```

## 2. Add Translation Keys to Language Context

Add these translation keys to your translation files:

```typescript
// Add to src/contexts/LanguageContext.tsx or your translation file

const translations = {
  en: {
    // Common
    offline_mode_active: "You are currently in offline mode. Some features may be limited.",
    dismiss: "Dismiss",
    claim_saved_offline: "Claim has been saved for offline access",
    tap_to_speak: "Tap to speak",
    no_results_found: "No results found",
    try_different_id: "Please try a different claim ID or check your internet connection",
    
    // Claim Tracker
    claim_id_required: "Please enter a claim ID",
    claim_not_found: "No claim found with this ID",
    offline_search_error: "You're offline. Only saved claims can be accessed",
    search_error: "Error searching for claim",
    offline_title: "You're offline",
    offline_refresh_message: "Cannot refresh claim details while offline",
    refresh_error: "Failed to refresh claim details",
    feature_coming_soon: "Coming Soon",
    document_upload_soon: "Document upload feature will be available in the next update",
    sharing_soon: "Sharing feature will be available in the next update",
    claim_options: "Claim Options",
    save_offline: "Save for offline use",
    report_issue: "Report an issue",
    share: "Share",
    cancel: "Cancel",
    search_claim: "Search for a Claim",
    enter_claim_id: "Enter your claim reference ID",
    search: "Search",
    clear: "Clear",
    recent_claims: "Recent Claims",
    claim_details: "Claim Details",
    claim_id: "Claim ID",
    application_date: "Application Date",
    claim_type: "Claim Type",
    individual_claim: "Individual",
    current_office: "Current Office",
    last_updated: "Last Updated",
    area_details: "Area Details",
    additional_info: "Additional Information",
    status_timeline: "Status Timeline",
    no_status_updates: "No status updates available",
    required_documents: "Required Documents",
    upload_documents: "Upload Documents",
    next_steps: "Next Steps",
    ask_nyaya_mitra: "Ask NyayaMitra",
    how_to_track: "How to Track Your Claim",
    track_step_1: "Enter your claim reference ID in the search box above",
    track_step_2: "View claim status, timeline, and required documents",
    track_step_3: "Contact support if you need assistance or have questions",
    view_details: "View Details",
    
    // Home Screen
    welcome: "Welcome",
    guest: "Guest",
    home_subtitle: "Forest rights at your fingertips",
    quick_actions: "Quick Actions",
    track_claim: "Track Claim",
    mapping_tool: "Mapping Tool",
    nyaya_mitra: "Nyaya Mitra",
    contact_support: "Contact Support",
    your_claims: "Your Claims",
    view_all: "View All",
    schemes: "Government Schemes",
    learn_more: "Learn More",
    apply: "Apply",
    news_updates: "News & Updates",
    resources: "Resources",
    need_help: "Need Help?",
    support_description: "Get in touch with our support team for assistance with your claims or application process",
    
    // Adhikar Sampark Screen
    adhikar_sampark: "Adhikar Sampark",
    contact_support_title: "Connect with Support",
    contact_support_description: "Get assistance from legal experts, government officials, NGOs, or community resources for help with your forest rights claims.",
    contact_categories: "Contact Categories",
    legal_aid: "Legal Aid",
    government: "Government",
    ngos: "NGOs",
    community: "Community",
    no_contacts_found: "No contacts found",
    try_different_filter: "Try a different filter or category",
    contact_form_title: "Send a Message",
    your_name: "Your Name",
    your_phone: "Phone Number",
    subject: "Subject",
    message: "Message",
    submit: "Submit",
    faqs: "Frequently Asked Questions",
    faq_1_title: "What documents are required for a forest rights claim?",
    faq_1_answer: "For individual forest rights claims, you'll need proof of identity, proof of residence, and evidence of occupation (photographs, statements from elders, government records, etc.). For community rights, you'll need details of community use patterns and Gram Sabha resolution.",
    faq_2_title: "How long does the claim process take?",
    faq_2_answer: "The process typically takes 3-6 months from submission to final decision, depending on verification complexity and case backlog. The verification stage takes about 1 month, field survey 2-3 weeks, and committee review 1-2 months.",
    faq_3_title: "What if my claim is rejected?",
    faq_3_answer: "If your claim is rejected, you have 60 days to file an appeal with the Sub-Divisional Level Committee (SDLC). Contact legal aid services through this app for assistance with the appeal process.",
    filter_by_language: "Filter by Language",
    all_languages: "All Languages",
    local_dialect: "Local Dialect",
    apply: "Apply",
    call: "Call",
    email: "Email",
    close: "Close",
    role: "Role",
    organization: "Organization",
    phone: "Phone",
    address: "Address",
    availability: "Availability",
    languages: "Languages",
    estimated_time: "Estimated Time",
    days: "days"
  },
  // Add the same keys to other language translations
  hi: {
    // Hindi translations
    // ...
  }
};
```

## 3. Update AppStore to Add saveClaim Function

Add the following to your app store:

```typescript
// In src/store/index.ts

// Add to your imports
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add to your state
interface AppState {
  // Existing properties
  claimStatuses: any[];
  loadClaimsFromStorage: () => Promise<void>;
  saveClaim: (claim: any) => Promise<void>;
  // Other properties
}

// Implementation
const useAppStore = create<AppState>((set, get) => ({
  // Existing state
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
  
  // Other state and functions
}));
```

## 4. Update RootStackParamList in AppNavigator.tsx

Update the navigation types to support new parameters:

```typescript
// In src/navigation/AppNavigator.tsx

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

## 5. Update AppNavigator.tsx to Use Enhanced Components

```typescript
// In src/navigation/AppNavigator.tsx

// Replace these imports
import HomeScreen from '../screens/HomeScreen';
import ClaimTrackerScreen from '../screens/ClaimTrackerScreen';
import AdhikarSamparkScreen from '../screens/AdhikarSamparkScreen';

// With these imports
import HomeScreen from '../screens/EnhancedHomeScreen';
import ClaimTrackerScreen from '../screens/EnhancedClaimTrackerScreen';
import AdhikarSamparkScreen from '../screens/EnhancedAdhikarSamparkScreen';
```

## 6. Update StatusUpdate Type

Add this type definition if it doesn't exist:

```typescript
// In src/types/index.ts

export interface StatusUpdate {
  id?: string;
  status: string;
  timestamp: string;
  description?: string;
  officeName?: string;
}
```

## 7. Install Required Dependencies

Make sure these dependencies are installed:

```bash
npm install @react-native-async-storage/async-storage react-native-maps @expo/vector-icons
```

## 8. Ensure Correct Version of react-native-paper

The enhanced components use features from react-native-paper v5+. Make sure you have the correct version:

```bash
npm install react-native-paper@^5.0.0
```