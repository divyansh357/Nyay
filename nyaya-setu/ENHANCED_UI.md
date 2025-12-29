# NyayaSetu App - Enhanced UI Components

This repository contains enhanced UI components for the NyayaSetu mobile application, which provides legal assistance for forest rights claims. 

## Enhanced Components

The following enhanced components have been created to improve the user experience:

1. **EnhancedTimelineCard**
   - Improved visualization of claim status timelines
   - Added collapsible sections for details
   - Included visual indicators based on status type
   - Estimated time information for each status stage

2. **EnhancedClaimTrackerScreen**
   - Comprehensive claim status tracking interface
   - Progress visualization with completion percentage
   - Required documents section based on current status
   - Next steps recommendations
   - Quick actions with FAB menu
   - Voice search capability
   - Recent claims history

3. **EnhancedHomeScreen**
   - Modern dashboard layout with quick actions
   - Recent claims summary cards
   - Government scheme information
   - News and updates section
   - Resource directory
   - Animated transitions

4. **EnhancedAdhikarSamparkScreen**
   - Categorized contact directory (legal, government, NGO, community)
   - Detailed contact information cards
   - Direct contact form with voice input
   - Language filtering for contacts
   - FAQs section

## Key Features Added

1. **Improved Visualization**
   - Status-specific color coding
   - Progress indicators
   - Visual cues for different claim stages

2. **Enhanced Interactions**
   - Voice input for search and messaging
   - Expandable/collapsible sections
   - Floating action buttons for quick access

3. **Better Information Architecture**
   - Contextual information based on claim status
   - Next steps recommendations
   - Required document lists tailored to current stage
   - Estimated time frames for different processes

4. **Offline Capabilities**
   - Save claims for offline access
   - Offline mode indicators
   - Cached recent claims

## Implementation Notes

- These enhanced components maintain compatibility with the existing app structure
- TypeScript types are preserved for type safety
- Components use the existing theming system
- Translations are handled through the existing language context

## Usage

To use these enhanced components in the main app:

1. Replace the original component imports with the enhanced versions:

```typescript
// Replace
import TimelineCard from '../components/TimelineCard';
// With
import TimelineCard from '../components/EnhancedTimelineCard';

// Replace screen components similarly
```

2. Update the AppNavigator.tsx to use the enhanced screen components:

```typescript
// Import enhanced screens
import HomeScreen from '../screens/EnhancedHomeScreen';
import ClaimTrackerScreen from '../screens/EnhancedClaimTrackerScreen';
import AdhikarSamparkScreen from '../screens/EnhancedAdhikarSamparkScreen';
```

## Future Improvements

- Add map integration for nearby support centers
- Implement real-time notifications for claim status updates
- Add document upload functionality
- Include offline data synchronization when connection is restored