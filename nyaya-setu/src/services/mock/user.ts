
import { UserProfile, Scheme } from '../../types';

const mockSchemes: Scheme[] = [
  {
    schemeId: 'SCHEME-01',
    name: 'Pradhan Mantri Kisan Samman Nidhi',
    description: 'Income support to all landholding farmer families.',
    benefits: ['Rs. 6000 per year in 3 installments'],
    eligibilityCriteria: ['Must be a farmer with cultivable land'],
    applicationProcess: 'Apply through the PM-KISAN portal or CSC.',
  },
  {
    schemeId: 'SCHEME-02',
    name: 'National Food Security Mission',
    description: 'To increase production of rice, wheat, pulses, coarse cereals & commercial crops.',
    benefits: ['Subsidized seeds', 'Financial assistance for machinery'],
    eligibilityCriteria: ['All farmers are eligible'],
    applicationProcess: 'Contact the local agriculture office.',
  },
];

let mockUserProfile: UserProfile = {
  userId: 'USER-001',
  name: 'Samarth',
  language: 'hi',
  hasLandTitle: true,
  familySize: 5,
  hasSchoolChildren: true,
  primaryOccupation: 'Farming',
  eligibleSchemes: mockSchemes,
};

export const mockUserApi = {
  getUserProfile: async (): Promise<UserProfile> => {
    console.log('[Mock API] Fetching user profile.');
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve(mockUserProfile);
  },

  updateUserProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    console.log('[Mock API] Updating user profile with:', updates);
    await new Promise(resolve => setTimeout(resolve, 500));
    mockUserProfile = { ...mockUserProfile, ...updates };
    return Promise.resolve(mockUserProfile);
  },

  getEligibleSchemes: async (): Promise<Scheme[]> => {
    console.log('[Mock API] Fetching eligible schemes.');
    await new Promise(resolve => setTimeout(resolve, 400));
    return Promise.resolve(mockUserProfile.eligibleSchemes);
  },
};
