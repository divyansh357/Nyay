import { SupportedLanguage } from '../types';

// Translation dictionaries for common UI elements
const translations = {
  // App name
  app_name: {
    hi: 'न्यायसेतु',
    en: 'NyayaSetu',
    or: 'ନ୍ୟାୟସେତୁ',
  },
  
  // Authentication Screen
  auth_welcome: {
    hi: 'स्वागत है',
    en: 'Welcome',
    or: 'ସ୍ୱାଗତମ',
  },
  auth_subtitle: {
    hi: 'न्यायसेतु एप्लिकेशन में आपका स्वागत है।',
    en: 'Welcome to the NyayaSetu application.',
    or: 'ନ୍ୟାୟସେତୁ ଆପ୍ଲିକେସନରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।',
  },
  auth_verify_otp: {
    hi: 'OTP सत्यापित करें',
    en: 'Verify OTP',
    or: 'ଓଟିପି ଯାଞ୍ଚ କରନ୍ତୁ',
  },
  auth_select_language: {
    hi: 'अपनी भाषा चुनें',
    en: 'Select your language',
    or: 'ଆପଣଙ୍କର ଭାଷା ବାଛନ୍ତୁ',
  },
  auth_name: {
    hi: 'आपका नाम',
    en: 'Your Name',
    or: 'ଆପଣଙ୍କର ନାମ',
  },
  auth_phone: {
    hi: 'मोबाइल नंबर',
    en: 'Mobile Number',
    or: 'ମୋବାଇଲ ନମ୍ବର',
  },
  auth_get_otp: {
    hi: 'OTP प्राप्त करें',
    en: 'Get OTP',
    or: 'ଓଟିପି ପାଆନ୍ତୁ',
  },
  auth_enter_otp: {
    hi: 'OTP दर्ज करें',
    en: 'Enter OTP',
    or: 'ଓଟିପି ପ୍ରବେଶ କରନ୍ତୁ',
  },
  auth_otp_sent: {
    hi: 'OTP भेज दिया गया है',
    en: 'OTP has been sent',
    or: 'ଓଟିପି ପଠାଯାଇଛି',
  },
  auth_otp_sent_to: {
    hi: 'OTP इस नंबर पर भेजा गया है',
    en: 'OTP has been sent to',
    or: 'ଓଟିପି ପଠାଯାଇଛି',
  },
  auth_verify: {
    hi: 'सत्यापित करें',
    en: 'Verify',
    or: 'ଯାଞ୍ଚ କରନ୍ତୁ',
  },
  auth_change_number: {
    hi: 'नंबर बदलें',
    en: 'Change Number',
    or: 'ନମ୍ବର ପରିବର୍ତ୍ତନ କରନ୍ତୁ',
  },
  auth_resend_otp: {
    hi: 'OTP पुनः भेजें',
    en: 'Resend OTP',
    or: 'ଓଟିପି ପୁଣି ପଠାନ୍ତୁ',
  },
  auth_invalid_phone: {
    hi: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें',
    en: 'Please enter a valid 10-digit mobile number',
    or: 'ଦୟାକରି ଏକ ବୈଧ 10-ଅଙ୍କର ମୋବାଇଲ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ',
  },
  auth_enter_name: {
    hi: 'कृपया अपना नाम दर्ज करें',
    en: 'Please enter your name',
    or: 'ଦୟାକରି ଆପଣଙ୍କର ନାମ ପ୍ରବେଶ କରନ୍ତୁ',
  },
  auth_invalid_otp: {
    hi: 'अमान्य OTP, कृपया पुनः प्रयास करें',
    en: 'Invalid OTP, please try again',
    or: 'ଅବୈଧ ଓଟିପି, ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ',
  },
  
  // Common UI elements
  home: {
    hi: 'होम',
    en: 'Home',
    or: 'ଘର',
  },
  claimTracker: {
    hi: 'दावा ट्रैकर',
    en: 'Claim Tracker',
    or: 'ଦାବି ଟ୍ରାକର',
  },
  nyayaMitra: {
    hi: 'न्याय मित्र',
    en: 'Justice Friend',
    or: 'ନ୍ୟାୟ ମିତ୍ର',
  },
  adhikarSampark: {
    hi: 'अधिकार संपर्क',
    en: 'Rights Connect',
    or: 'ଅଧିକାର ସମ୍ପର୍କ',
  },
  mappingTool: {
    hi: 'भूमि मैपिंग',
    en: 'Land Mapping',
    or: 'ଭୂମି ମ୍ୟାପିଂ',
  },
  
  // Status messages
  online: {
    hi: 'ऑनलाइन',
    en: 'Online',
    or: 'ଅନଲାଇନ',
  },
  offline: {
    hi: 'ऑफलाइन',
    en: 'Offline',
    or: 'ଅଫଲାଇନ',
  },
  syncing: {
    hi: 'अपडेट हो रहा है...',
    en: 'Syncing...',
    or: 'ଅପଡେଟ ହେଉଛି...',
  },
  
  // Claim statuses
  approved: {
    hi: 'स्वीकृत',
    en: 'Approved',
    or: 'ଅନୁମୋଦିତ',
  },
  rejected: {
    hi: 'निरस्त',
    en: 'Rejected',
    or: 'ପ୍ରତ୍ୟାଖ୍ୟାନ',
  },
  underReview: {
    hi: 'समीक्षाधीन',
    en: 'Under Review',
    or: 'ସମୀକ୍ଷାଧୀନ',
  },
  
  // Home Screen
  welcome_title: {
    hi: 'नमस्ते,',
    en: 'Welcome,',
    or: 'ନମସ୍କାର,',
  },
  welcome_subtitle: {
    hi: 'न्यायसेतु में आपका स्वागत है।',
    en: 'Welcome to NyayaSetu.',
    or: 'ନ୍ୟାୟସେତୁକୁ ସ୍ୱାଗତ।',
  },
  home_quick_actions: {
    hi: 'त्वरित कार्रवाइयां',
    en: 'Quick Actions',
    or: 'ଶୀଘ୍ର କାର୍ଯ୍ୟ',
  },
  home_qa_claim_title: {
    hi: 'दावा स्थिति जांचें',
    en: 'Check Claim Status',
    or: 'ଦାବି ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ',
  },
  home_qa_claim_subtitle: {
    hi: 'अपने दावे की प्रगति ट्रैक करें',
    en: 'Track the progress of your claim',
    or: 'ଆପଣଙ୍କ ଦାବିର ଅଗ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ',
  },
  home_qa_mitra_title: {
    hi: 'न्याय मित्र से पूछें',
    en: 'Ask Nyaya Mitra',
    or: 'ନ୍ୟାୟ ମିତ୍ରଙ୍କୁ ପଚାରନ୍ତୁ',
  },
  home_qa_mitra_subtitle: {
    hi: 'अपने अधिकारों के बारे में प्रश्न पूछें',
    en: 'Ask questions about your rights',
    or: 'ଆପଣଙ୍କ ଅଧିକାର ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
  },
  home_qa_schemes_title: {
    hi: 'योजनाएं खोजें',
    en: 'Discover Schemes',
    or: 'ଯୋଜନାଗୁଡ଼ିକ ଆବିଷ୍କାର କରନ୍ତୁ',
  },
  home_qa_schemes_subtitle: {
    hi: 'अपने लिए सरकारी योजनाओं का पता लगाएं',
    en: 'Find government schemes for you',
    or: 'ଆପଣଙ୍କ ପାଇଁ ସରକାରୀ ଯୋଜନା ଖୋଜନ୍ତୁ',
  },
  home_recent_activity: {
    hi: 'हाल की गतिविधि',
    en: 'Recent Activity',
    or: 'ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ',
  },
  home_no_recent_activity: {
    hi: 'कोई हाल की गतिविधि नहीं।',
    en: 'No recent activity.',
    or: 'କୌଣସି ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ ନାହିଁ।',
  },
  home_view_all: {
    hi: 'सभी देखें',
    en: 'View All',
    or: 'ସବୁ ଦେଖନ୍ତୁ',
  },
  home_qa_mapping_title: {
    hi: 'भूमि मैपिंग',
    en: 'Land Mapping',
    or: 'ଜମି ମ୍ୟାପିଂ',
  },
  home_qa_mapping_subtitle: {
    hi: 'अपनी भूमि की सीमाओं को मापें',
    en: 'Measure your land boundaries',
    or: 'ଆପଣଙ୍କ ଜମିର ସୀମା ମାପନ୍ତୁ',
  },
  home_claims_saved: {
    hi: 'दावे सहेजे गए',
    en: 'Claims Saved',
    or: 'ଦାବି ସେଭ୍ ହେଲା',
  },
  home_schemes_available: {
    hi: 'योजनाएं उपलब्ध',
    en: 'Schemes Available',
    or: 'ଯୋଜନା ଉପଲବ୍ଧ',
  },
  home_last_sync: {
    hi: 'अंतिम सिंक',
    en: 'Last Sync',
    or: 'ଶେଷ ସିଙ୍କ୍',
  },
  claim_id: {
    hi: 'दावा आईडी',
    en: 'Claim ID',
    or: 'ଦାବି ଆଇଡି',
  },
  view_details: {
    hi: 'विवरण देखें',
    en: 'View Details',
    or: 'ବିବରଣୀ ଦେଖନ୍ତୁ',
  },
  home_recent_claims: {
    hi: 'हाल के दावे',
    en: 'Recent Claims',
    or: 'ସାମ୍ପ୍ରତିକ ଦାବି',
  },
  home_help_text: {
    hi: 'सहायता चाहिए? न्याय मित्र से पूछें।',
    en: 'Need help? Ask Nyaya Mitra.',
    or: 'ସାହାଯ୍ୟ ଦରକାର? ନ୍ୟାୟ ମିତ୍ରଙ୍କୁ ପଚାରନ୍ତୁ।',
  },
  error: {
    hi: 'त्रुटि',
    en: 'Error',
    or: 'ତ୍ରୁଟି',
  },
  success: {
    hi: 'सफलता',
    en: 'Success',
    or: 'ସଫଳତା',
  },
  search: {
    hi: 'खोजें',
    en: 'Search',
    or: 'ଖୋଜନ୍ତୁ',
  },
  status: {
    hi: 'स्थिति',
    en: 'Status',
    or: 'ସ୍ଥିତି',
  },

  // Claim Tracker Screen
  claim_tracker_search_placeholder: {
    hi: 'अपना संदर्भ आईडी दर्ज करें',
    en: 'Enter your Reference ID',
    or: 'ଆପଣଙ୍କର Reference ID ଦାଖଲ କରନ୍ତୁ',
  },
  claim_tracker_subtitle: {
    hi: 'अपने दावे की स्थिति जांचें',
    en: 'Check the status of your claim',
    or: 'ଆପଣଙ୍କ ଦାବିର ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ',
  },
  claim_tracker_ref_id_label: {
    hi: 'Reference ID',
    en: 'Reference ID',
    or: 'Reference ID',
  },
  claim_tracker_enter_ref_id: {
    hi: 'कृपया Reference ID दर्ज करें',
    en: 'Please enter the Reference ID',
    or: 'ଦୟାକରି Reference ID ପ୍ରବେଶ କରନ୍ତୁ',
  },
  claim_tracker_fetch_error: {
    hi: 'दावा खोजने में समस्या हुई।',
    en: 'There was a problem fetching the claim.',
    or: 'ଦାବି ଖୋଜିବାରେ ଏକ ସମସ୍ୟା ହେଲା।',
  },
  claim_tracker_sync_success: {
    hi: 'दावा स्थिति सफलतापूर्वक अपडेट हो गई है।',
    en: 'Claim status updated successfully.',
    or: 'ଦାବି ସ୍ଥିତି ସଫଳତାର ସହିତ ଅପଡେଟ୍ ହୋଇଛି।',
  },
  claim_tracker_sync_error: {
    hi: 'दावा स्थिति सिंक करने में विफल।',
    en: 'Failed to sync claim status.',
    or: 'ଦାବି ସ୍ଥିତି ସିଙ୍କ୍ କରିବାରେ ବିଫଳ।',
  },
  claim_tracker_no_claims_title: {
    hi: 'कोई दावा नहीं मिला',
    en: 'No Claims Found',
    or: 'କୌଣସି ଦାବି ମିଳିଲା ନାହିଁ',
  },
  claim_tracker_no_claims_subtitle: {
    hi: 'शुरू करने के लिए एक Reference ID खोजें।',
    en: 'Search for a Reference ID to get started.',
    or: 'ଆରମ୍ଭ କରିବାକୁ ଏକ Reference ID ଖୋଜନ୍ତୁ।',
  },

  // Adhikar Sampark Screen
  adhikar_sampark_subtitle: {
    hi: 'आपके लिए उपलब्ध योजनाओं की जानकारी',
    en: 'Information about schemes available for you',
    or: 'ଆପଣଙ୍କ ପାଇଁ ଉପଲବ୍ଧ ଯୋଜନାଗୁଡ଼ିକର ସୂଚନା',
  },
  adhikar_sampark_find_schemes: {
    hi: 'मेरे लिए उपयुक्त योजनाएं खोजें',
    en: 'Find suitable schemes for me',
    or: 'ମୋ ପାଇଁ ଉପଯୁକ୍ତ ଯୋଜନା ଖୋଜନ୍ତୁ',
  },
  adhikar_sampark_available_schemes: {
    hi: 'उपलब्ध योजनाएं',
    en: 'Available Schemes',
    or: 'ଉପଲବ୍ଧ ଯୋଜନା',
  },
  adhikar_sampark_free_service: {
    hi: 'मुफ्त सेवा',
    en: 'Free Service',
    or: 'ମାଗଣା ସେବା',
  },
  adhikar_sampark_schemes_list: {
    hi: 'योजनाओं की सूची',
    en: 'List of Schemes',
    or: 'ଯୋଜନାଗୁଡ଼ିକର ତାଲିକା',
  },
  adhikar_sampark_no_schemes: {
    hi: 'कोई योजना उपलब्ध नहीं है',
    en: 'No schemes available',
    or: 'କୌଣସି ଯୋଜନା ଉପଲବ୍ଧ ନାହିଁ',
  },
  adhikar_sampark_no_schemes_subtitle: {
    hi: 'कृपया बाद में जांचें या इंटरनेट कनेक्शन की जांच करें',
    en: 'Please check back later or check your internet connection',
    or: 'ଦୟାକରି ପରେ ଯାଞ୍ଚ କରନ୍ତୁ କିମ୍ବା ଆପଣଙ୍କର ଇଣ୍ଟରନେଟ୍ ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ',
  },
  adhikar_sampark_help_title: {
    hi: 'सहायता चाहिए?',
    en: 'Need help?',
    or: 'ସାହାଯ୍ୟ ଦରକାର?',
  },
  adhikar_sampark_help_text: {
    hi: '• न्याय मित्र से पूछें\n• ग्राम पंचायत से संपर्क करें\n• Block Office जाएं',
    en: '• Ask Nyaya Mitra\n• Contact Gram Panchayat\n• Visit Block Office',
    or: '• ନ୍ୟାୟ ମିତ୍ରଙ୍କୁ ପଚାରନ୍ତୁ\n• ଗ୍ରାମ ପଞ୍ଚାୟତ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ\n• ବ୍ଲକ୍ ଅଫିସ୍ ଯାଆନ୍ତୁ',
  },
  adhikar_sampark_main_benefit: {
    hi: 'मुख्य लाभ:',
    en: 'Main Benefits:',
    or: 'ମୁଖ୍ୟ ଲାଭ:',
  },
  adhikar_sampark_more_benefits: {
    hi: '+{count} और लाभ',
    en: '+{count} more benefits',
    or: '+{count} ଅଧିକ ଲାଭ',
  },
  adhikar_sampark_benefits: {
    hi: 'लाभ',
    en: 'Benefits',
    or: 'ଲାଭ',
  },
  adhikar_sampark_eligibility: {
    hi: 'पात्रता',
    en: 'Eligibility',
    or: 'ଯୋଗ୍ୟତା',
  },
  adhikar_sampark_application_process: {
    hi: 'आवेदन प्रक्रिया',
    en: 'Application Process',
    or: 'ଆବେଦନ ପ୍ରକ୍ରିୟା',
  },
  adhikar_sampark_apply: {
    hi: 'आवेदन करें',
    en: 'Apply',
    or: 'ଆବେଦନ କରନ୍ତୁ',
  },
  questionnaire_feature_soon: {
    hi: 'प्रश्नावली फीचर जल्द आ रहा है!',
    en: 'Questionnaire feature is coming soon!',
    or: 'ପ୍ରଶ୍ନପତ୍ର ଫିଚର୍ ଶୀଘ୍ର ଆସୁଛି!',
  },

  // Nyaya Mitra Screen
  nyaya_mitra_ai_assistant: {
    hi: 'AI सहायक',
    en: 'AI Assistant',
    or: 'AI ସହାୟକ',
  },
  nyaya_mitra_welcome_title: {
    hi: 'न्याय मित्र में स्वागत है!',
    en: 'Welcome to Nyaya Mitra!',
    or: 'ନ୍ୟାୟ ମିତ୍ରକୁ ସ୍ୱାଗତ!',
  },
  nyaya_mitra_welcome_text: {
    hi: 'मैं आपकी वन अधिकार अधिनियम और सरकारी योजनाओं से संबंधित सहायता कर सकता हूं।',
    en: 'I can assist you with the Forest Rights Act and government schemes.',
    or: 'ମୁଁ ଆପଣଙ୍କୁ ବନ ଅଧିକାର ଅଧିନିୟମ ଏବଂ ସରକାରୀ ଯୋଜନା ସହିତ ସାହାଯ୍ୟ କରିପାରିବି।',
  },
  nyaya_mitra_quick_questions: {
    hi: 'त्वरित प्रश्न:',
    en: 'Quick Questions:',
    or: 'ଶୀଘ୍ର ପ୍ରଶ୍ନ:',
  },
  nyaya_mitra_placeholder: {
    hi: 'अपना प्रश्न यहां लिखें...',
    en: 'Type your question here...',
    or: 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ...',
  },
  nyaya_mitra_voice_listening: {
    hi: 'आवाज़ सुनना बंद करें',
    en: 'Stop listening',
    or: 'ଶୁଣିବା ବନ୍ଦ କରନ୍ତୁ',
  },
  nyaya_mitra_voice_ask: {
    hi: 'आवाज़ से पूछें',
    en: 'Ask with voice',
    or: 'ସ୍ୱରରେ ପଚାରନ୍ତୁ',
  },
  nyaya_mitra_enter_question: {
    hi: 'कृपया अपना प्रश्न लिखें',
    en: 'Please enter your question',
    or: 'ଦୟାକରି ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପ୍ରବେଶ କରନ୍ତୁ',
  },
  nyaya_mitra_voice_clear: {
    hi: 'आवाज़ स्पष्ट नहीं थी। कृपया फिर से कोशिश करें।',
    en: 'Voice was not clear. Please try again.',
    or: 'ସ୍ୱର ସ୍ପଷ୍ଟ ନଥିଲା। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
  },
  nyaya_mitra_voice_error: {
    hi: 'आवाज़ पहचानने में समस्या हुई',
    en: 'Problem recognizing voice',
    or: 'ସ୍ୱର ଚିହ୍ନିବାରେ ସମସ୍ୟା ହେଲା',
  },
  nyaya_mitra_offline_fallback: {
    hi: '(ऑफलाइन मोड - AI सेवा अनुपलब्ध)',
    en: '(Offline Mode - AI service unavailable)',
    or: '(ଅଫଲାଇନ୍ ମୋଡ୍ - AI ସେବା ଅନୁପଲବ୍ଧ)',
  },
  nyaya_mitra_offline_alert: {
    hi: 'AI सेवा अनुपलब्ध है। बुनियादी सहायता प्रदान की जा रही है।',
    en: 'AI service is unavailable. Basic assistance is being provided.',
    or: 'AI ସେବା ଅନୁପଲବ୍ଧ। ମୌଳିକ ସହାୟତା ପ୍ରଦାନ କରାଯାଉଛି।',
  },
  nyaya_mitra_info: {
    hi: 'सूचना',
    en: 'Information',
    or: 'ସୂଚନା',
  },

  // Mapping Tool Screen
  mapping_tool_start_recording: {
    hi: 'रिकॉर्डिंग शुरू करें',
    en: 'Start Recording',
    or: 'ରେକର୍ଡିଂ ଆରମ୍ଭ କରନ୍ତୁ',
  },
  mapping_tool_gps_started: {
    hi: 'GPS ट्रैकिंग शुरू हो गई है। अपनी भूमि की सीमा के साथ चलना शुरू करें।',
    en: 'GPS tracking has started. Start walking along the boundary of your land.',
    or: 'ଜିପିଏସ୍ ଟ୍ରାକିଂ ଆରମ୍ଭ ହୋଇଛି। ଆପଣଙ୍କ ଜମିର ସୀମା ସହିତ ଚାଲିବା ଆରମ୍ଭ କରନ୍ତୁ।',
  },
  mapping_tool_recording_paused: {
    hi: 'रिकॉर्डिंग रोकी गई',
    en: 'Recording Paused',
    or: 'ରେକର୍ଡିଂ ବନ୍ଦ ହେଲା',
  },
  mapping_tool_recording_resumed: {
    hi: 'रिकॉर्डिंग जारी',
    en: 'Recording Resumed',
    or: 'ରେକର୍ଡିଂ ପୁଣି ଆରମ୍ଭ ହେଲା',
  },
  mapping_tool_gps_paused: {
    hi: 'GPS ट्रैकिंग रोक दी गई है।',
    en: 'GPS tracking has been paused.',
    or: 'ଜିପିଏସ୍ ଟ୍ରାକିଂ ବନ୍ଦ କରାଯାଇଛି।',
  },
  mapping_tool_gps_resumed: {
    hi: 'GPS ट्रैकिंग फिर से शुरू हो गई है।',
    en: 'GPS tracking has resumed.',
    or: 'ଜିପିଏସ୍ ଟ୍ରାକିଂ ପୁଣି ଆରମ୍ଭ ହୋଇଛି।',
  },
  mapping_tool_map_saved: {
    hi: 'मैप सहेजा गया',
    en: 'Map Saved',
    or: 'ମାନଚିତ୍ର ସେଭ୍ ହେଲା',
  },
  mapping_tool_map_saved_success: {
    hi: 'आपका भूमि मैप सफलतापूर्वक सहेजा गया है।',
    en: 'Your land map has been saved successfully.',
    or: 'ଆପଣଙ୍କ ଜମି ମାନଚିତ୍ର ସଫଳତାର ସହିତ ସେଭ୍ ହୋଇଛି।',
  },
  mapping_tool_total_points: {
    hi: 'कुल बिंदु:',
    en: 'Total Points:',
    or: 'ମୋଟ ପଏଣ୍ଟ:',
  },
  mapping_tool_estimated_area: {
    hi: 'अनुमानित क्षेत्रफल:',
    en: 'Estimated Area:',
    or: 'ଅନୁମାନିତ କ୍ଷେତ୍ରଫଳ:',
  },
  mapping_tool_sq_meters: {
    hi: 'वर्ग मीटर',
    en: 'sq. meters',
    or: 'ବର୍ଗ ମିଟର',
  },
  mapping_tool_ok: {
    hi: 'ठीक है',
    en: 'OK',
    or: 'ଠିକ୍ ଅଛି',
  },
  mapping_tool_instructions_title: {
    hi: 'भूमि मैपिंग कैसे करें:',
    en: 'How to do Land Mapping:',
    or: 'ଜମି ମ୍ୟାପିଂ କିପରି କରିବେ:',
  },
  mapping_tool_step1: {
    hi: 'अपनी भूमि के एक कोने पर खड़े हों',
    en: 'Stand at one corner of your land',
    or: 'ଆପଣଙ୍କ ଜମିର ଏକ କୋଣରେ ଠିଆ ହୁଅନ୍ତୁ',
  },
  mapping_tool_step2: {
    hi: '"रिकॉर्डिंग शुरू करें" बटन दबाएं',
    en: 'Press the "Start Recording" button',
    or: '"ରେକର୍ଡିଂ ଆରମ୍ଭ କରନ୍ତୁ" ବଟନ୍ ଦବାନ୍ତୁ',
  },
  mapping_tool_step3: {
    hi: 'भूमि की सीमा के साथ धीरे-धीरे चलें',
    en: 'Walk slowly along the boundary of the land',
    or: 'ଜମିର ସୀମା ସହିତ ଧୀରେ ଧୀରେ ଚାଲନ୍ତୁ',
  },
  mapping_tool_step4: {
    hi: 'शुरुआती बिंदु पर वापस आकर "सहेजें" दबाएं',
    en: 'Return to the starting point and press "Save"',
    or: 'ଆରମ୍ଭ ସ୍ଥାନକୁ ଫେରି "ସେଭ୍" ଦବାନ୍ତୁ',
  },
  mapping_tool_controls_title: {
    hi: 'मैपिंग नियंत्रण',
    en: 'Mapping Controls',
    or: 'ମ୍ୟାପିଂ ନିୟନ୍ତ୍ରଣ',
  },
  mapping_tool_resume: {
    hi: 'जारी रखें',
    en: 'Resume',
    or: 'ପୁଣି ଆରମ୍ଭ କରନ୍ତୁ',
  },
  mapping_tool_pause: {
    hi: 'रोकें',
    en: 'Pause',
    or: 'ବନ୍ଦ କରନ୍ତୁ',
  },
  mapping_tool_save: {
    hi: 'सहेजें',
    en: 'Save',
    or: 'ସେଭ୍ କରନ୍ତୁ',
  },
  mapping_tool_status_title: {
    hi: 'वर्तमान स्थिति',
    en: 'Current Status',
    or: 'ବର୍ତ୍ତମାନ ସ୍ଥିତି',
  },
  mapping_tool_gps_status: {
    hi: 'GPS स्थिति',
    en: 'GPS Status',
    or: 'ଜିପିଏସ୍ ସ୍ଥିତି',
  },
  mapping_tool_gps_active: {
    hi: 'सक्रिय',
    en: 'Active',
    or: 'ସକ୍ରିୟ',
  },
  mapping_tool_gps_paused_status: {
    hi: 'रोका गया',
    en: 'Paused',
    or: 'ବନ୍ଦ ହେଲା',
  },
  mapping_tool_gps_off: {
    hi: 'बंद',
    en: 'Off',
    or: 'ବନ୍ଦ',
  },
  mapping_tool_recorded_points: {
    hi: 'रिकॉर्ड बिंदु',
    en: 'Recorded Points',
    or: 'ରେକର୍ଡ ହୋଇଥିବା ପଏଣ୍ଟ',
  },
  mapping_tool_area: {
    hi: 'क्षेत्रफल',
    en: 'Area',
    or: 'କ୍ଷେତ୍ରଫଳ',
  },
  mapping_tool_clear_map: {
    hi: 'मानचित्र साफ़ करें',
    en: 'Clear Map',
    or: 'ମାନଚିତ୍ର ସଫା କରନ୍ତୁ',
  },
  mapping_tool_clear_map_confirm: {
    hi: 'क्या आप वाकई वर्तमान मानचित्र डेटा साफ़ करना चाहते हैं?',
    en: 'Are you sure you want to clear the current map data?',
    or: 'ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ବର୍ତ୍ତମାନର ମାନଚିତ୍ର ଡାଟା ସଫା କରିବାକୁ ଚାହୁଁଛନ୍ତି?',
  },
  mapping_tool_location_permission_title: {
    hi: 'स्थान की अनुमति आवश्यक है',
    en: 'Location Permission Required',
    or: 'ସ୍ଥାନ ଅନୁମତି ଆବଶ୍ୟକ',
  },
  mapping_tool_location_permission_message: {
    hi: 'भूमि मैपिंग सुविधा के लिए इस ऐप को आपके स्थान तक पहुंच की आवश्यकता है।',
    en: 'This app needs access to your location for the land mapping feature.',
    or: 'ଏହି ଆପ୍ ଜମି ମ୍ୟାପିଂ ସୁବିଧା ପାଇଁ ଆପଣଙ୍କ ସ୍ଥାନକୁ ପ୍ରବେଶ କରିବା ଆବଶ୍ୟକ କରେ।',
  },
  cancel: {
    hi: 'रद्द करें',
    en: 'Cancel',
    or: 'ବାତିଲ କରନ୍ତୁ',
  },
  confirm: {
    hi: 'पुष्टि करें',
    en: 'Confirm',
    or: 'ନିଶ୍ଚିତ କରନ୍ତୁ',
  },
  loading_title: {
    hi: 'न्यायसेतु',
    en: 'NyayaSetu',
    or: 'ନ୍ୟାୟସେତୁ',
  },
  loading_text: {
    hi: 'प्रारंभ हो रहा है...',
    en: 'Initializing...',
    or: 'ଆରମ୍ଭ ହେଉଛି...',
  },
  loading_subtext: {
    hi: 'वन अधिकार अधिनियम सहायता प्रणाली',
    en: 'Forest Rights Act Assistance System',
    or: 'ଜଙ୍ଗଲ ଅଧିକାର ଅଧିନିୟମ ସହାୟତା ପ୍ରଣାଳୀ',
  },
  
  // Government schemes
  governmentSchemes: {
    hi: 'सरकारी योजनाएं',
    en: 'Government Schemes',
    or: 'ସରକାରୀ ଯୋଜନା',
  },
  benefits: {
    hi: 'लाभ',
    en: 'Benefits',
    or: 'ଲାଭ',
  },
  eligibility: {
    hi: 'पात्रता',
    en: 'Eligibility',
    or: 'ଯୋଗ୍ୟତା',
  },
  applicationProcess: {
    hi: 'आवेदन प्रक्रिया',
    en: 'Application Process',
    or: 'ଆବେଦନ ପ୍ରକ୍ରିୟା',
  },
};

class TranslationService {
  private currentLanguage: SupportedLanguage = 'hi';

  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  // Get translation for a key
  t(key: keyof typeof translations, language?: SupportedLanguage): string {
    const lang = language || this.currentLanguage;
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation key '${key}' not found`);
      return key;
    }

    return translation[lang] || translation['hi'] || key;
  }

  // Get all translations for a key
  getAll(key: keyof typeof translations): Record<SupportedLanguage, string> {
    return translations[key] || { hi: key, en: key, or: key };
  }

  // Check if a key exists
  hasTranslation(key: string): boolean {
    return key in translations;
  }

  // Get language-specific formatting
  formatNumber(num: number, language?: SupportedLanguage): string {
    const lang = language || this.currentLanguage;
    
    try {
      const locale = {
        'hi': 'hi-IN',
        'en': 'en-US',
        'or': 'hi-IN', // Fallback to Hindi locale
      }[lang];

      return new Intl.NumberFormat(locale).format(num);
    } catch (error) {
      return num.toString();
    }
  }

  // Format date in local language
  formatDate(date: Date, language?: SupportedLanguage): string {
    const lang = language || this.currentLanguage;
    
    try {
      const locale = {
        'hi': 'hi-IN',
        'en': 'en-US',
        'or': 'hi-IN',
      }[lang];

      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  // Format time in local language
  formatTime(date: Date, language?: SupportedLanguage): string {
    const lang = language || this.currentLanguage;
    
    try {
      const locale = {
        'hi': 'hi-IN',
        'en': 'en-US',
        'or': 'hi-IN',
      }[lang];

      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return date.toLocaleTimeString();
    }
  }

  // Get language name in native script
  getLanguageName(language: SupportedLanguage): string {
    const names = {
      'hi': 'हिंदी',
      'en': 'English',
      'or': 'ଓଡ଼ିଆ',
    };
    return names[language];
  }

  // Get language direction (for future RTL support)
  getLanguageDirection(language: SupportedLanguage = this.currentLanguage): 'ltr' | 'rtl' {
    // Reserved for future RTL language support
    const rtlLanguages: SupportedLanguage[] = [];
    return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }

  // Pluralization helper
  plural(count: number, singular: string, plural: string, language?: SupportedLanguage): string {
    const lang = language || this.currentLanguage;
    
    // Simple pluralization rules
    if (lang === 'en') {
      return count === 1 ? singular : plural;
    } else {
      // Hindi and Odia have different pluralization rules
      // For simplicity, using count-based approach
      return count === 1 ? singular : plural;
    }
  }

  translate(key: TranslationKey): string {
    if (translations[key] && translations[key][this.currentLanguage]) {
      return translations[key][this.currentLanguage];
    }
    console.warn(`Translation not found for key: ${key}`);
    // Fallback to English or the key itself
    return translations[key]?.en || key.replace(/_/g, ' ');
  }
}

export const translationService = new TranslationService();
export default translationService;

// Export translation keys for TypeScript autocomplete
export type TranslationKey = keyof typeof translations;