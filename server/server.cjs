const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ============================================================
// DEMO AUTHENTICATION
// ============================================================
// This prototype keeps accounts in memory so no database package
// is required. Accounts reset when the backend restarts.

const users = new Map();
const sessions = new Map();

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, storedHash) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}


// ============================================================
// BASIC ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Yatra AI backend is running!",
  });
});


// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

app.post("/api/auth/register", (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    if (users.has(email)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const { salt, hash } = hashPassword(password);
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      salt,
      passwordHash: hash,
    };

    users.set(email, user);

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, user.id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create the account.",
    });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const user = users.get(email);

    if (!user || !password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    let valid = false;
    try {
      valid = verifyPassword(password, user.salt, user.passwordHash);
    } catch {
      valid = false;
    }

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, user.id);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;

  if (token) sessions.delete(token);

  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;

  const userId = token ? sessions.get(token) : null;
  const user = userId
    ? [...users.values()].find(item => item.id === userId)
    : null;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  return res.json({
    success: true,
    user: publicUser(user),
  });
});


// ============================================================
// DESTINATION KNOWLEDGE BASE
// ============================================================

const destinationData = {

  Kolkata: {
    bestTime: "October to March",
    bestTimeReason:
      "The weather is generally more comfortable for sightseeing during the cooler months.",

    food: [
      ["Kathi Roll", "A famous Kolkata street-food preparation.", true],
      ["Kolkata Biryani", "A distinctive Kolkata-style biryani traditionally associated with potato and meat.", true],
      ["Macher Jhol", "Traditional Bengali fish curry.", true],
      ["Mishti Doi", "Sweet fermented Bengali yogurt.", true],
      ["Rasgulla", "Soft chhena-based sweet served in syrup.", true],
      ["Shorshe Ilish", "Hilsa prepared with mustard, a classic Bengali preparation.", true],
    ],

    foodAreas: [
      ["Park Street", "Major dining and restaurant district."],
      ["New Market", "Historic market area with food shops and local snacks."],
      ["Dacres Lane", "Historic street-food area known for inexpensive meals."],
    ],

    famousFor: [
      "Bengali cuisine",
      "Durga Puja",
      "Literature and arts",
      "Colonial architecture",
      "Victoria Memorial",
      "Historic neighbourhoods",
    ],

    souvenirs: [
      ["Bengali sweets", "Traditional edible souvenir.", "Established Bengali sweet shops."],
      ["Kantha work", "Traditional Bengali embroidered textile.", "Established handicraft stores."],
      ["Terracotta crafts", "Traditional Bengal-style craft items.", "Handicraft markets and established craft stores."],
      ["Books", "Kolkata has a strong literary and book-market culture.", "College Street book market."],
    ],

    stays: [
      ["New Market / Esplanade", "Central area with many budget and mid-range accommodation options."],
      ["Bani Park-style central areas", "For Kolkata, prefer central neighbourhoods close to your sightseeing route."],
      ["Park Street", "Convenient for restaurants, transport and central sightseeing."],
    ],

    safety: [
      "Keep valuables secure in crowded markets.",
      "Confirm taxi or transport fares before travelling.",
      "Use established shops when purchasing expensive handicrafts.",
    ],
  },


  Varanasi: {
    bestTime: "October to March",
    bestTimeReason:
      "The cooler months are generally more comfortable for walking around the ghats and exploring the city.",

    food: [
      ["Kachori Sabzi", "Popular North Indian breakfast found across Varanasi.", true],
      ["Banarasi Tamatar Chaat", "A distinctive Varanasi-style chaat preparation.", true],
      ["Banarasi Lassi", "Traditional thick yogurt-based drink.", true],
      ["Banarasi Paan", "A famous cultural and culinary specialty of the city.", true],
      ["Malaiyyo", "Seasonal airy milk-based dessert associated with Varanasi.", true],
    ],

    foodAreas: [
      ["Assi", "Popular traveller area with cafes and local food."],
      ["Godowlia", "Busy central area with numerous local food options."],
      ["Lanka", "Student-oriented area with many affordable food choices."],
    ],

    famousFor: [
      "Ganga Ghats",
      "Ganga Aarti",
      "Banarasi silk",
      "Banarasi paan",
      "Religious heritage",
      "Classical music and cultural traditions",
    ],

    souvenirs: [
      ["Banarasi silk", "Traditional silk textile associated with Varanasi.", "Established handloom stores."],
      ["Brass handicrafts", "Traditional decorative metal crafts.", "Established handicraft stores."],
      ["Wooden handicrafts", "Traditional decorative craft products.", "Local handicraft markets."],
    ],

    stays: [
      ["Assi", "Popular with budget travellers, hostels and guesthouses."],
      ["Godowlia", "Central location close to major city activity."],
      ["Cantonment", "Useful if you prefer easier road access and larger hotels."],
    ],

    safety: [
      "Agree on boat prices before starting a boat ride.",
      "Be cautious with unsolicited guides around crowded tourist areas.",
      "Respect local religious customs around temples and ghats.",
    ],
  },


  Jaipur: {
    bestTime: "October to March",
    bestTimeReason:
      "Winter is generally more comfortable for exploring forts, palaces and outdoor markets.",

    food: [
      ["Dal Baati Churma", "One of Rajasthan's best-known traditional meals.", true],
      ["Pyaaz Kachori", "Crispy pastry filled with spiced onion.", true],
      ["Ghevar", "Traditional Rajasthani sweet.", true],
      ["Laal Maas", "Traditional spicy Rajasthani meat preparation.", true],
    ],

    foodAreas: [
      ["Johari Bazaar", "Historic market area with traditional food and shopping."],
      ["Bapu Bazaar", "Popular shopping district with local snacks."],
      ["MI Road", "Central area with restaurants and cafes."],
    ],

    famousFor: [
      "Hawa Mahal",
      "Amber Fort",
      "City Palace",
      "Rajasthani cuisine",
      "Traditional handicrafts",
      "Jewellery",
    ],

    souvenirs: [
      ["Blue pottery", "Decorative pottery strongly associated with Jaipur.", "Established handicraft shops."],
      ["Block-print textiles", "Traditional Rajasthan textile products.", "Bapu Bazaar and established textile stores."],
      ["Jewellery", "Jaipur is known for jewellery and gemstone-related crafts.", "Established jewellery stores and Johari Bazaar."],
    ],

    stays: [
      ["Bani Park", "Popular area with a wide range of budget and mid-range stays."],
      ["MI Road", "Central location with convenient transport."],
      ["C-Scheme", "Good area for restaurants and modern amenities."],
    ],

    safety: [
      "Compare prices before buying handicrafts.",
      "Use established jewellery stores for expensive purchases.",
      "Carry water during outdoor sightseeing.",
    ],
  },


  Goa: {
    bestTime: "November to February",
    bestTimeReason:
      "The cooler, drier season is generally popular for beaches, sightseeing and outdoor activities.",

    food: [
      ["Goan Fish Curry", "Signature Goan preparation combining fish, coconut and regional spices.", true],
      ["Prawn Balchão", "Spicy and tangy Goan prawn preparation.", true],
      ["Bebinca", "Traditional layered Goan dessert.", true],
      ["Pork Vindaloo", "Famous Goan dish with Portuguese culinary influence.", true],
    ],

    foodAreas: [
      ["Panaji", "Capital city with traditional and contemporary dining."],
      ["Mapusa", "Important local market and food area."],
      ["Margao", "Major commercial centre with local Goan food."],
    ],

    famousFor: [
      "Beaches",
      "Goan cuisine",
      "Portuguese-influenced architecture",
      "Water sports",
      "Nightlife",
      "Cashew products",
    ],

    souvenirs: [
      ["Cashew products", "Popular Goan edible purchase.", "Established local stores and markets."],
      ["Goan handicrafts", "Traditional craft products.", "Local markets and handicraft stores."],
      ["Decorative tiles", "Portuguese-influenced decorative design.", "Established design and handicraft stores."],
    ],

    stays: [
      ["Calangute / Baga", "Large selection of budget and mid-range accommodation."],
      ["Candolim", "Good balance of beaches, restaurants and accommodation."],
      ["Panaji", "Useful for culture, heritage and central Goa."],
    ],

    safety: [
      "Confirm taxi or rental charges before travelling.",
      "Use safety equipment during water activities.",
      "Do not leave valuables unattended on beaches.",
    ],
  },


  Delhi: {
    bestTime: "October to March",
    bestTimeReason:
      "The cooler months are generally more comfortable for sightseeing.",

    food: [
      ["Chole Bhature", "Popular North Indian dish strongly associated with Delhi food culture.", true],
      ["Paratha", "Traditional stuffed flatbread popular in Old Delhi.", true],
      ["Chaat", "Delhi has a strong street-food and chaat culture.", true],
      ["Butter Chicken", "Popular North Indian restaurant dish associated with Delhi's food culture.", true],
    ],

    foodAreas: [
      ["Chandni Chowk", "Historic food and shopping district."],
      ["Karol Bagh", "Popular commercial and food area."],
      ["Connaught Place", "Major central dining and shopping district."],
    ],

    famousFor: [
      "Red Fort",
      "India Gate",
      "Old Delhi",
      "Mughal heritage",
      "Street food",
      "Museums and monuments",
    ],

    souvenirs: [
      ["Spices", "Popular edible souvenir.", "Old Delhi markets and established stores."],
      ["Handicrafts", "Wide variety of Indian craft products.", "Dilli Haat and established handicraft stores."],
      ["Traditional textiles", "Indian fabrics and craft products.", "Dilli Haat and established stores."],
    ],

    stays: [
      ["Paharganj", "Large range of budget accommodation."],
      ["Karol Bagh", "Good selection of budget and mid-range stays."],
      ["Connaught Place", "Central but generally more expensive."],
    ],

    safety: [
      "Keep belongings secure in crowded markets and metro stations.",
      "Use app-based or official transport where practical.",
      "Be cautious of unsolicited tour guides.",
    ],
  },


  Mumbai: {
    bestTime: "October to February",
    bestTimeReason:
      "The post-monsoon and winter period is generally more comfortable for sightseeing.",

    food: [
      ["Vada Pav", "Iconic Mumbai street food.", true],
      ["Pav Bhaji", "Popular Mumbai street-food preparation.", true],
      ["Bombay Sandwich", "Classic Mumbai snack.", true],
      ["Misal Pav", "Spicy Maharashtrian dish served with pav.", true],
    ],

    foodAreas: [
      ["Crawford Market area", "Historic market district with food options."],
      ["Colaba", "Popular tourist and dining area."],
      ["Dadar", "Important local food and shopping area."],
    ],

    famousFor: [
      "Gateway of India",
      "Marine Drive",
      "Bollywood",
      "Street food",
      "Colonial architecture",
      "Local trains",
    ],

    souvenirs: [
      ["Chikankari and textiles", "Indian textile products available in Mumbai markets.", "Established textile stores."],
      ["Local handicrafts", "Indian decorative craft products.", "Government and established handicraft stores."],
      ["Indian snacks", "Packaged regional snacks make practical souvenirs.", "Established food stores."],
    ],

    stays: [
      ["Andheri", "Wide selection of budget and mid-range accommodation."],
      ["Dadar", "Convenient central location for many travellers."],
      ["Colaba", "Excellent for tourist attractions but can be more expensive."],
    ],

    safety: [
      "Keep belongings secure in crowded railway stations.",
      "Avoid unverified taxi or tour offers.",
      "Allow extra travel time because of traffic.",
    ],
  },


  Kerala: {
    bestTime: "October to March",
    bestTimeReason:
      "The cooler and relatively drier season is popular for exploring Kerala.",

    food: [
      ["Appam with Stew", "Classic Kerala combination.", true],
      ["Puttu and Kadala Curry", "Traditional Kerala breakfast.", true],
      ["Kerala Sadya", "Traditional vegetarian feast served during important occasions.", true],
      ["Fish Curry", "Popular regional preparation.", true],
    ],

    foodAreas: [
      ["Kochi", "Major food and cultural centre."],
      ["Alappuzha", "Popular area for traditional Kerala food."],
      ["Thiruvananthapuram", "Wide selection of traditional cuisine."],
    ],

    famousFor: [
      "Backwaters",
      "Ayurveda",
      "Coconut-based cuisine",
      "Kathakali",
      "Houseboats",
      "Tea and spice regions",
    ],

    souvenirs: [
      ["Spices", "Kerala is well known for spice cultivation and trade.", "Established spice markets."],
      ["Coir products", "Traditional products made from coconut fibre.", "Local handicraft stores."],
      ["Traditional handicrafts", "Regional decorative products.", "Government and established handicraft stores."],
    ],

    stays: [
      ["Alappuzha", "Good base for backwater experiences and budget accommodation."],
      ["Kochi", "Wide range of budget and mid-range stays."],
      ["Munnar", "Useful for travellers focusing on tea estates and hills."],
    ],

    safety: [
      "Use registered operators for houseboat and adventure activities.",
      "Carry mosquito protection in backwater areas.",
      "Check weather conditions before outdoor activities.",
    ],
  },


  Manali: {
    bestTime: "March to June and October to February",
    bestTimeReason:
      "Different seasons offer different experiences, from pleasant mountain weather to snow.",

    food: [
      ["Siddu", "Traditional Himachali steamed bread.", true],
      ["Dham", "Traditional Himachali festive meal.", true],
      ["Tudkiya Bhath", "Traditional Himachali rice preparation.", true],
    ],

    foodAreas: [
      ["Old Manali", "Popular traveller area with cafes and local food."],
      ["Mall Road", "Central commercial and food area."],
    ],

    famousFor: [
      "Himalayan scenery",
      "Solang Valley",
      "Rohtang region",
      "Adventure activities",
      "Mountain cafes",
    ],

    souvenirs: [
      ["Woollen products", "Popular Himalayan souvenir.", "Local markets and established stores."],
      ["Himachali handicrafts", "Traditional regional craft products.", "Local handicraft stores."],
      ["Local herbal products", "Common regional shopping category.", "Established local stores."],
    ],

    stays: [
      ["Old Manali", "Good for cafes and budget guesthouses."],
      ["Vashisht", "Popular for budget stays and a quieter atmosphere."],
      ["Manali town", "Convenient for transport and central sightseeing."],
    ],

    safety: [
      "Check mountain road and weather conditions.",
      "Use registered operators for adventure activities.",
      "Carry warm clothing during colder months.",
    ],
  },


  Shimla: {
    bestTime: "March to June and October to February",
    bestTimeReason:
      "Spring and summer are pleasant, while winter offers cold weather and possible snow.",

    food: [
      ["Chana Madra", "Traditional Himachali preparation.", true],
      ["Dham", "Traditional Himachali festive meal.", true],
      ["Siddu", "Traditional steamed Himachali bread.", true],
    ],

    foodAreas: [
      ["Mall Road", "Main central shopping and dining district."],
      ["Lakkar Bazaar", "Traditional shopping area with local products."],
    ],

    famousFor: [
      "The Ridge",
      "Mall Road",
      "Colonial architecture",
      "Himalayan scenery",
      "Toy train",
    ],

    souvenirs: [
      ["Wooden crafts", "Traditional Himalayan craft products.", "Lakkar Bazaar."],
      ["Woollens", "Popular cold-weather purchase.", "Local markets."],
      ["Himachali handicrafts", "Regional craft products.", "Established handicraft shops."],
    ],

    stays: [
      ["Shimla town", "Convenient for central sightseeing."],
      ["Chotta Shimla", "Quieter accommodation area."],
      ["Panthaghati", "Useful for travellers looking beyond the busiest centre."],
    ],

    safety: [
      "Walk carefully on steep roads.",
      "Check weather and road conditions before travelling.",
      "Keep valuables secure in crowded tourist areas.",
    ],
  },


  Darjeeling: {
    bestTime: "March to May and October to November",
    bestTimeReason:
      "Spring and autumn are generally popular for clear mountain views and pleasant weather.",

    food: [
      ["Momos", "Popular Himalayan dumplings.", true],
      ["Thukpa", "Warm noodle soup popular in the Himalayan region.", true],
      ["Darjeeling Tea", "The region is famous for tea.", true],
    ],

    foodAreas: [
      ["Chowrasta / Mall area", "Central tourist and dining district."],
      ["Chowk Bazaar", "Local market area with food and shopping."],
    ],

    famousFor: [
      "Darjeeling Tea",
      "Kanchenjunga views",
      "Toy Train",
      "Himalayan culture",
      "Tea gardens",
    ],

    souvenirs: [
      ["Darjeeling tea", "The region's most famous edible souvenir.", "Established tea stores."],
      ["Woollens", "Useful mountain-weather souvenir.", "Local markets."],
      ["Handicrafts", "Regional decorative products.", "Established handicraft stores."],
    ],

    stays: [
      ["Chowrasta area", "Convenient but potentially more expensive."],
      ["Darjeeling town", "Wide range of guesthouses and hotels."],
      ["Lebong area", "Quieter alternative outside the busiest centre."],
    ],

    safety: [
      "Allow extra time for mountain roads.",
      "Carry warm clothing.",
      "Check weather before sightseeing.",
    ],
  },


  Agra: {
    bestTime: "October to March",
    bestTimeReason:
      "Cooler weather is generally better for visiting the Taj Mahal and other outdoor heritage sites.",

    food: [
      ["Petha", "Famous sweet associated with Agra.", true],
      ["Mughlai cuisine", "Agra has strong Mughal culinary influence.", true],
      ["Bedai", "Popular North Indian breakfast preparation.", true],
    ],

    foodAreas: [
      ["Sadar Bazaar", "Major shopping and food area."],
      ["Taj Ganj", "Tourist area around the Taj Mahal."],
    ],

    famousFor: [
      "Taj Mahal",
      "Agra Fort",
      "Mughal heritage",
      "Marble crafts",
      "Petha",
    ],

    souvenirs: [
      ["Marble inlay", "Traditional Agra craft.", "Established handicraft stores."],
      ["Petha", "Famous local sweet.", "Established sweet shops."],
      ["Leather goods", "Common shopping category in Agra.", "Established markets and stores."],
    ],

    stays: [
      ["Taj Ganj", "Convenient for Taj Mahal access and budget stays."],
      ["Sadar Bazaar", "Good central shopping and accommodation area."],
      ["Fatehabad Road", "Many hotel options."],
    ],

    safety: [
      "Use official ticketing channels for major monuments.",
      "Be cautious with unsolicited guides.",
      "Compare prices before purchasing handicrafts.",
    ],
  },


  Rishikesh: {
    bestTime: "September to November and February to June",
    bestTimeReason:
      "These periods are popular for outdoor activities and generally comfortable weather.",

    food: [
      ["Aloo Puri", "Popular North Indian meal.", true],
      ["Garhwali cuisine", "Regional cuisine from Uttarakhand.", true],
      ["Lassi", "Popular yogurt-based drink.", true],
    ],

    foodAreas: [
      ["Tapovan", "Popular traveller and cafe area."],
      ["Laxman Jhula area", "Major tourist and food district."],
      ["Ram Jhula area", "Popular riverside area."],
    ],

    famousFor: [
      "Yoga",
      "River rafting",
      "Ganga",
      "Ashrams",
      "Himalayan foothills",
    ],

    souvenirs: [
      ["Yoga products", "Popular shopping category.", "Established stores in traveller areas."],
      ["Spiritual handicrafts", "Traditional decorative products.", "Local markets."],
      ["Woollens", "Useful Himalayan-region souvenir.", "Local markets."],
    ],

    stays: [
      ["Tapovan", "Large range of budget hostels and guesthouses."],
      ["Swarg Ashram", "Good for travellers interested in yoga and spiritual experiences."],
      ["Rishikesh town", "Convenient for transport and local markets."],
    ],

    safety: [
      "Use registered rafting operators.",
      "Follow river-safety instructions.",
      "Avoid entering restricted river areas.",
    ],
  },


  Udaipur: {
    bestTime: "October to March",
    bestTimeReason:
      "Cooler weather is generally better for exploring lakes, palaces and outdoor attractions.",

    food: [
      ["Dal Baati Churma", "Traditional Rajasthani meal.", true],
      ["Gatte ki Sabzi", "Popular Rajasthani preparation.", true],
      ["Mawa Kachori", "Traditional sweet preparation.", true],
    ],

    foodAreas: [
      ["Hathi Pol", "Popular local shopping and food area."],
      ["Old City", "Historic centre with many local food options."],
    ],

    famousFor: [
      "Lake Pichola",
      "City Palace",
      "Mewar heritage",
      "Lakes",
      "Rajasthani culture",
    ],

    souvenirs: [
      ["Miniature paintings", "Traditional Rajasthani art form.", "Established art and handicraft stores."],
      ["Textiles", "Traditional Rajasthan fabrics.", "Hathi Pol and established stores."],
      ["Handicrafts", "Regional craft products.", "Old City markets."],
    ],

    stays: [
      ["Old City", "Good for budget guesthouses and heritage atmosphere."],
      ["Hathi Pol", "Convenient for shopping and central sightseeing."],
      ["Lake-area neighbourhoods", "Useful for travellers prioritising lake views."],
    ],

    safety: [
      "Compare prices before purchasing artwork.",
      "Use registered boat operators.",
      "Keep valuables secure in crowded markets.",
    ],
  },

};


// ============================================================
// ADDITIONAL DESTINATION FALLBACKS
// ============================================================

const commonDestinationData = {

  Leh: ["June to September", "Local Ladakhi food", "Tibetan handicrafts"],
  Meghalaya: ["October to April", "Khasi cuisine", "Bamboo handicrafts"],
  Sikkim: ["March to May and October to December", "Momos and thukpa", "Traditional handicrafts"],
  Gangtok: ["March to May and October to December", "Momos and thukpa", "Handicrafts"],
  Andaman: ["October to May", "Seafood", "Shell and island handicrafts"],
  Lakshadweep: ["October to May", "Seafood", "Local handicrafts"],
  Munnar: ["September to May", "Kerala cuisine", "Tea and spices"],
  Alappuzha: ["October to February", "Kerala cuisine", "Coir products"],
  Ooty: ["October to June", "South Indian cuisine", "Tea and handmade products"],
  Kodaikanal: ["October to June", "South Indian cuisine", "Homemade chocolates"],
  Varanasi: ["October to March", "Banarasi cuisine", "Banarasi silk"],
  Jodhpur: ["October to March", "Rajasthani cuisine", "Bandhani textiles"],
  Jaisalmer: ["October to March", "Rajasthani cuisine", "Desert handicrafts"],
  Kashmir: ["April to October", "Kashmiri cuisine", "Pashmina and handicrafts"],
  Srinagar: ["April to October", "Kashmiri cuisine", "Kashmiri handicrafts"],
  Amritsar: ["October to March", "Punjabi cuisine", "Phulkari textiles"],
  Pune: ["October to February", "Maharashtrian cuisine", "Traditional handicrafts"],
  Hyderabad: ["October to February", "Hyderabadi biryani", "Pearls and handicrafts"],
  Bengaluru: ["October to February", "South Indian cuisine", "Silk and handicrafts"],
  Mysore: ["October to February", "Mysore Pak", "Sandalwood products"],
  Hampi: ["October to February", "South Indian cuisine", "Local handicrafts"],
  Bhubaneswar: ["October to February", "Odia cuisine", "Stone and appliqué crafts"],
  Puri: ["October to February", "Odia cuisine", "Pattachitra art"],
  Guwahati: ["October to April", "Assamese cuisine", "Assam silk"],
  Kaziranga: ["November to April", "Assamese cuisine", "Assamese handicrafts"],
};


// ============================================================
// NORMALIZE DESTINATION
// ============================================================

function normalizeDestination(destination) {

  if (!destination) return "";

  const value = destination.trim().toLowerCase();

  const aliases = {
    "calcutta": "Kolkata",
    "kolkata": "Kolkata",
    "benaras": "Varanasi",
    "banaras": "Varanasi",
    "varanasi": "Varanasi",
    "new delhi": "Delhi",
    "delhi": "Delhi",
    "goa": "Goa",
    "jaipur": "Jaipur",
    "mumbai": "Mumbai",
    "bombay": "Mumbai",
    "kerala": "Kerala",
    "manali": "Manali",
    "shimla": "Shimla",
    "darjeeling": "Darjeeling",
    "agra": "Agra",
    "rishikesh": "Rishikesh",
    "udaipur": "Udaipur",
  };

  return aliases[value] || destination.trim();
}


// ============================================================
// LOCAL INSIGHTS
// ============================================================

app.post("/api/local-insights", async (req, res) => {

  try {

    const destination =
      normalizeDestination(req.body.destination);

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required.",
      });
    }

    const info =
      destinationData[destination];

    if (info) {

      return res.json({
        success: true,
        verified: true,
        destination,
        insights: {
          destination,
          ...info,

          food: info.food.map(item => ({
            name: item[0],
            description: item[1],
            mustTry: item[2],
          })),

          foodAreas: info.foodAreas.map(item => ({
            name: item[0],
            description: item[1],
          })),

          souvenirs: info.souvenirs.map(item => ({
            item: item[0],
            description: item[1],
            whereToBuy: item[2],
          })),

          stays: info.stays.map(item => ({
            area: item[0],
            recommendation: item[1],
          })),
        },
      });

    }


    const fallback =
      commonDestinationData[destination];

    if (fallback) {

      return res.json({
        success: true,
        verified: true,
        destination,

        insights: {

          destination,

          bestTime: fallback[0],

          bestTimeReason:
            "This is a general recommended travel period. Weather and local conditions can vary.",

          food: [
            {
              name: fallback[1],
              description:
                "A local food category worth exploring.",
              mustTry: true,
            },
          ],

          foodAreas: [],

          famousFor: [
            fallback[1],
            fallback[2],
          ],

          souvenirs: [
            {
              item: fallback[2],
              description:
                "A commonly associated local shopping category.",
              whereToBuy:
                "Established local markets and handicraft stores.",
            },
          ],

          stays: [
            {
              area:
                `${destination} central area`,
              recommendation:
                "Look for well-reviewed budget accommodation close to your planned sightseeing area. Compare recent reviews and total booking cost.",
            },
          ],

          safety: [
            "Check current local conditions before travelling.",
            "Use established transport and accommodation providers.",
            "Keep valuables secure in crowded areas.",
          ],
        },

      });

    }


    return res.json({

      success: true,
      verified: false,

      destination,

      insights: {

        destination,

        bestTime: "Information unavailable",

        bestTimeReason:
          "Yatra AI does not currently have enough curated information for this destination.",

        food: [],
        foodAreas: [],
        famousFor: [],
        souvenirs: [],
        stays: [],

        safety: [
          "Verify local information before making bookings or purchases.",
          "Use established accommodation and transport providers.",
        ],

      },

      message:
        "Verified Local Insights are not currently available for this destination.",

    });

  } catch (error) {

    console.error(
      "Local Insights Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to load Local Insights.",

      error: error.message,

    });

  }

});


// ============================================================
// TRIP BUDGET
// ============================================================

function calculateBudget(
  startDate,
  endDate,
  travelers,
  budget
) {

  const start = new Date(startDate);
  const end = new Date(endDate);

  let days =
    Math.ceil(
      (end - start) /
      (1000 * 60 * 60 * 24)
    );

  if (days < 1) days = 1;

  const people =
    Number(travelers) || 1;

  let dailyBudget;

  switch (budget) {

    case "budget":
      dailyBudget = 1800;
      break;

    case "moderate":
      dailyBudget = 3500;
      break;

    case "premium":
      dailyBudget = 6500;
      break;

    case "luxury":
      dailyBudget = 12000;
      break;

    default:
      dailyBudget = 2500;
  }

  const base =
    dailyBudget *
    days *
    people;

  const accommodation =
    Math.round(base * 0.35);

  const food =
    Math.round(base * 0.25);

  const transportation =
    Math.round(base * 0.15);

  const activities =
    Math.round(base * 0.20);

  const miscellaneous =
    Math.round(base * 0.05);

  const total =
    accommodation +
    food +
    transportation +
    activities +
    miscellaneous;

  return {
    days,
    travelers: people,
    accommodation,
    food,
    transportation,
    activities,
    miscellaneous,
    total,
  };

}


// ============================================================
// AI TRIP PLANNER
// ============================================================

app.post("/api/plan-trip", async (req, res) => {

  try {

    const {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      interests,
    } = req.body;

    // ------------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------------

    if (
      !destination ||
      !startDate ||
      !endDate
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Destination and travel dates are required.",
      });

    }

    // ------------------------------------------------------------
    // CALCULATE BUDGET SEPARATELY
    // ------------------------------------------------------------
    // IMPORTANT:
    // The AI does NOT calculate or generate any expenses.
    // The application's Trip Budget section handles this.

    const budgetBreakdown =
      calculateBudget(
        startDate,
        endDate,
        travelers,
        budget
      );

    const days =
      budgetBreakdown.days;


    // ------------------------------------------------------------
    // AI PROMPT
    // ------------------------------------------------------------

    const prompt = `

You are Yatra AI, a practical Indian travel planner.

Create a realistic day-by-day travel itinerary.

TRIP DETAILS:

Destination: ${destination}

Start date: ${startDate}

End date: ${endDate}

Number of travelers: ${travelers || 1}

Budget category: ${budget || "moderate"}

Interests:
${interests || "general sightseeing"}


============================================================
IMPORTANT ITINERARY RULES
============================================================

There are exactly ${days} travel days.

You MUST create exactly these day headings:

${Array.from(
  { length: days },
  (_, i) => `Day ${i + 1}`
).join("\n")}

Never repeat a day number.

Never create Day ${days + 1}.

Never skip a day.

Do not create additional day headings.


============================================================
DAILY FORMAT
============================================================

For EVERY day use exactly this structure:

Day X

Morning:
- activity

Afternoon:
- activity

Evening:
- activity

Food:
- local food recommendation

Transportation:
- practical transportation recommendation

Safety:
- practical safety advice

Local Experience:
- unique local experience


============================================================
VERY IMPORTANT — NO EXPENSES
============================================================

DO NOT include any of the following:

- Estimated Expenses
- Daily Expenses
- Cost
- Price
- Budget amount
- Hotel price
- Food price
- Ticket price
- Transportation cost
- Activity cost
- Total expense
- ₹ amounts
- $ amounts
- USD amounts
- Any currency amount

DO NOT calculate the trip cost.

DO NOT estimate the trip cost.

DO NOT mention the total budget.

DO NOT create an expense breakdown.

The Yatra AI application calculates the trip budget separately.

The application's Trip Budget section is the ONLY place where
financial estimates should be displayed.


============================================================
ACCURACY RULES
============================================================

Keep the itinerary realistic.

Recommend places and activities that are reasonably associated
with the destination.

Do not invent exact businesses.

Do not invent exact hotel prices.

Do not invent exact ticket prices.

Do not claim that a place is open at a particular time unless
you are certain.

If you are uncertain about a specific detail, give a general
recommendation instead.

Use Indian travel context.

Do not use USD.

Do not use dollar symbols.

Do not mention currency at all.


============================================================
OUTPUT RULES
============================================================

Return ONLY the itinerary.

Do not provide an introduction.

Do not provide a conclusion.

Do not provide a separate budget section.

Do not provide an expense summary.

Do not add explanations outside the itinerary.

Follow the exact daily structure given above.

`;


    // ------------------------------------------------------------
    // SEND REQUEST TO OLLAMA
    // ------------------------------------------------------------

    const response =
      await fetch(
        "http://localhost:11434/api/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            model: "gemma3:1b",

            prompt,

            stream: false,

            options: {
              temperature: 0.15,
            },

          }),

        }
      );


    // ------------------------------------------------------------
    // CHECK OLLAMA RESPONSE
    // ------------------------------------------------------------

    if (!response.ok) {

      throw new Error(
        `Ollama returned status ${response.status}`
      );

    }


    const data =
      await response.json();


    // ------------------------------------------------------------
    // CLEAN AI RESPONSE
    // ------------------------------------------------------------

    let itinerary =
      data.response || "";


    /*
      Extra safety layer.

      Even though the prompt tells the AI not to generate
      expenses, this removes common expense headings if the
      small Gemma model still produces them.
    */

    itinerary =
      itinerary
        .replace(
          /^Estimated Expenses:.*$/gim,
          ""
        )
        .replace(
          /^Daily Expenses:.*$/gim,
          ""
        )
        .replace(
          /^Trip Expenses:.*$/gim,
          ""
        )
        .replace(
          /^Expense Breakdown:.*$/gim,
          ""
        )
        .replace(
          /^Total Expenses:.*$/gim,
          ""
        );


    // Remove excessive blank lines created by cleanup

    itinerary =
      itinerary
        .replace(/\n{3,}/g, "\n\n")
        .trim();


    // ------------------------------------------------------------
    // RETURN RESPONSE
    // ------------------------------------------------------------

    return res.json({

      success: true,

      itinerary,

      // Keep this because the frontend uses it
      // for the separate Trip Budget section.
      budgetBreakdown,

    });


  } catch (error) {

    console.error(
      "AI Planner Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Unable to generate itinerary.",

      error:
        error.message,

    });

  }

});
// ============================================================
// TRAVEL SAFETY
// ============================================================

app.post("/api/travel-safety", async (req, res) => {

  try {

    const {
      destination,
      startDate,
      interests,
    } = req.body;

    const normalized =
      normalizeDestination(destination);

    const info =
      destinationData[normalized];

    let bestTime =
      info?.bestTime ||
      commonDestinationData[normalized]?.[0] ||
      "Check current local weather conditions.";

    let bestTimeReason =
      info?.bestTimeReason ||
      "Travel conditions vary by season.";

    const month =
      new Date(startDate).getMonth() + 1;

    let crowdLevel = "Moderate";

    if ([12, 1, 2].includes(month)) {
      crowdLevel = "High";
    }

    if ([6, 7, 8].includes(month)) {
      crowdLevel = "Moderate";
    }

    if ([4, 5].includes(month)) {
      crowdLevel = "Low to Moderate";
    }

    const prompt = `

You are Yatra AI Travel Safety Assistant.

Destination: ${destination}
Travel date: ${startDate}
Interests: ${interests || "general"}

Give practical travel safety advice.

Include:

1. General safety
2. Transportation safety
3. Tourist scam precautions
4. Weather/season considerations
5. Crowd-management advice

Do not invent specific businesses.

Use simple bullet points.

`;

    let aiSafety = "";

    try {

      const response =
        await fetch(
          "http://localhost:11434/api/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              model: "gemma3:1b",
              prompt,
              stream: false,
              options: {
                temperature: 0.2,
              },
            }),
          }
        );

      if (response.ok) {

        const data =
          await response.json();

        aiSafety =
          data.response || "";

      }

    } catch (aiError) {

      console.warn(
        "Safety AI unavailable:",
        aiError.message
      );

    }

    res.json({

      success: true,

      destination: normalized,

      bestTime,

      bestTimeReason,

      crowdLevel,

      crowdExplanation:
        "This is a planning estimate based on the travel month and typical seasonal patterns. It is not live crowd-camera data.",

      safetyTips:
        info?.safety || [
          "Keep valuables secure.",
          "Use established transportation.",
          "Verify prices before paying.",
        ],

      aiSafety,

    });

  } catch (error) {

    console.error(
      "Safety Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to load travel safety information.",

    });

  }

});


// ============================================================
// SCAM DETECTION
// ============================================================

app.post("/api/check-scam", async (req, res) => {

  try {

    const {
      text,
      destination,
    } = req.body;

    if (!text?.trim()) {

      return res.status(400).json({
        success: false,
        message:
          "Please describe the situation.",
      });

    }

    const prompt = `

You are Yatra AI Travel Scam Detector.

Destination:
${destination || "Unknown"}

Traveler situation:
${text}

Analyze the situation carefully.

Return exactly:

SCAM RISK: LOW / MEDIUM / HIGH

ANALYSIS:
Short explanation.

WARNING SIGNS:
- suspicious sign
- suspicious sign

WHAT YOU SHOULD DO:
- practical action
- practical action

YATRA SAFETY TIP:
One short safety tip.

Do not automatically call something a scam.

Do not invent facts.

If information is insufficient, clearly say so.

Use ₹ for money.

`;

    const response =
      await fetch(
        "http://localhost:11434/api/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model: "gemma3:1b",
            prompt,
            stream: false,
            options: {
              temperature: 0.15,
            },
          }),
        }
      );

    if (!response.ok) {

      throw new Error(
        `Ollama returned status ${response.status}`
      );

    }

    const data =
      await response.json();

    res.json({

      success: true,

      result:
        data.response || "",

    });

  } catch (error) {

    console.error(
      "Scam Detection Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to analyze the situation.",

      error:
        error.message,

    });

  }

});


// ============================================================
// SMART TOURIST GUIDE
// ============================================================

app.post("/api/smart-guide", async (req, res) => {

  try {

    const {
      destination,
      place,
    } = req.body;

    if (!destination || !place) {

      return res.status(400).json({

        success: false,

        message:
          "Destination and place are required.",

      });

    }

    const prompt = `

You are Yatra AI Smart Tourist Guide.

Destination:
${destination}

Place/Landmark:
${place}

Act like a friendly digital tourist guide.

Provide:

1. What this place is
2. Why it is important
3. What the traveller should look for
4. Suggested visit duration
5. Practical visitor tip
6. Safety/respect tip

Do not invent exact opening hours,
ticket prices or unavailable facilities.

Keep it concise.

`;

    const response =
      await fetch(
        "http://localhost:11434/api/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model: "gemma3:1b",
            prompt,
            stream: false,
            options: {
              temperature: 0.2,
            },
          }),
        }
      );

    if (!response.ok) {

      throw new Error(
        `Ollama returned status ${response.status}`
      );

    }

    const data =
      await response.json();

    res.json({

      success: true,

      guide:
        data.response || "",

    });

  } catch (error) {

    console.error(
      "Smart Guide Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to generate the tourist guide.",

      error:
        error.message,

    });

  }

});


// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {

  console.log(
    `Yatra AI backend running on http://localhost:${PORT}`
  );

});