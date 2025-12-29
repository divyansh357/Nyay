// Simple test function to verify database functionality
import { databaseService } from '../services/database';
import { ClaimStatus, UserProfile } from '../types';

export async function testDatabaseService(): Promise<boolean> {
  try {
    console.log('🧪 Testing Database Service...');
    
    // Test claim storage
    const testClaim: ClaimStatus = {
      referenceId: 'TEST001',
      currentStatus: 'Under Review',
      statusHistory: [
        {
          status: 'Submitted',
          description: 'Application submitted',
          timestamp: new Date(),
          officeName: 'Test Office'
        }
      ],
      lastSyncTime: new Date(),
      isOfflineData: true
    };
    
    await databaseService.saveClaim(testClaim);
    console.log('✅ Claim saved');
    
    const retrievedClaim = await databaseService.getClaim('TEST001');
    if (retrievedClaim && retrievedClaim.referenceId === 'TEST001') {
      console.log('✅ Claim retrieved successfully');
    } else {
      throw new Error('Failed to retrieve claim');
    }
    
    // Test user profile storage
    const testProfile: UserProfile = {
      userId: 'test-user-123',
      language: 'hi',
      hasLandTitle: true,
      familySize: 4,
      hasSchoolChildren: true,
      primaryOccupation: 'Farming',
      eligibleSchemes: []
    };
    
    await databaseService.saveUserProfile(testProfile);
    console.log('✅ User profile saved');
    
    const retrievedProfile = await databaseService.getUserProfile('test-user-123');
    if (retrievedProfile && retrievedProfile.userId === 'test-user-123') {
      console.log('✅ User profile retrieved successfully');
    } else {
      throw new Error('Failed to retrieve user profile');
    }
    
    // Test storage info
    const storageInfo = await databaseService.getStorageInfo();
    console.log('📊 Storage info:', storageInfo);
    
    console.log('🎉 All database tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}