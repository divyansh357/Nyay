// Mock data for mobile app development
import { ClaimStatus, Scheme } from '../types';

export const mockClaims: ClaimStatus[] = [
  {
    referenceId: 'FRA2024001',
    currentStatus: 'Approved',
    statusHistory: [
      {
        status: 'Application Submitted',
        description: 'आवेदन ग्राम सभा में जमा',
        timestamp: new Date('2024-01-15'),
        officeName: 'Gram Sabha Keshkal'
      },
      {
        status: 'Approved',
        description: 'भूमि अधिकार स्वीकृत',
        timestamp: new Date('2024-02-20'),
        officeName: 'District Committee'
      }
    ],
    lastSyncTime: new Date(),
    isOfflineData: false
  },
  {
    referenceId: 'FRA2024002',
    currentStatus: 'In Progress',
    statusHistory: [
      {
        status: 'Application Submitted',
        description: 'आवेदन ग्राम सभा में जमा',
        timestamp: new Date('2024-02-10'),
        officeName: 'Gram Sabha Bakawand'
      },
      {
        status: 'Under Verification',
        description: 'स्थल सत्यापन प्रक्रिया',
        timestamp: new Date('2024-03-05'),
        officeName: 'Forest Range Officer'
      }
    ],
    lastSyncTime: new Date(),
    isOfflineData: false
  },
  {
    referenceId: 'FRA2024003',
    currentStatus: 'Rejected',
    statusHistory: [
      {
        status: 'Application Submitted',
        description: 'आवेदन ग्राम सभा में जमा',
        timestamp: new Date('2024-01-05'),
        officeName: 'Gram Sabha Bhanpuri'
      },
      {
        status: 'Under Verification',
        description: 'स्थल सत्यापन प्रक्रिया',
        timestamp: new Date('2024-01-25'),
        officeName: 'Forest Range Officer'
      },
      {
        status: 'Rejected',
        description: 'आवश्यक दस्तावेज़ अपूर्ण',
        timestamp: new Date('2024-02-15'),
        officeName: 'Sub-Divisional Committee'
      }
    ],
    lastSyncTime: new Date(),
    isOfflineData: false
  },
  {
    referenceId: 'FRA2024004',
    currentStatus: 'In Review',
    statusHistory: [
      {
        status: 'Application Submitted',
        description: 'आवेदन ग्राम सभा में जमा',
        timestamp: new Date('2024-03-01'),
        officeName: 'Gram Sabha Darbha'
      },
      {
        status: 'In Review',
        description: 'जिला समिति द्वारा समीक्षा',
        timestamp: new Date('2024-03-20'),
        officeName: 'District Committee'
      }
    ],
    lastSyncTime: new Date(),
    isOfflineData: true
  },
  {
    referenceId: 'FRA2024005',
    currentStatus: 'Pending Documentation',
    statusHistory: [
      {
        status: 'Application Submitted',
        description: 'आवेदन ग्राम सभा में जमा',
        timestamp: new Date('2024-02-20'),
        officeName: 'Gram Sabha Lohandiguda'
      },
      {
        status: 'Pending Documentation',
        description: 'अतिरिक्त दस्तावेज़ आवश्यक',
        timestamp: new Date('2024-03-10'),
        officeName: 'Sub-Divisional Committee'
      }
    ],
    lastSyncTime: new Date(),
    isOfflineData: true
  }
];

export const mockSchemes: Scheme[] = [
  {
    schemeId: 'PMAY-G',
    name: 'प्रधानमंत्री आवास योजना - ग्रामीण',
    description: 'Rural housing scheme',
    benefits: ['₹1.2 लाख सहायता', 'पक्का मकान'],
    eligibilityCriteria: ['BPL परिवार', 'भूमि का हक'],
    applicationProcess: 'ग्राम पंचायत में आवेदन करें'
  },
  {
    schemeId: 'MGNREGA',
    name: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम',
    description: 'Employment guarantee scheme for rural areas',
    benefits: ['100 दिन का रोजगार गारंटी', 'न्यूनतम मजदूरी'],
    eligibilityCriteria: ['ग्रामीण परिवार', 'जॉब कार्ड धारक'],
    applicationProcess: 'ग्राम पंचायत में जॉब कार्ड के लिए आवेदन करें'
  },
  {
    schemeId: 'PMMVY',
    name: 'प्रधानमंत्री मातृ वंदना योजना',
    description: 'Maternity benefit scheme',
    benefits: ['₹5,000 गर्भवती महिलाओं को सहायता', 'स्वास्थ्य जांच'],
    eligibilityCriteria: ['पहले बच्चे के लिए', 'आधार कार्ड आवश्यक'],
    applicationProcess: 'आंगनवाड़ी केंद्र में आवेदन करें'
  },
  {
    schemeId: 'PMJDY',
    name: 'प्रधानमंत्री जन धन योजना',
    description: 'Financial inclusion scheme',
    benefits: ['जीरो बैलेंस बैंक खाता', '₹1 लाख दुर्घटना बीमा', 'रुपे कार्ड'],
    eligibilityCriteria: ['कोई भी भारतीय नागरिक', 'एक परिवार में एक खाता'],
    applicationProcess: 'नजदीकी बैंक शाखा में आवेदन करें'
  },
  {
    schemeId: 'PMUY',
    name: 'प्रधानमंत्री उज्ज्वला योजना',
    description: 'LPG connection for women from BPL households',
    benefits: ['मुफ्त LPG कनेक्शन', 'स्वच्छ ईंधन', 'स्वास्थ्य लाभ'],
    eligibilityCriteria: ['BPL परिवार', 'महिला आवेदक'],
    applicationProcess: 'नजदीकी LPG वितरक या CSC केंद्र पर आवेदन करें'
  },
  {
    schemeId: 'PMFBY',
    name: 'प्रधानमंत्री फसल बीमा योजना',
    description: 'Crop insurance scheme for farmers',
    benefits: ['फसल क्षति का बीमा', 'कम प्रीमियम दर'],
    eligibilityCriteria: ['सभी किसान', 'ऋण लेने वाले किसानों के लिए अनिवार्य'],
    applicationProcess: 'बैंक या CSC केंद्र पर आवेदन करें'
  },
  {
    schemeId: 'FRA',
    name: 'वन अधिकार अधिनियम',
    description: 'Forest Rights Act for tribal communities',
    benefits: ['वन भूमि पर अधिकार', 'गैर-इमारती वन उपज का अधिकार', 'सामुदायिक वन अधिकार'],
    eligibilityCriteria: ['वनवासी अनुसूचित जनजाति', '3 पीढ़ियों से वन भूमि पर निवास'],
    applicationProcess: 'ग्राम सभा में आवेदन जमा करें'
  }
];