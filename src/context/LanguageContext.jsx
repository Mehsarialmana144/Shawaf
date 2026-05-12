import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Nav
    home: 'Home',
    tripPlanner: 'Trip Planner',
    itinerary: 'Itinerary',
    map: 'Map',
    profile: 'Profile',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    arabic: 'عربي',
    english: 'English',

    // Hero
    heroTag: '⚡ AI-Powered Travel Planning',
    heroTitle: 'Plan Your Perfect Trip in Saudi Arabia with AI',
    heroBrand: 'Shawaf — شواف',
    heroSub:
      'Enjoy smart, personalized trip planning powered by the latest AI technology. Create detailed daily itineraries that match your preferences and budget across Saudi Arabia.',
    startPlanning: 'Start Planning Your Trip',
    learnMore: 'Learn More',
    rating: '4.9',
    ratingLabel: 'User Rating',
    cities: '30+',
    citiesLabel: 'Covered Cities',
    travelers: '12K+',
    travelersLabel: 'Happy Travelers',
    trips: '50K+',
    tripsLabel: 'Trips Generated',

    // Features
    whyChoose: 'Why Choose Shawaf?',
    feat1Title: 'AI-Powered Planning',
    feat1Desc:
      'Our advanced AI generates personalized itineraries based on your unique preferences, travel style, and budget.',
    feat2Title: 'Interactive Maps',
    feat2Desc:
      'Visualize your journey with integrated maps showing all attractions, distances, and optimal routes.',
    feat3Title: 'Smart Scheduling',
    feat3Desc:
      'Automatically optimize your schedule based on opening hours, travel times, and attraction priorities.',
    feat4Title: 'PDF Export',
    feat4Desc:
      'Download your complete itinerary as a beautifully formatted PDF to take offline anywhere.',
    feat5Title: 'Multi-City Trips',
    feat5Desc:
      'Plan complex multi-city journeys across Saudi Arabia with seamless city-to-city transitions.',
    feat6Title: '24/7 Available',
    feat6Desc:
      'Plan your dream trip anytime, anywhere. No waiting, no appointments needed.',

    // How it works
    howItWorks: 'How Shawaf Works',
    step1: 'Create Your Account',
    step1Desc: 'Sign up and set your personal interests and preferences.',
    step2: 'Build Your Trip',
    step2Desc: 'Add your destinations, dates, budget, and activity preferences.',
    step3: 'Generate Itinerary',
    step3Desc: 'Our AI instantly generates a detailed daily travel plan.',
    step4: 'Explore & Enjoy',
    step4Desc:
      'Use the interactive map, export PDF, and enjoy your next journey.',

    // Testimonials
    travelers_say: 'What Travelers Say',
    t1:
      '"Shawaf planned my 5-day Riyadh trip perfectly. The AI understood exactly what I wanted!"',
    t1Name: 'Khalid Al-Mansour',
    t1City: 'Riyadh',
    t2:
      '"The interactive map feature is amazing. I could see all my planned stops at a glance."',
    t2Name: 'Sara Al-Otaibi',
    t2City: 'Jeddah',
    t3:
      '"Generated a complete Al-Ula itinerary in seconds. Saved me hours of research!"',
    t3Name: 'Mohammed Bin Nasser',
    t3City: 'Al-Ula',

    // CTA
    ctaTitle: 'Ready to Explore Saudi Arabia?',
    ctaSub: 'Join thousands of travelers planning smart with Shawaf.',
    ctaBtn: 'Start Planning Your Trip',

    // Footer
    footerDesc:
      'AI-powered travel planning for Saudi Arabia. Aligned with Vision 2030.',
    vision2030: '✦ Aligned with Vision 2030',
    quickLinks: 'Quick Links',
    account: 'Account',
    contactUs: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',

    // Auth
    signInTitle: 'Sign In',
    signUpTitle: 'Create Account',
    emailAddress: 'Email Address',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    fullName: 'Full Name',

    // Planner
    planNewTrip: 'Plan a New Trip',
    step1Label: 'Trip Details',
    step2Label: 'Preferences',
    step3Label: 'Itinerary',
    step1Sub: 'Step 1 of 3: Basic trip information',
    step2Sub: 'Step 2 of 3: Your preferences',
    destinationCity: 'Destination City',
    searchCity: 'Search for a city...',
    startDate: 'Start Date',
    endDate: 'End Date',
    numberOfPeople: 'Number of People',
    tripType: 'Trip Type',
    configureTrip: 'Configure Trip',
    tripDayCount: (n) => `📅 ${n} day${n !== 1 ? 's' : ''} trip`,

    cultural: 'Cultural & Heritage',
    adventure: 'Adventure & Outdoor',
    relaxation: 'Relaxation & Leisure',
    religious: 'Religious & Spiritual',
    business: 'Business & Tourism',
    family: 'Family Trip',

    budgetRange: 'Budget Range',
    budget: 'Budget',
    midRange: 'Mid-Range',
    luxury: 'Luxury',
    activityLevel: 'Activity Level',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    activityTypes: 'Activity Types',
    selectAllInterest: 'Select all that interest you',
    sightseeing: 'Sightseeing',
    localDining: 'Local Dining',
    shopping: 'Shopping',
    museums: 'Museums',
    natureParks: 'Nature & Parks',
    sportsAdventure: 'Sports & Adventure',
    entertainment: 'Entertainment',
    photography: 'Photography Spots',
    additionalNotes: 'Additional Notes',
    notesPlaceholder: 'Any special requirements or preferences...',
    generateItinerary: 'Generate Itinerary',
    back: 'Back',

    // Itinerary
    tripSummary: 'Trip Summary',
    destinationCityLabel: 'Destination City:',
    startDateLabel: 'Start Date:',
    endDateLabel: 'End Date:',
    numberOfPeopleLabel: 'Number of People:',
    generatePDF: 'Generate PDF',
    saveTrip: 'Save Trip',
    regenerate: 'Regenerate Plan',
    backToPlanner: 'Back to Planner',
    openInMaps: 'Open in Maps',
    generating: 'Generating your itinerary...',
    generatingDesc:
      'AI is crafting your perfect trip. This may take a few moments.',
    saving: 'Saving...',
    tripSaved: 'Trip saved successfully!',
    day: 'Day',

    // Map
    mapTitle: 'Trip Map Visualization',
    allAttractions: 'All Attractions',
    legend: 'Legend',
    attractions: 'Attractions',
    filterByDay: 'Filter by Day',
    noTripData: 'No trip data. Generate an itinerary first.',

    // Profile
    myProfile: 'My Profile',
    savedTrips: 'Saved Trips',
    updateProfile: 'Update Profile',
    noTripsYet: 'No saved trips yet.',
    startFirstTrip: 'Start Planning Your First Trip',
    viewItinerary: 'View Itinerary',
    deleteTrip: 'Delete',
    profileUpdated: 'Profile updated!',

    // Admin
    systemOverview: 'System Overview',
    activeTrips: 'Active Trips',
    aiAccuracy: 'AI Accuracy',
    newSignups: 'New Signups',
    totalRevenue: 'Total Revenue',
    analyticsTitle: 'Analytics — Trips Generated',
    recentActivity: 'Recent Activity',
    users: 'Users',
    name: 'Name',
    email: 'Email',
    trips_count: 'Trips',
    status: 'Status',
    active: 'Active',
    premium: 'Premium',
    inactive: 'Inactive',
  },

  ar: {
    // Nav
    home: 'الرئيسية',
    tripPlanner: 'تخطيط الرحلة',
    itinerary: 'جدول الرحلة',
    map: 'الخريطة',
    profile: 'الملف الشخصي',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    arabic: 'عربي',
    english: 'English',

    // Hero
    heroTag: '⚡ تخطيط سياحي بالذكاء الاصطناعي',
    heroTitle:
      'خطط لرحلتك المثالية في المملكة العربية السعودية بالذكاء الاصطناعي',
    heroBrand: 'Shawaf — شواف',
    heroSub:
      'استمتع بتخطيط سفر ذكي ومخصص بأحدث تقنيات الذكاء الاصطناعي. أنشئ جداول رحلات يومية تناسب تفضيلاتك وميزانيتك في المملكة العربية السعودية.',
    startPlanning: 'ابدأ تخطيط رحلتك',
    learnMore: 'اعرف المزيد',
    rating: '4.9',
    ratingLabel: 'تقييم المستخدمين',
    cities: '+30',
    citiesLabel: 'مدينة مشمولة',
    travelers: '+12K',
    travelersLabel: 'مسافر سعيد',
    trips: '+50K',
    tripsLabel: 'رحلة مُولَّدة',

    // Features
    whyChoose: 'لماذا تختار شواف؟',
    feat1Title: 'تخطيط بالذكاء الاصطناعي',
    feat1Desc:
      'يولّد الذكاء الاصطناعي خططًا مخصصة بناءً على تفضيلاتك وأسلوب رحلتك وميزانيتك.',
    feat2Title: 'خرائط تفاعلية',
    feat2Desc:
      'اعرض رحلتك على خريطة تفاعلية توضّح المعالم ومحطات الرحلة بسهولة.',
    feat3Title: 'جدولة ذكية',
    feat3Desc:
      'يساعدك شواف على ترتيب جدولك بناءً على أوقات الفتح ومدة الزيارة وأولوية الأماكن.',
    feat4Title: 'تصدير PDF',
    feat4Desc:
      'حمّل خطة رحلتك كملف PDF منسق للاحتفاظ بها واستخدامها لاحقًا.',
    feat5Title: 'رحلات متعددة المدن',
    feat5Desc:
      'خطط لرحلات تشمل أكثر من مدينة داخل المملكة مع ترتيب منطقي بين المدن.',
    feat6Title: 'متاح دائمًا',
    feat6Desc:
      'خطط لرحلتك في أي وقت ومن أي مكان بدون انتظار أو مواعيد.',

    // How it works
    howItWorks: 'كيف يعمل شواف؟',
    step1: 'إنشاء الحساب',
    step1Desc: 'أنشئ حسابك وابدأ بإدخال معلومات رحلتك.',
    step2: 'تحديد تفاصيل الرحلة',
    step2Desc:
      'اختر المدن، التواريخ، الميزانية، ومستوى النشاط المناسب لك.',
    step3: 'توليد جدول الرحلة',
    step3Desc:
      'يقوم الذكاء الاصطناعي بتوليد جدول يومي مناسب لتفضيلاتك.',
    step4: 'استكشف واستمتع',
    step4Desc:
      'استخدم الخريطة، عدّل الخطة، واحفظ جدول رحلتك بسهولة.',

    // Testimonials
    travelers_say: 'ماذا يقول المسافرون؟',
    t1:
      '"خطط شواف رحلتي في الرياض بشكل رائع، وكانت الخطة مناسبة جدًا لتفضيلاتي."',
    t1Name: 'خالد المنصور',
    t1City: 'الرياض',
    t2:
      '"ميزة الخريطة التفاعلية ممتازة. استطعت رؤية جميع محطات الرحلة بسهولة."',
    t2Name: 'سارة العتيبي',
    t2City: 'جدة',
    t3:
      '"أنشأ شواف جدول رحلة كامل للعلا خلال ثوانٍ ووفّر علي وقت البحث."',
    t3Name: 'محمد بن ناصر',
    t3City: 'العلا',

    // CTA
    ctaTitle: 'جاهز لاستكشاف المملكة؟',
    ctaSub: 'انضم إلى المسافرين الذين يخططون بذكاء مع شواف.',
    ctaBtn: 'ابدأ تخطيط رحلتك',

    // Footer
    footerDesc:
      'منصة تخطيط رحلات سياحية داخل المملكة العربية السعودية بالذكاء الاصطناعي، بما يتماشى مع رؤية 2030.',
    vision2030: '✦ متوافق مع رؤية 2030',
    quickLinks: 'روابط سريعة',
    account: 'الحساب',
    contactUs: 'تواصل معنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',

    // Auth
    signInTitle: 'تسجيل الدخول',
    signUpTitle: 'إنشاء حساب',
    emailAddress: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    fullName: 'الاسم الكامل',

    // Planner
    planNewTrip: 'خطط لرحلة جديدة',
    step1Label: 'تفاصيل الرحلة',
    step2Label: 'التفضيلات',
    step3Label: 'الخطة',
    step1Sub: 'الخطوة 1 من 3: معلومات الرحلة الأساسية',
    step2Sub: 'الخطوة 2 من 3: تفضيلات الرحلة',
    destinationCity: 'مدينة الوجهة',
    searchCity: 'ابحث عن مدينة...',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    numberOfPeople: 'عدد الأشخاص',
    tripType: 'نوع الرحلة',
    configureTrip: 'متابعة إعداد الرحلة',
    tripDayCount: (n) => `📅 رحلة لمدة ${n} ${n === 1 ? 'يوم' : 'أيام'}`,

    cultural: 'ثقافية وتراثية',
    adventure: 'مغامرة وطبيعة',
    relaxation: 'استرخاء وترفيه',
    religious: 'دينية وروحانية',
    business: 'أعمال وسياحة',
    family: 'رحلة عائلية',

    budgetRange: 'نطاق الميزانية',
    budget: 'اقتصادي',
    midRange: 'متوسط',
    luxury: 'فاخر',
    activityLevel: 'مستوى النشاط',
    low: 'خفيف',
    moderate: 'متوسط',
    high: 'مكثف',
    activityTypes: 'أنواع الأنشطة',
    selectAllInterest: 'اختر كل ما يهمك',
    sightseeing: 'معالم سياحية',
    localDining: 'مطاعم محلية',
    shopping: 'تسوق',
    museums: 'متاحف',
    natureParks: 'طبيعة وحدائق',
    sportsAdventure: 'رياضة ومغامرة',
    entertainment: 'ترفيه',
    photography: 'أماكن تصوير',
    additionalNotes: 'ملاحظات إضافية',
    notesPlaceholder: 'أي متطلبات أو تفضيلات خاصة...',
    generateItinerary: 'توليد جدول الرحلة',
    back: 'رجوع',

    // Itinerary
    tripSummary: 'ملخص الرحلة',
    destinationCityLabel: 'مدينة الوجهة:',
    startDateLabel: 'تاريخ البداية:',
    endDateLabel: 'تاريخ النهاية:',
    numberOfPeopleLabel: 'عدد الأشخاص:',
    generatePDF: 'تحميل PDF',
    saveTrip: 'حفظ الرحلة',
    regenerate: 'إعادة توليد الخطة',
    backToPlanner: 'العودة للمخطط',
    openInMaps: 'فتح في الخرائط',
    generating: 'جارٍ توليد جدول الرحلة...',
    generatingDesc:
      'يقوم الذكاء الاصطناعي بإعداد رحلة مناسبة لك. قد يستغرق ذلك لحظات.',
    saving: 'جارٍ الحفظ...',
    tripSaved: 'تم حفظ الرحلة بنجاح!',
    day: 'اليوم',

    // Map
    mapTitle: 'خريطة الرحلة',
    allAttractions: 'جميع المعالم',
    legend: 'المفتاح',
    attractions: 'معالم',
    filterByDay: 'تصفية حسب اليوم',
    noTripData: 'لا توجد بيانات رحلة. أنشئ جدول رحلة أولًا.',

    // Profile
    myProfile: 'ملفي الشخصي',
    savedTrips: 'الرحلات المحفوظة',
    updateProfile: 'تحديث الملف الشخصي',
    noTripsYet: 'لا توجد رحلات محفوظة بعد.',
    startFirstTrip: 'ابدأ تخطيط أول رحلة',
    viewItinerary: 'عرض الجدول',
    deleteTrip: 'حذف',
    profileUpdated: 'تم تحديث الملف الشخصي!',

    // Admin
    systemOverview: 'نظرة عامة على النظام',
    activeTrips: 'الرحلات النشطة',
    aiAccuracy: 'دقة الذكاء الاصطناعي',
    newSignups: 'تسجيلات جديدة',
    totalRevenue: 'إجمالي الإيرادات',
    analyticsTitle: 'التحليلات — الرحلات المُولَّدة',
    recentActivity: 'النشاط الأخير',
    users: 'المستخدمون',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    trips_count: 'الرحلات',
    status: 'الحالة',
    active: 'نشط',
    premium: 'مميز',
    inactive: 'غير نشط',
  },
}

const LanguageContext = createContext({})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const toggle = () => {
    setLang((current) => (current === 'en' ? 'ar' : 'en'))
  }

  const t = (key, ...args) => {
    const val = translations[lang]?.[key] ?? translations.en[key]

    if (typeof val === 'function') return val(...args)

    return val ?? key
  }

  const isRTL = lang === 'ar'

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)