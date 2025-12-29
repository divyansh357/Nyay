import { Claim, StatusUpdate, Document, ClaimStatus } from '../../types';
import { mapClaimToClaimStatus } from '../../utils/claimUtils';

const mockDocuments: Document[] = [
  { id: '1', name: 'Aadhaar Card', url: 'https://example.com/doc1.pdf', type: 'pdf' },
  { id: '2', name: 'Ration Card', url: 'https://example.com/doc2.jpg', type: 'image' },
  { id: '3', name: 'Land Deed', url: 'https://example.com/doc3.pdf', type: 'pdf' },
];

const mockStatusHistory: StatusUpdate[] = [
  { status: 'Submitted', timestamp: new Date('2023-10-01T10:00:00Z'), description: 'Claim submitted by user.', officeName: 'Self' },
  { status: 'In Review', timestamp: new Date('2023-10-02T14:30:00Z'), description: 'Reviewed by Gram Sabha.', officeName: 'Gram Sabha' },
  { status: 'Approved', timestamp: new Date('2023-10-05T11:00:00Z'), description: 'Approved by SDLC.', officeName: 'SDLC' },
];

const mockClaims: Claim[] = [
  {
    id: 'CLAIM-001',
    claimantName: 'Budhram',
    claimType: 'Individual',
    status: 'Approved',
    submittedDate: '2023-10-01',
    area: '5 acres',
    documents: mockDocuments,
    statusHistory: mockStatusHistory,
    location: { latitude: 28.6139, longitude: 77.2090 },
    summary: 'Claim for 5 acres of forest land under FRA 2006. All documents verified and claim approved by SDLC.',
  },
  {
    id: 'CLAIM-002',
    claimantName: 'Mangli Bai',
    claimType: 'Community',
    status: 'In Review',
    submittedDate: '2023-09-15',
    area: '50 hectares',
    documents: [mockDocuments[0]],
    statusHistory: [
        { status: 'Submitted', timestamp: new Date('2023-09-15T09:00:00Z'), description: 'Claim submitted for community forest rights.', officeName: 'Self' },
        { status: 'In Review', timestamp: new Date('2023-09-20T16:00:00Z'), description: 'Pending verification from Forest Department.', officeName: 'Forest Dept.' },
    ],
    location: { latitude: 28.6200, longitude: 77.2200 },
    summary: 'Community claim for traditional forest land. Awaiting report from the Forest Department for further processing.',
  },
  {
    id: 'CLAIM-003',
    claimantName: 'Ramesh Singh',
    claimType: 'Individual',
    status: 'Rejected',
    submittedDate: '2023-08-20',
    area: '2 acres',
    documents: [],
    statusHistory: [
        { status: 'Submitted', timestamp: new Date('2023-08-20T11:00:00Z'), description: 'Claim submitted.', officeName: 'Self' },
        { status: 'Rejected', timestamp: new Date('2023-08-25T17:00:00Z'), description: 'Insufficient documentary evidence provided.', officeName: 'SDLC' },
    ],
    location: { latitude: 28.6300, longitude: 77.2300 },
    summary: 'Individual claim rejected due to lack of required documents. Claimant advised to re-apply with complete evidence.',
  },
];

export const mockClaimsApi = {
  getClaimStatus: async (claimId: string): Promise<ClaimStatus | undefined> => {
    console.log(`[Mock API] Fetching status for claim: ${claimId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const claim = mockClaims.find(c => c.id === claimId);
    if (claim) {
      return Promise.resolve(mapClaimToClaimStatus(claim));
    }
    // To match the real API behavior which throws an error on 404.
    // The UI layer will catch this and handle it.
    return Promise.reject(new Error('Claim not found'));
  },

  searchClaims: async (query: string): Promise<Claim[]> => {
    console.log(`[Mock API] Searching claims with query: ${query}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!query) {
      return Promise.resolve(mockClaims);
    }
    const lowercasedQuery = query.toLowerCase();
    const results = mockClaims.filter(
      c =>
        c.id.toLowerCase().includes(lowercasedQuery) ||
        c.claimantName.toLowerCase().includes(lowercasedQuery)
    );
    return Promise.resolve(results);
  },

  submitClaim: async (newClaim: Omit<Claim, 'id' | 'submittedDate' | 'statusHistory'>): Promise<Claim> => {
    console.log('[Mock API] Submitting new claim for:', newClaim.claimantName);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const submittedClaim: Claim = {
      id: `CLAIM-${String(mockClaims.length + 1).padStart(3, '0')}`,
      ...newClaim,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date(),
          description: 'Claim submitted via mobile app.',
          officeName: 'Self'
        },
      ],
    };
    mockClaims.push(submittedClaim);
    return Promise.resolve(submittedClaim);
  },

  getAllClaims: async (): Promise<Claim[]> => {
    console.log('[Mock API] Fetching all claims.');
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve(mockClaims);
  },

  syncClaimStatus: async (claimId: string): Promise<ClaimStatus> => {
    console.log(`[Mock API] Syncing status for claim: ${claimId}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    const claimIndex = mockClaims.findIndex(c => c.id === claimId);
    if (claimIndex !== -1) {
      // Simulate a status update
      const updatedClaim = { ...mockClaims[claimIndex] };
      const lastStatus = updatedClaim.statusHistory[updatedClaim.statusHistory.length - 1];
      
      if (lastStatus.status === 'Submitted') {
        const newStatus: StatusUpdate = {
          status: 'In Review',
          timestamp: new Date(),
          description: 'Documents are being verified by the Tehsil office.',
          officeName: 'Tehsil Office',
        };
        updatedClaim.statusHistory.push(newStatus);
        updatedClaim.status = 'In Review';
      }
      
      mockClaims[claimIndex] = updatedClaim;
      return Promise.resolve(mapClaimToClaimStatus(updatedClaim));
    }
    return Promise.reject(new Error('Claim not found for syncing'));
  },
};
