// Products Catalog for AXCES SEVEN EXIMS / DKB Premium Rice Vadagam

const PRODUCTS_DATA = [
  {
    id: "palaya-sadam-plain",
    name_en: "Palaya Sadam Vathal",
    name_ta: "பழைய சாதம் வத்தல்",
    subtitle_en: "Traditional Fermented Rice Fryums",
    subtitle_ta: "பாரம்பரிய நொதிக்க வைக்கப்பட்ட அரிசி வத்தல்",
    category: "fermented",
    badge_en: "Bestseller",
    badge_ta: "முக்கிய தேர்வு",
    badge_type: "gold",
    image: "assets/plain-rice-vadagam.jpg",
    short_desc_en: "Authentic sun-dried fermented rice fryums made with rich probiotics, jeera, and hing for superior gut health and light, crispy crunch.",
    short_desc_ta: "குடல் ஆரோக்கியத்திற்கு உகந்த இயற்கையான புரோபயாடிக்குகள், சீரகம் மற்றும் பெருங்காயம் சேர்த்து தயாரிக்கப்பட்ட பாரம்பரிய மொறுமொறுப்பான வத்தல்.",
    prices: {
      "250g": 85,
      "500g": 160,
      "1kg": 300,
      "5kg": 1400
    },
    ingredients_en: ["Fermented Raw Rice (Palaya Sadam)", "Cumin Seeds (Jeera)", "Asafoetida (Hing)", "Green Chillies", "Sea Salt"],
    ingredients_ta: ["நொதிக்க வைக்கப்பட்ட பச்சரிசி சாதம்", "சீரகம்", "பெருங்காயம்", "பச்சை மிளகாய்", "இயற்கை கடல் உப்பு"],
    benefits_en: [
      "Rich in beneficial probiotic bacteria that flushes out toxins from the gut.",
      "High levels of B-Complex and Vitamin B12 for natural, instant energy.",
      "Natural cooling properties that soothe stomach ulcers and regulate acidity.",
      "Cumin & Asafoetida relieve indigestion, bloating, and gas issues."
    ],
    benefits_ta: [
      "குடலில் உள்ள நச்சுக்களை வெளியேற்றும் நன்மை தரும் புரோபயாடிக் பாக்டீரியாக்கள் நிறைந்தது.",
      "உடலுக்கு உடனடி ஆற்றல் தரும் வைட்டமின் B12 மற்றும் B-Complex நிறைந்தது.",
      "வயிற்றுப் புண் மற்றும் அமிலத்தன்மையை தணிக்கும் இயற்கையான குளிர்ச்சி தரும் குணம்.",
      "செரிமானத்தை தூண்டி வாய்வு மற்றும் அஜீரணத்தை குணப்படுத்துகிறது."
    ],
    spice_level: "Mild",
    drying_method: "100% Traditional Solar Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "palaya-sadam-garlic",
    name_en: "Palaya Sadam Garlic Vathal",
    name_ta: "பழைய சாதம் பூண்டு வத்தல்",
    subtitle_en: "Garlic Fermented Rice Fryums (Poondu Vathal)",
    subtitle_ta: "பாரம்பரிய பூண்டு பழைய சாத வத்தல்",
    category: "fermented",
    badge_en: "Heart Health",
    badge_ta: "இதய ஆரோக்கியம்",
    badge_type: "emerald",
    image: "assets/garlic-rice-vadagam.jpg",
    short_desc_en: "Infused with country garlic (Naatu Poondu) and fermented rice. Helps maintain healthy blood pressure and lower bad cholesterol.",
    short_desc_ta: "நாட்டுப் பூண்டின் மணமும், பழைய சாதத்தின் சத்துக்களும் நிறைந்த ஆரோக்கியமான வத்தல். ரத்த அழுத்தத்தை சீராக்க உதவும்.",
    prices: {
      "250g": 95,
      "500g": 180,
      "1kg": 340,
      "5kg": 1600
    },
    ingredients_en: ["Fermented Rice", "Fresh Country Garlic (Naatu Poondu)", "Cumin Seeds", "Asafoetida", "Green Chillies", "Salt"],
    ingredients_ta: ["நொதிக்க வைக்கப்பட்ட அரிசி", "நாட்டுப் பூண்டு", "சீரகம்", "பெருங்காயம்", "பச்சை மிளகாய்", "உப்பு"],
    benefits_en: [
      "Maintains healthy blood pressure levels and lowers bad cholesterol.",
      "Boosts cardiovascular health with allicin from country garlic.",
      "Probiotics strengthen digestion while garlic acts as an antibacterial shield.",
      "Zero cholesterol and guilt-free side for all rice varieties."
    ],
    benefits_ta: [
      "இரத்த அழுத்தத்தை சீராக்க உதவுகிறது மற்றும் கெட்ட கொழுப்பைக் குறைக்கிறது.",
      "பூண்டில் உள்ள அல்லிசின் இதய ஆரோக்கியத்தை பலப்படுத்துகிறது.",
      "செரிமான மண்டலத்தை பலப்படுத்தி நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது."
    ],
    spice_level: "Medium",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "palaya-sadam-pepper",
    name_en: "Palaya Sadam Black Pepper Vathal",
    name_ta: "பழைய சாதம் மிளகு வத்தல்",
    subtitle_en: "Black Pepper Fryums (Milagu Vathal)",
    subtitle_ta: "பாரம்பரிய மிளகு பழைய சாத வத்தல்",
    category: "fermented",
    badge_en: "Immunity Boost",
    badge_ta: "நோய் எதிர்ப்பு சக்தி",
    badge_type: "gold",
    image: "assets/pepper-rice-vadagam.jpg",
    short_desc_en: "Coarsely crushed Malabar black pepper blended with probiotic rice. Clears throat congestion, relieves cough, and strengthens immunity.",
    short_desc_ta: "கருப்பு மிளகின் காரமும் நற்குணங்களும் சேர்ந்தது. சளி, இருமல் மற்றும் தொண்டை எரிச்சலுக்கு சிறந்த நிவாரணம்.",
    prices: {
      "250g": 95,
      "500g": 180,
      "1kg": 340,
      "5kg": 1600
    },
    ingredients_en: ["Fermented Rice", "Coarse Crushed Black Pepper (Milagu)", "Cumin (Jeera)", "Hing", "Rock Salt"],
    ingredients_ta: ["நொதித்த சாதம்", "கருப்பு மிளகு", "சீரகம்", "பெருங்காயம்", "இந்துப்பு"],
    benefits_en: [
      "Boosts immunity and helps clear throat congestion and cough.",
      "Piperine in black pepper enhances nutrient absorption and metabolism.",
      "Relieves seasonal chills and cleanses respiratory pathways.",
      "Combats fatigue with rich B-complex and natural spice warmth."
    ],
    benefits_ta: [
      "நோய் எதிர்ப்பு சக்தியை அதிகரித்து சளி மற்றும் தொண்டை அடைப்பை நீக்குகிறது.",
      "மிளகில் உள்ள பைப்பரின் செரிமானத்தையும் ஊட்டச்சத்து உறிஞ்சுதலையும் கூட்டுகிறது.",
      "சுவாசப் பாதையை சீராக்கி புத்துணர்ச்சி அளிக்கிறது."
    ],
    spice_level: "Spicy",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "palaya-sadam-curry-leaf",
    name_en: "Palaya Sadam Curry Leaf Vathal",
    name_ta: "பழைய சாதம் கறிவேப்பிலை வத்தல்",
    subtitle_en: "Curry Leaf Fryums (Kariveppilai Vathal)",
    subtitle_ta: "பாரம்பரிய கறிவேப்பிலை பழைய சாத வத்தல்",
    category: "fermented",
    badge_en: "Rich in Iron",
    badge_ta: "இரும்புச்சத்து நிறைந்தது",
    badge_type: "emerald",
    image: "assets/curryleaf-vadagam.jpg",
    short_desc_en: "Fresh country curry leaves ground into fermented rice paste. Rich in natural iron and antioxidants; promotes healthy hair and prevents anemia.",
    short_desc_ta: "சுத்தமான கறிவேப்பிலை சாறு மற்றும் பழைய சாதம் கொண்டு தயாரிக்கப்பட்டது. கூந்தல் வளர்ச்சி மற்றும் ரத்த சோகைக்கு உகந்தது.",
    prices: {
      "250g": 90,
      "500g": 170,
      "1kg": 320,
      "5kg": 1500
    },
    ingredients_en: ["Fermented Rice", "Fresh Organic Curry Leaves", "Cumin", "Hing", "Green Chilli", "Salt"],
    ingredients_ta: ["நொதித்த பச்சரிசி சாதம்", "இயற்கை கறிவேப்பிலை", "சீரகம்", "பெருங்காயம்", "பச்சை மிளகாய்", "உப்பு"],
    benefits_en: [
      "Rich in organic bio-available iron and antioxidants to fight anemia.",
      "Promotes hair growth, strengthens roots, and prevents premature greying.",
      "Supports liver detox and improves digestive gut microbiome.",
      "Delicate herbal aroma that turns irresistibly crunchy on frying."
    ],
    benefits_ta: [
      "இரத்த சோகையை போக்கும் இயற்கை இரும்புச்சத்து மற்றும் ஆன்டிஆக்ஸிடன்ட்கள் நிறைந்தது.",
      "கூந்தல் ஆரோக்கியத்தை மேம்படுத்தி வேர்க்கால்களை பலப்படுத்துகிறது.",
      "கல்லீரல் நச்சுக்களை நீக்கி உடலை சுறுசுறுப்பாக வைக்கிறது."
    ],
    spice_level: "Mild",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "palaya-sadam-veg",
    name_en: "Palaya Sadam Mixed Veg Vathal",
    name_ta: "பழைய சாதம் காய்கறி வத்தல்",
    subtitle_en: "Mixed Vegetable Rice Fryums",
    subtitle_ta: "காய்கறி கலவை பழைய சாத வத்தல்",
    category: "fermented",
    badge_en: "Nutrient Rich",
    badge_ta: "ஊட்டச்சத்து மிகுந்தது",
    badge_type: "gold",
    image: "assets/veg-rice-vadagam.jpg",
    short_desc_en: "Nutrient-packed vadagam enriched with fresh carrots, beans, and coriander blended into probiotic rice batter for wholesome family snacking.",
    short_desc_ta: "கேரட், பீன்ஸ், கொத்தமல்லி போன்ற காய்கறி சாறுகளுடன் சத்துக்கள் நிறைந்த பழைய சாதம் கொண்டு தயாரிக்கப்பட்ட மொறுமொறு வத்தல்.",
    prices: {
      "250g": 95,
      "500g": 180,
      "1kg": 340,
      "5kg": 1600
    },
    ingredients_en: ["Fermented Rice", "Carrot Puree", "Green Beans Paste", "Coriander", "Jeera", "Hing", "Salt"],
    ingredients_ta: ["பழைய சாதம்", "கேரட் சாறு", "பீன்ஸ் விழுது", "கொத்தமல்லி", "சீரகம்", "பெருங்காயம்", "உப்பு"],
    benefits_en: [
      "Rich in dietary vitamins A & C and fiber for kids and elders alike.",
      "Probiotic fermentation provides easy digestibility and cooling relief.",
      "Natural colorful presentation without any synthetic colors or flavors."
    ],
    benefits_ta: [
      "வைட்டமின்கள் மற்றும் நார்ச்சத்து நிறைந்த சத்தான உணவு.",
      "எளிதில் ஜீரணமாகும் தன்மை மற்றும் குடலுக்கு நன்மை சேர்க்கும் புரோபயாடிக்.",
      "எந்தவொரு செயற்கை நிறமூட்டியும் இல்லாத 100% இயற்கை தயாரிப்பு."
    ],
    spice_level: "Mild",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "palaya-sadam-masala",
    name_en: "Palaya Sadam Masala Vathal",
    name_ta: "பழைய சாதம் மசாலா வத்தல்",
    subtitle_en: "Traditional Spiced Masala Fryums",
    subtitle_ta: "பாரம்பரிய மசாலா பழைய சாத வத்தல்",
    category: "fermented",
    badge_en: "Flavor Burst",
    badge_ta: "நறுமண மசாலா",
    badge_type: "red",
    image: "assets/masala-rice-vadagam.jpg",
    short_desc_en: "Zesty traditional Chettinad spice blend of roasted red chilies, crushed cumin, fennel, and hing for an unforgettable spicy crunch.",
    short_desc_ta: "செட்டிநாட்டு காரசார மசாலா, பெருங்காயம் மற்றும் சீரகம் கலந்த நாவில் ஊறும் மொறுமொறுப்பான மசாலா வத்தல்.",
    prices: {
      "250g": 90,
      "500g": 170,
      "1kg": 320,
      "5kg": 1500
    },
    ingredients_en: ["Fermented Rice", "Guntur Red Chillies", "Fennel (Sombu)", "Cumin", "Asafoetida", "Curry Leaves", "Salt"],
    ingredients_ta: ["பழைய சாதம்", "மிளகாய் வற்றல்", "சோம்பு", "சீரகம்", "பெருங்காயம்", "கறிவேப்பிலை", "உப்பு"],
    benefits_en: [
      "Stimulates gastric enzymes and boosts appetite naturally.",
      "Perfect accompaniment with traditional Curd Rice (Thayir Sadam) or Rasam.",
      "Rich in metabolic-boosting spices and prebiotic rice goodness."
    ],
    benefits_ta: [
      "பசியை தூண்டி செரிமானத்தை துரிதப்படுத்துகிறது.",
      "தயிர் சாதம், ரசம் சாதத்திற்கு சிறந்த காரசார மொறுமொறுப்பான தொடுகறி.",
      "இயற்கையான மசாலாப் பொருட்களின் நறுமணம் நிறைந்தது."
    ],
    spice_level: "Medium Hot",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "tomato-rice-vadagam",
    name_en: "Tomato Rice Vadagam",
    name_ta: "தக்காளி அரிசி வத்தல்",
    subtitle_en: "Sun-ripened Tomato Vadagam",
    subtitle_ta: "சுவையான நாட்டு தக்காளி வத்தல்",
    category: "classic",
    badge_en: "Popular",
    badge_ta: "பிரபலமானது",
    badge_type: "red",
    image: "assets/tomato-rice-vadagam.jpg",
    short_desc_en: "Tangy country tomatoes pureed and tempered with cumin and mild red chilies into silky rice ribbons that puff generously when fried.",
    short_desc_ta: "நாட்டுத் தக்காளியின் புளிப்புச் சுவையும், சீரகத்தின் மணமும் கலந்த மொறுமொறு தக்காளி அரிசி வத்தல்.",
    prices: {
      "250g": 85,
      "500g": 160,
      "1kg": 300,
      "5kg": 1400
    },
    ingredients_en: ["Raw Rice", "Farm-fresh Country Tomatoes", "Red Chillies", "Cumin Seeds", "Hing", "Salt"],
    ingredients_ta: ["பச்சரிசி", "நாட்டுத் தக்காளி", "சிவப்பு மிளகாய்", "சீரகம்", "பெருங்காயம்", "உப்பு"],
    benefits_en: [
      "Rich in lycopene from fresh tomatoes for antioxidant cell protection.",
      "Delectable tangy-crispy flavor loved by all age groups."
    ],
    benefits_ta: [
      "தக்காளியில் உள்ள லைகோபீன் சத்து நிறைந்தது.",
      "அனைவரும் விரும்பும் சுவையான புளிப்பு-மொறுமொறுப்பு கலவை."
    ],
    spice_level: "Mild Tangy",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "onion-rice-vadagam",
    name_en: "Onion Rice Vadagam",
    name_ta: "சின்ன வெங்காய வத்தல்",
    subtitle_en: "Shallot Spiced Rice Fryums (Chinna Vengayam)",
    subtitle_ta: "மணமிக்க சின்ன வெங்காய அரிசி வத்தல்",
    category: "classic",
    badge_en: "Aromatics",
    badge_ta: "நறுமணம்",
    badge_type: "gold",
    image: "assets/onion-rice-vadagam.jpg",
    short_desc_en: "Crafted with sweet Tamil Nadu shallots (Chinna Vengayam) which caramelize delightfully into a fragrant, savory crisp upon frying.",
    short_desc_ta: "தமிழ்நாட்டு சின்ன வெங்காயத்தின் இனிமையான மணமும் காரமும் நிறைந்த அசத்தலான வத்தல்.",
    prices: {
      "250g": 90,
      "500g": 170,
      "1kg": 320,
      "5kg": 1500
    },
    ingredients_en: ["Rice Flour", "Fresh Shallots (Small Onion)", "Green Chillies", "Cumin", "Hing", "Salt"],
    ingredients_ta: ["அரிசி மாவு", "சின்ன வெங்காயம்", "பச்சை மிளகாய்", "சீரகம்", "பெருங்காயம்", "உப்பு"],
    benefits_en: [
      "Shallots offer flavonoids that support immune defenses and blood circulation.",
      "Irresistible aroma that elevates every traditional South Indian meal."
    ],
    benefits_ta: [
      "சின்ன வெங்காயம் உடலுக்கு குளிர்ச்சியையும் இரத்த ஓட்ட சீரமைப்பையும் தருகிறது."
    ],
    spice_level: "Medium",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "herbal-greens-vadagam",
    name_en: "Herbal / Greens Rice Vadagam",
    name_ta: "முடக்கத்தான் மூலிகை வத்தல்",
    subtitle_en: "Mudakathan & Thuthuvalai Herbal Fryums",
    subtitle_ta: "பாரம்பரிய முடக்கத்தான் & தூதுவளை மூலிகை வத்தல்",
    category: "spiced",
    badge_en: "Medicinal",
    badge_ta: "மருத்துவ குணம்",
    badge_type: "emerald",
    image: "assets/herbal-rice-vadagam.jpg",
    short_desc_en: "Ancient Siddha herbal formula infused with fresh Mudakathan (Balloon Vine) and Thuthuvalai greens to relieve joint stiffness and respiratory tightness.",
    short_desc_ta: "மூட்டு வலி மற்றும் தசை இறுக்கத்தை போக்கும் முடக்கத்தான் மற்றும் சளி தொல்லையை நீக்கும் தூதுவளை மூலிகைகள் சேர்ந்தது.",
    prices: {
      "250g": 105,
      "500g": 200,
      "1kg": 380,
      "5kg": 1800
    },
    ingredients_en: ["Raw Rice", "Fresh Mudakathan Keerai", "Thuthuvalai Leaf Puree", "Jeera", "Hing", "Pepper", "Salt"],
    ingredients_ta: ["பச்சரிசி", "முடக்கத்தான் கீரை சாறு", "தூதுவளை சாறு", "சீரகம்", "பெருங்காயம்", "மிளகு", "உப்பு"],
    benefits_en: [
      "Mudakathan relieves joint stiffness, knee pain, and muscular inflammation.",
      "Thuthuvalai supports lung health and clears persistent phlegm.",
      "Combines Siddha medicinal wellness with daily culinary pleasure."
    ],
    benefits_ta: [
      "முடக்கத்தான் மூட்டு வலி மற்றும் வீக்கங்களை குறைக்கும் ஆற்றல் கொண்டது.",
      "தூதுவளை நாள்பட்ட சளி மற்றும் சுவாசக் கோளாறுகளுக்கு நிவாரணம் அளிக்கிறது."
    ],
    spice_level: "Mild Herbal",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "sago-rice-vadagam",
    name_en: "Sago & Rice Vadagam (Javvarisi)",
    name_ta: "ஜவ்வரிசி & அரிசி வத்தல்",
    subtitle_en: "Crispy Sago Pearl Fryums",
    subtitle_ta: "வெள்ளையான மொறுமொறு ஜவ்வரிசி வத்தல்",
    category: "classic",
    badge_en: "Ultra Crisp",
    badge_ta: "அதி மொறுமொறுப்பு",
    badge_type: "gold",
    image: "assets/sago-rice-vadagam.jpg",
    short_desc_en: "Pure white tapioca sago pearls paired with fine rice batter. Fries up ultra-light, airy, and melt-in-the-mouth crunchy.",
    short_desc_ta: "முத்து போன்ற ஜவ்வரிசி மற்றும் அரிசி மாவு கலந்த வாயில் கரையும் அதி மொறுமொறுப்பான பாரம்பரிய வத்தல்.",
    prices: {
      "250g": 85,
      "500g": 160,
      "1kg": 300,
      "5kg": 1400
    },
    ingredients_en: ["Pure Tapioca Sago (Javvarisi)", "Raw Rice Flour", "Green Chilli Paste", "Cumin", "Hing", "Salt"],
    ingredients_ta: ["சுத்தமான ஜவ்வரிசி", "பச்சரிசி மாவு", "பச்சை மிளகாய் சாறு", "சீரகம்", "பெருங்காயம்", "உப்பு"],
    benefits_en: [
      "Provides quick and light energy, gentle on the digestive tract.",
      "Classic tea-time and feast favorite with pristine white crunch."
    ],
    benefits_ta: [
      "எளிதில் செரிமானம் ஆகக்கூடியது மற்றும் உடனடி உற்சாகம் தரக்கூடியது."
    ],
    spice_level: "Mild",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "garlic-sesame-vadagam",
    name_en: "Garlic & Sesame Rice Vadagam",
    name_ta: "பூண்டு எள்ளு அரிசி வத்தல்",
    subtitle_en: "Garlic & Roasted Sesame Vadagam",
    subtitle_ta: "பூண்டு மற்றும் வறுத்த எள்ளு வத்தல்",
    category: "spiced",
    badge_en: "Calcium Rich",
    badge_ta: "கால்சியம் நிறைந்தது",
    badge_type: "gold",
    image: "assets/sesame-rice-vadagam.jpg",
    short_desc_en: "Crunchy toasted white sesame seeds combined with pungent garlic cloves for exceptional nutty flavor and high bone-calcium benefits.",
    short_desc_ta: "வறுத்த எள்ளின் சுவையும், பூண்டின் மணமும் இணைந்த கால்சியம் சத்து நிறைந்த சுவையான வத்தல்.",
    prices: {
      "250g": 90,
      "500g": 170,
      "1kg": 320,
      "5kg": 1500
    },
    ingredients_en: ["Rice Flour", "White Sesame Seeds (Ellu)", "Country Garlic", "Cumin", "Hing", "Salt"],
    ingredients_ta: ["அரிசி மாவு", "வெள்ளை எள்ளு", "நாட்டுப் பூண்டு", "சீரகம்", "பெருங்காயம்", "உப்பு"],
    benefits_en: [
      "Sesame seeds provide high dietary calcium and magnesium for bone strength.",
      "Garlic supports heart vitality and blood pressure management."
    ],
    benefits_ta: [
      "எள்ளில் உள்ள இயற்கை கால்சியம் எலும்புகளுக்கு வலிமை சேர்க்கிறது."
    ],
    spice_level: "Medium",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  },
  {
    id: "pepper-jeera-vadagam",
    name_en: "Pepper Jeera Vadagam",
    name_ta: "மிளகு சீரக அரிசி வத்தல்",
    subtitle_en: "Digestive Black Pepper & Cumin Vadagam",
    subtitle_ta: "செரிமான மிளகு சீரக வத்தல்",
    category: "spiced",
    badge_en: "Digestive Care",
    badge_ta: "செரிமான பராமரிப்பு",
    badge_type: "gold",
    image: "assets/jeera-rice-vadagam.jpg",
    short_desc_en: "The time-tested South Indian grandmother formulation of whole cumin seeds and cracked black pepper for effortless digestion and appetite stimulation.",
    short_desc_ta: "பாட்டி வைத்திய முறையில் சீரகம் மற்றும் மிளகு சேர்த்து செய்யப்பட்ட செரிமானத்திற்கு உகந்த வத்தல்.",
    prices: {
      "250g": 90,
      "500g": 170,
      "1kg": 320,
      "5kg": 1500
    },
    ingredients_en: ["Rice Batter", "Whole Cumin (Jeera)", "Cracked Black Pepper", "Compounded Asafoetida", "Salt"],
    ingredients_ta: ["அரிசி மாவு", "சீரகம்", "மிளகு", "பெருங்காயம்", "உப்பு"],
    benefits_en: [
      "Stimulates digestive fire (Agni) and eliminates gaseous accumulation.",
      "Provides warmth during rainy and cold seasons."
    ],
    benefits_ta: [
      "செரிமான சக்தியை தூண்டுகிறது மற்றும் வயிற்று உப்புசத்தை நீக்குகிறது."
    ],
    spice_level: "Medium",
    drying_method: "Sun-Dried",
    shelf_life: "12 Months",
    export_ready: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DATA };
}
