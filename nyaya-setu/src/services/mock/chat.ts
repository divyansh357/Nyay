import { ChatMessage } from '../../types';
import {
  NyayaMitraRequest,
  NyayaMitraResponse,
  SupportedLanguage,
} from '../../types';

// Expanded mock chat responses for better interactivity
interface MockResponse {
  keywords: string[];
  responses: {
    en: string;
    hi: string;
    or: string;
  };
}

const mockResponses: MockResponse[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'greet', 'नमस्ते', 'ନମସ୍କାର'],
    responses: {
      en: 'Hello! Welcome to NyayaSetu. How can I assist you today with forest rights or land claims?',
      hi: 'नमस्ते! न्यायसेतु में आपका स्वागत है। आज मैं आपकी वन अधिकारों या भूमि दावों के बारे में कैसे सहायता कर सकता हूँ?',
      or: 'ନମସ୍କାର! ନ୍ୟାୟସେତୁରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ମୁଁ ଆଜି ଜଙ୍ଗଲ ଅଧିକାର କିମ୍ବା ଭୂମି ଦାବି ବିଷୟରେ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
    }
  },
  {
    keywords: ['fra', 'forest rights act', 'forest', 'rights', 'act', 'law', 'वन अधिकार', 'ଜଙ୍ଗଲ ଅଧିକାର'],
    responses: {
      en: 'The Forest Rights Act (FRA), 2006, or "Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act" recognizes the rights of forest-dwelling communities. It covers two main categories of rights: Individual Forest Rights (IFR) for land being cultivated by tribals/forest dwellers, and Community Forest Rights (CFR) for common property resources for the entire community.',
      hi: 'वन अधिकार अधिनियम (FRA), 2006, या "अनुसूचित जनजाति और अन्य पारंपरिक वन निवासी (वन अधिकारों की मान्यता) अधिनियम" वन-निवासी समुदायों के अधिकारों को मान्यता देता है। इसमें अधिकारों की दो मुख्य श्रेणियां शामिल हैं: व्यक्तिगत वन अधिकार (IFR) आदिवासियों/वन निवासियों द्वारा खेती की जा रही भूमि के लिए, और सामुदायिक वन अधिकार (CFR) पूरे समुदाय के लिए सामान्य संपत्ति संसाधनों के लिए।',
      or: 'ବନ ଅଧିକାର ଅଧିନିୟମ (FRA), 2006, କିମ୍ବା "ଅନୁସୂଚିତ ଜନଜାତି ଏବଂ ଅନ୍ୟ ପାରମ୍ପରିକ ବନ ନିବାସୀ (ବନ ଅଧିକାର ସ୍ୱୀକୃତି) ଅଧିନିୟମ" ବନ-ନିବାସୀ ସମ୍ପ୍ରଦାୟର ଅଧିକାରକୁ ସ୍ୱୀକୃତି ଦିଏ। ଏଥିରେ ଦୁଇଟି ମୁଖ୍ୟ ଅଧିକାର ବର୍ଗ ଅନ୍ତର୍ଭୁକ୍ତ: ବ୍ୟକ୍ତିଗତ ବନ ଅଧିକାର (IFR) ଆଦିବାସୀ/ବନ ନିବାସୀଙ୍କ ଦ୍ୱାରା ଚାଷ କରାଯାଉଥିବା ଭୂମି ପାଇଁ, ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ସମ୍ପ୍ରଦାୟ ପାଇଁ ସାଧାରଣ ସମ୍ପତ୍ତି ସମ୍ବଳ ପାଇଁ ସାମୁଦାୟିକ ବନ ଅଧିକାର (CFR)।',
    }
  },
  {
    keywords: ['claim', 'file', 'apply', 'process', 'दावा', 'आवेदन', 'ଦାବି', 'ଆବେଦନ'],
    responses: {
      en: 'To file a claim under FRA, follow these steps:\n\n1. Submit application to your Gram Sabha\n2. Gram Sabha verifies and recommends to Sub-Divisional Level Committee (SDLC)\n3. SDLC examines and forwards to District Level Committee (DLC)\n4. DLC makes the final decision\n\nYou need to provide proof of residence, dependence on forest, and a map of the claimed area. You can track your claim status using our Claim Tracker feature.',
      hi: 'FRA के तहत दावा दायर करने के लिए, इन चरणों का पालन करें:\n\n1. अपने ग्राम सभा को आवेदन जमा करें\n2. ग्राम सभा सत्यापित करती है और उप-मंडलीय स्तरीय समिति (SDLC) को अनुशंसा करती है\n3. SDLC जांच करता है और जिला स्तरीय समिति (DLC) को अग्रेषित करता है\n4. DLC अंतिम निर्णय लेता है\n\nआपको निवास का प्रमाण, वन पर निर्भरता, और दावा किए गए क्षेत्र का नक्शा प्रदान करना होगा। आप हमारे क्लेम ट्रैकर फ़ीचर का उपयोग करके अपने दावे की स्थिति को ट्रैक कर सकते हैं।',
      or: 'FRA ଅଧୀନରେ ଦାବି ଦାଖଲ କରିବାକୁ, ଏହି ପଦକ୍ଷେପଗୁଡ଼ିକ ଅନୁସରଣ କରନ୍ତୁ:\n\n1. ଆପଣଙ୍କ ଗ୍ରାମ ସଭାକୁ ଆବେଦନ ଜମା କରନ୍ତୁ\n2. ଗ୍ରାମ ସଭା ଯାଞ୍ଚ କରେ ଏବଂ ଉପ-ବିଭାଗୀୟ ସ୍ତର କମିଟି (SDLC)କୁ ସୁପାରିଶ କରେ\n3. SDLC ପରୀକ୍ଷା କରେ ଏବଂ ଜିଲ୍ଲା ସ୍ତର କମିଟି (DLC)କୁ ଅଗ୍ରଗାମୀ କରେ\n4. DLC ଅନ୍ତିମ ନିଷ୍ପତ୍ତି ନିଏ\n\nଆପଣଙ୍କୁ ବାସସ୍ଥାନର ପ୍ରମାଣ, ଜଙ୍ଗଲ ଉପରେ ନିର୍ଭରଶୀଳତା, ଏବଂ ଦାବି କ୍ଷେତ୍ରର ଏକ ମାନଚିତ୍ର ପ୍ରଦାନ କରିବାକୁ ପଡିବ। ଆପଣ ଆମର କ୍ଲେମ୍ ଟ୍ରାକର୍ ବୈଶିଷ୍ଟ୍ୟ ବ୍ୟବହାର କରି ଆପଣଙ୍କ ଦାବି ସ୍ଥିତି ଟ୍ରାକ୍ କରିପାରିବେ।',
    }
  },
  {
    keywords: ['document', 'papers', 'proof', 'requirement', 'कागज', 'दस्तावेज़', 'प्रमाण', 'କାଗଜପତ୍ର', 'ପ୍ରମାଣ'],
    responses: {
      en: 'Documents required for an FRA claim include:\n\n• For Individual Rights:\n - Proof of residence for 75 years\n - Evidence of dependence on forest land\n - Caste certificate (for ST claims)\n - Map of the claimed land\n - Gram Sabha verification\n\n• For Community Rights:\n - Community resolution\n - Evidence of traditional use\n - Map of community forest resources\n - Written statement of elders',
      hi: 'FRA दावे के लिए आवश्यक दस्तावेज़ों में शामिल हैं:\n\n• व्यक्तिगत अधिकारों के लिए:\n - 75 वर्षों के निवास का प्रमाण\n - वन भूमि पर निर्भरता का प्रमाण\n - जाति प्रमाणपत्र (ST दावों के लिए)\n - दावा की गई भूमि का नक्शा\n - ग्राम सभा का सत्यापन\n\n• सामुदायिक अधिकारों के लिए:\n - सामुदायिक प्रस्ताव\n - पारंपरिक उपयोग का प्रमाण\n - सामुदायिक वन संसाधनों का नक्शा\n - बुजुर्गों का लिखित बयान',
      or: 'FRA ଦାବି ପାଇଁ ଆବଶ୍ୟକ ଦସ୍ତାବିଜ ଅନ୍ତର୍ଭୁକ୍ତ:\n\n• ବ୍ୟକ୍ତିଗତ ଅଧିକାର ପାଇଁ:\n - 75 ବର୍ଷ ବାସସ୍ଥାନର ପ୍ରମାଣ\n - ଜଙ୍ଗଲ ଜମି ଉପରେ ନିର୍ଭରଶୀଳତାର ପ୍ରମାଣ\n - ଜାତି ପ୍ରମାଣପତ୍ର (ST ଦାବି ପାଇଁ)\n - ଦାବି କରାଯାଇଥିବା ଜମିର ମାନଚିତ୍ର\n - ଗ୍ରାମ ସଭା ଯାଞ୍ଚ\n\n• ସାମୁଦାୟିକ ଅଧିକାର ପାଇଁ:\n - ସମ୍ପ୍ରଦାୟ ପ୍ରସ୍ତାବ\n - ପାରମ୍ପରିକ ବ୍ୟବହାରର ପ୍ରମାଣ\n - ସମ୍ପ୍ରଦାୟ ଜଙ୍ଗଲ ସମ୍ବଳର ମାନଚିତ୍ର\n - ବୟସ୍କମାନଙ୍କର ଲିଖିତ ବକ୍ତବ୍ୟ',
    }
  },
  {
    keywords: ['status', 'track', 'progress', 'update', 'स्थिति', 'ट्रैक', 'प्रगति', 'अपडेट', 'ସ୍ଥିତି', 'ଅପଡେଟ୍'],
    responses: {
      en: 'You can track your claim status in our app\'s Claim Tracker section. Enter your claim reference number to see the current stage of processing. The typical stages are:\n\n1. Gram Sabha verification (2-4 weeks)\n2. SDLC review (4-8 weeks)\n3. DLC decision (8-12 weeks)\n4. Final approval/rejection\n\nIf your claim has been pending at any stage for longer than the expected timeframe, you can use the "Adhikar Sampark" section to connect with officials.',
      hi: 'आप हमारे ऐप के क्लेम ट्रैकर सेक्शन में अपने दावे की स्थिति को ट्रैक कर सकते हैं। प्रोसेसिंग के वर्तमान चरण को देखने के लिए अपना दावा संदर्भ नंबर दर्ज करें। विशिष्ट चरण हैं:\n\n1. ग्राम सभा सत्यापन (2-4 सप्ताह)\n2. SDLC समीक्षा (4-8 सप्ताह)\n3. DLC निर्णय (8-12 सप्ताह)\n4. अंतिम स्वीकृति/अस्वीकृति\n\nयदि आपका दावा किसी भी चरण में अपेक्षित समयावधि से अधिक समय तक लंबित है, तो आप अधिकारियों से संपर्क करने के लिए "अधिकार संपर्क" अनुभाग का उपयोग कर सकते हैं।',
      or: 'ଆପଣ ଆମ ଆପର କ୍ଲେମ ଟ୍ରାକର ବିଭାଗରେ ଆପଣଙ୍କ ଦାବି ସ୍ଥିତି ଟ୍ରାକ କରିପାରିବେ। ପ୍ରକ୍ରିୟାକରଣର ବର୍ତ୍ତମାନ ପର୍ଯ୍ୟାୟ ଦେଖିବାକୁ ଆପଣଙ୍କର ଦାବି ସନ୍ଦର୍ଭ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ। ସାଧାରଣ ପର୍ଯ୍ୟାୟଗୁଡିକ ହେଉଛି:\n\n1. ଗ୍ରାମ ସଭା ଯାଞ୍ଚ (2-4 ସପ୍ତାହ)\n2. SDLC ସମୀକ୍ଷା (4-8 ସପ୍ତାହ)\n3. DLC ନିଷ୍ପତ୍ତି (8-12 ସପ୍ତାହ)\n4. ଅନ୍ତିମ ଅନୁମୋଦନ/ପ୍ରତ୍ୟାଖ୍ୟାନ\n\nଯଦି ଆପଣଙ୍କର ଦାବି କୌଣସି ପର୍ଯ୍ୟାୟରେ ଅପେକ୍ଷିତ ସମୟସୀମାଠାରୁ ଅଧିକ ସମୟ ଧରି ଅପେକ୍ଷାରେ ରହିଛି, ଆପଣ ଅଧିକାରୀଙ୍କ ସହ ସଂଯୁକ୍ତ ହେବା ପାଇଁ "ଅଧିକାର ସମ୍ପର୍କ" ବିଭାଗ ବ୍ୟବହାର କରିପାରିବେ।',
    }
  },
  {
    keywords: ['rights', 'benefit', 'entitlement', 'अधिकार', 'लाभ', 'हक़', 'ଅଧିକାର', 'ହକ୍'],
    responses: {
      en: 'The Forest Rights Act grants the following rights:\n\n• Title rights - ownership of land being cultivated (up to 4 hectares)\n• Use rights - for minor forest produce, grazing areas, pastoralist routes\n• Relief and development rights - for rehabilitation in case of illegal eviction\n• Forest management rights - to protect forests and wildlife\n\nThese rights aim to correct historical injustices and recognize forest-dwelling communities as integral to forest conservation.',
      hi: 'वन अधिकार अधिनियम निम्नलिखित अधिकार प्रदान करता है:\n\n• शीर्षक अधिकार - खेती की जा रही भूमि का स्वामित्व (4 हेक्टेयर तक)\n• उपयोग अधिकार - लघु वन उपज, चराई क्षेत्रों, पशुपालक मार्गों के लिए\n• राहत और विकास अधिकार - अवैध बेदखली के मामले में पुनर्वास के लिए\n• वन प्रबंधन अधिकार - वनों और वन्य जीवन की रक्षा के लिए\n\nये अधिकार ऐतिहासिक अन्याय को सही करने और वन-निवासी समुदायों को वन संरक्षण के लिए अभिन्न मानने के लिए हैं।',
      or: 'ବନ ଅଧିକାର ଅଧିନିୟମ ନିମ୍ନଲିଖିତ ଅଧିକାର ପ୍ରଦାନ କରେ:\n\n• ଶୀର୍ଷକ ଅଧିକାର - ଚାଷ କରାଯାଉଥିବା ଜମିର ମାଲିକାନା (4 ହେକ୍ଟର ପର୍ଯ୍ୟନ୍ତ)\n• ବ୍ୟବହାର ଅଧିକାର - ଛୋଟ ଜଙ୍ଗଲ ଉତ୍ପାଦ, ଚାରଣ କ୍ଷେତ୍ର, ପଶୁପାଳକ ମାର୍ଗ ପାଇଁ\n• ସ୍ୱସ୍ତି ଏବଂ ବିକାଶ ଅଧିକାର - ଅବୈଧ ଉଚ୍ଛେଦ କ୍ଷେତ୍ରରେ ପୁନର୍ବାସ ପାଇଁ\n• ବନ ପରିଚାଳନା ଅଧିକାର - ଜଙ୍ଗଲ ଏବଂ ବନ୍ୟଜୀବନ ସୁରକ୍ଷା କରିବା ପାଇଁ\n\nଏହି ଅଧିକାରଗୁଡ଼ିକ ଐତିହାସିକ ଅନ୍ୟାୟକୁ ସଂଶୋଧନ କରିବା ଏବଂ ବନ-ନିବାସୀ ସମ୍ପ୍ରଦାୟକୁ ବନ ସଂରକ୍ଷଣ ପାଇଁ ଅବିଚ୍ଛେଦ୍ୟ ଭାବରେ ସ୍ୱୀକୃତି ଦେବାକୁ ଲକ୍ଷ୍ୟ ରଖନ୍ତି।',
    }
  }
];

const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    message: 'What are the documents required for a community claim?',
    response: 'For a community claim, you need a community resolution, a map of the claimed area, and evidence of traditional use. You\'ll also need written statements from community elders and verification from the Gram Sabha.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    language: 'en',
  },
  {
    id: '2',
    message: 'How long does the approval process take?',
    response: 'The approval process typically takes 4-6 months in total. Gram Sabha verification takes about 2-4 weeks, SDLC review takes 4-8 weeks, and DLC decision takes 8-12 weeks. Complex cases may take longer.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    language: 'en',
  },
  {
    id: '3',
    message: 'What is Forest Rights Act?',
    response: 'The Forest Rights Act (FRA), 2006 recognizes the rights of forest-dwelling tribal communities and other traditional forest dwellers who have been residing in forests for generations.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    language: 'en',
  },
];

export const mockChatApi = {
  getChatHistory: async (): Promise<ChatMessage[]> => {
    console.log('[Mock API] Fetching chat history.');
    await new Promise(resolve => setTimeout(resolve, 200));
    return Promise.resolve(mockChatHistory);
  },

  async sendMessage(request: NyayaMitraRequest): Promise<NyayaMitraResponse> {
    console.log('Mock API: sendMessage called with:', request);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const question = request.question.toLowerCase();
    const { language } = request;
    
    // Default response if no matching keywords found
    let responseText = {
      en: "I'm sorry, I don't have specific information about that topic. Could you try asking about the Forest Rights Act, claim filing process, or required documents?",
      hi: "मुझे इस विषय के बारे में विशेष जानकारी नहीं है। क्या आप वन अधिकार अधिनियम, दावा दाखिल करने की प्रक्रिया, या आवश्यक दस्तावेजों के बारे में पूछ सकते हैं?",
      or: "ମୁଁ କ୍ଷମାପ୍ରାର୍ଥୀ, ମୋ ପାଖରେ ସେହି ବିଷୟ ବିଷୟରେ ନିର୍ଦ୍ଦିଷ୍ଟ ସୂଚନା ନାହିଁ। ଆପଣ ବନ ଅଧିକାର ଅଧିନିୟମ, ଦାବି ଫାଇଲ୍ ପ୍ରକ୍ରିୟା, କିମ୍ବା ଆବଶ୍ୟକ ଦସ୍ତାବିଜ ବିଷୟରେ ପଚାରିବାକୁ ଚେଷ୍ଟା କରିପାରିବେ କି?",
    }[language] || "I'm sorry, I don't have information about that right now.";

    // Check each response pattern for matching keywords
    for (const pattern of mockResponses) {
      if (pattern.keywords.some(keyword => question.includes(keyword))) {
        responseText = pattern.responses[language] || pattern.responses.en;
        break;
      }
    }

    return {
      response: responseText,
      conversationId: `mock-conv-${Date.now()}`,
      // Always set isAiAvailable to true to prevent the offline mode message
      isAiAvailable: true,
    };
  },

  async getQuickQuestions(language: SupportedLanguage): Promise<string[]> {
    console.log(`Mock API: getQuickQuestions for ${language}`);
    const questions: Record<SupportedLanguage, string[]> = {
      en: [
        'What is the Forest Rights Act?',
        'How do I file a claim?',
        'What documents are needed?',
      ],
      hi: [
        'वन अधिकार अधिनियम क्या है?',
        'मैं दावा कैसे दायर करूं?',
        'कौन से दस्तावेज़ों की आवश्यकता है?',
      ],
      or: [
        'ବନ ଅଧିକାର ଅଧିନିୟମ କ’ଣ?',
        'ମୁଁ କିପରି ଏକ ଦାବି ଦାଖଲ କରିବି?',
        'କେଉଁ ଦଲିଲଗୁଡ଼ିକ ଆବଶ୍ୟକ?',
      ],
    };
    return questions[language] || questions.en;
  },
};
