import { Claim, ClaimStatus } from '../types';

/**
 * A utility function to map a Claim object to a ClaimStatus object.
 * This is useful for maintaining consistency in the app's state.
 * @param claim The Claim object to map.
 * @returns A ClaimStatus object.
 */
export const mapClaimToClaimStatus = (claim: Claim): ClaimStatus => {
  return {
    referenceId: claim.id,
    currentStatus: claim.status,
    statusHistory: claim.statusHistory,
    lastSyncTime: new Date(claim.submittedDate),
    isOfflineData: false, // Assuming this is from an online source
  };
};
