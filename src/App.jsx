import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./App.css";


// ============================================================
// DESTINATIONS
// ============================================================

const destinations = [
  {
    name: "Leh",
    state: "Ladakh",
    category: "Mountains",
    emoji: "🏔️",
    imageQuery: "Leh Palace Ladakh",
    description:
      "High-altitude landscapes, monasteries and unforgettable Himalayan roads.",
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    category: "Mountains",
    emoji: "🏔️",
    imageQuery: "Solang Valley Manali Himachal Pradesh",
    description:
      "Snowy peaks, valleys, cafes and adventurous mountain experiences.",
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    category: "Mountains",
    emoji: "🌲",
    imageQuery: "Shimla Ridge Christ Church Himachal Pradesh",
    description:
      "Colonial charm, mountain views and peaceful Himalayan escapes.",
  },
  {
    name: "Meghalaya",
    state: "Northeast India",
    category: "Nature",
    emoji: "🌿",
    imageQuery: "Nohkalikai Falls Meghalaya",
    description:
      "Living root bridges, waterfalls, caves and lush green landscapes.",
  },
  {
    name: "Sikkim",
    state: "Northeast India",
    category: "Mountains",
    emoji: "🏔️",
    imageQuery: "Tsomgo Lake Sikkim",
    description:
      "Himalayan monasteries, alpine lakes and dramatic mountain scenery.",
  },
  {
    name: "Gangtok",
    state: "Sikkim",
    category: "Mountains",
    emoji: "⛰️",
    imageQuery: "Gangtok Sikkim mountains",
    description:
      "A beautiful Himalayan city with monasteries and mountain views.",
  },
  {
    name: "Darjeeling",
    state: "West Bengal",
    category: "Nature",
    emoji: "🍃",
    imageQuery: "Darjeeling tea gardens Kanchenjunga",
    description:
      "Tea gardens, toy trains and spectacular Kanchenjunga views.",
  },
  {
    name: "Goa",
    state: "Goa",
    category: "Beach",
    emoji: "🏖️",
    imageQuery: "Baga Beach Goa",
    description:
      "Golden beaches, Portuguese heritage, food and vibrant nightlife.",
  },
  {
    name: "Andaman",
    state: "Andaman & Nicobar Islands",
    category: "Beach",
    emoji: "🌊",
    imageQuery: "Radhanagar Beach Havelock Andaman",
    description:
      "Turquoise waters, coral reefs and tropical island adventures.",
  },
  {
    name: "Lakshadweep",
    state: "India",
    category: "Beach",
    emoji: "🏝️",
    imageQuery: "Lakshadweep lagoon islands",
    description:
      "Crystal-clear lagoons, coral reefs and peaceful island scenery.",
  },
  {
    name: "Kerala",
    state: "Kerala",
    category: "Nature",
    emoji: "🌴",
    imageQuery: "Kerala backwaters Alleppey",
    description:
      "Backwaters, tropical landscapes, beaches and rich local culture.",
  },
  {
    name: "Munnar",
    state: "Kerala",
    category: "Nature",
    emoji: "🍃",
    imageQuery: "Munnar tea plantations Kerala",
    description:
      "Rolling tea plantations, misty hills and refreshing mountain air.",
  },
  {
    name: "Alappuzha",
    state: "Kerala",
    category: "Nature",
    emoji: "🚤",
    imageQuery: "Alappuzha Kerala houseboat backwaters",
    description:
      "Serene backwaters, houseboats and beautiful Kerala villages.",
  },
  {
    name: "Ooty",
    state: "Tamil Nadu",
    category: "Nature",
    emoji: "🌲",
    imageQuery: "Ooty Nilgiri Hills tea gardens",
    description:
      "Cool weather, tea estates, gardens and scenic Nilgiri hills.",
  },
  {
    name: "Kodaikanal",
    state: "Tamil Nadu",
    category: "Nature",
    emoji: "🌲",
    imageQuery: "Kodaikanal Lake Tamil Nadu",
    description:
      "Misty hills, forests, lakes and peaceful southern mountain views.",
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    category: "Culture",
    emoji: "🪔",
    imageQuery: "Dashashwamedh Ghat Varanasi Ganga Aarti",
    description:
      "Ancient ghats, Ganga Aarti, temples and timeless spiritual culture.",
  },
  {
    name: "Agra",
    state: "Uttar Pradesh",
    category: "Heritage",
    emoji: "🏛️",
    imageQuery: "Taj Mahal Agra India",
    description:
      "Home to the Taj Mahal and some of India's most iconic heritage sites.",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    emoji: "🏰",
    imageQuery: "Hawa Mahal Jaipur Rajasthan",
    description:
      "Palaces, forts, colourful markets and Rajasthan's royal heritage.",
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    category: "Heritage",
    emoji: "🏰",
    imageQuery: "Lake Pichola Udaipur City Palace",
    description:
      "Romantic lakes, palaces and beautiful Mewar architecture.",
  },
  {
    name: "Jaisalmer",
    state: "Rajasthan",
    category: "Heritage",
    emoji: "🐪",
    imageQuery: "Jaisalmer Fort Rajasthan",
    description:
      "Golden sandstone architecture, forts and desert experiences.",
  },
  {
    name: "Jodhpur",
    state: "Rajasthan",
    category: "Heritage",
    emoji: "🏰",
    imageQuery: "Mehrangarh Fort Jodhpur",
    description:
      "The Blue City, Mehrangarh Fort and colourful Rajasthani streets.",
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    category: "Adventure",
    emoji: "🧘",
    imageQuery: "Lakshman Jhula Rishikesh Ganga",
    description:
      "Yoga, rafting, riverside cafes and Himalayan adventure.",
  },
  {
    name: "Mussoorie",
    state: "Uttarakhand",
    category: "Mountains",
    emoji: "🌲",
    imageQuery: "Mussoorie Uttarakhand mountains",
    description:
      "A charming hill station surrounded by Himalayan foothills.",
  },
  {
    name: "Kashmir",
    state: "Jammu & Kashmir",
    category: "Mountains",
    emoji: "🏔️",
    imageQuery: "Kashmir valley snow mountains",
    description:
      "Snow-capped mountains, valleys, lakes and breathtaking scenery.",
  },
  {
    name: "Srinagar",
    state: "Jammu & Kashmir",
    category: "Nature",
    emoji: "🚣",
    imageQuery: "Dal Lake Srinagar houseboats",
    description:
      "Dal Lake, houseboats, Mughal gardens and Himalayan beauty.",
  },
  {
    name: "Amritsar",
    state: "Punjab",
    category: "Culture",
    emoji: "🛕",
    imageQuery: "Golden Temple Amritsar",
    description:
      "Golden Temple, Punjabi cuisine and deeply meaningful history.",
  },
  {
    name: "Delhi",
    state: "Delhi",
    category: "Culture",
    emoji: "🏙️",
    imageQuery: "India Gate New Delhi",
    description:
      "A fascinating mix of ancient monuments, food and modern city life.",
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    category: "City",
    emoji: "🌆",
    imageQuery: "Gateway of India Mumbai",
    description:
      "India's energetic coastal metropolis filled with food and culture.",
  },
  {
    name: "Pune",
    state: "Maharashtra",
    category: "City",
    emoji: "🏙️",
    imageQuery: "Shaniwar Wada Pune",
    description:
      "A youthful city combining history, education, food and culture.",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    category: "Culture",
    emoji: "🕌",
    imageQuery: "Charminar Hyderabad",
    description:
      "Historic architecture, biryani, bazaars and modern city life.",
  },
  {
    name: "Bengaluru",
    state: "Karnataka",
    category: "City",
    emoji: "🌆",
    imageQuery: "Vidhana Soudha Bengaluru",
    description:
      "India's tech capital with gardens, cafes and a vibrant culture.",
  },
  {
    name: "Mysore",
    state: "Karnataka",
    category: "Heritage",
    emoji: "🏛️",
    imageQuery: "Mysore Palace Karnataka",
    description:
      "Palaces, royal heritage, markets and famous South Indian cuisine.",
  },
  {
    name: "Hampi",
    state: "Karnataka",
    category: "Heritage",
    emoji: "🏛️",
    imageQuery: "Virupaksha Temple Hampi Karnataka",
    description:
      "Ancient ruins, giant boulders and spectacular Vijayanagara heritage.",
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    category: "Culture",
    emoji: "🌆",
    imageQuery: "Victoria Memorial Kolkata",
    description:
      "Art, literature, colonial architecture and legendary Bengali food.",
  },
  {
    name: "Bhubaneswar",
    state: "Odisha",
    category: "Heritage",
    emoji: "🛕",
    imageQuery: "Lingaraj Temple Bhubaneswar",
    description:
      "Ancient temples and a gateway to Odisha's rich cultural heritage.",
  },
  {
    name: "Puri",
    state: "Odisha",
    category: "Beach",
    emoji: "🌊",
    imageQuery: "Puri Beach Odisha",
    description:
      "A famous coastal destination blending beaches, temples and culture.",
  },
  {
    name: "Guwahati",
    state: "Assam",
    category: "Nature",
    emoji: "🌿",
    imageQuery: "Brahmaputra River Guwahati Assam",
    description:
      "Gateway to Northeast India with temples, rivers and nearby nature.",
  },
  {
    name: "Kaziranga",
    state: "Assam",
    category: "Wildlife",
    emoji: "🦏",
    imageQuery: "One horned rhinoceros Kaziranga National Park",
    description:
      "One-horned rhinos, grasslands and unforgettable wildlife experiences.",
  },
];


// ============================================================
// CATEGORIES
// ============================================================

const categories = [
  "All",
  "Mountains",
  "Beach",
  "Nature",
  "Heritage",
  "Culture",
  "Adventure",
  "Wildlife",
  "City",
];


// ============================================================
// MAP COORDINATES
// ============================================================

const destinationCoordinates = {
  Leh: [34.1526, 77.5771],
  Manali: [32.2432, 77.1892],
  Shimla: [31.1048, 77.1734],

  Meghalaya: [25.467, 91.3662],
  Sikkim: [27.533, 88.5122],
  Gangtok: [27.3389, 88.6065],
  Darjeeling: [27.041, 88.2663],

  Goa: [15.2993, 74.124],
  Andaman: [11.7401, 92.6586],
  Lakshadweep: [10.5667, 72.6417],

  Kerala: [10.8505, 76.2711],
  Munnar: [10.0889, 77.0595],
  Alappuzha: [9.4981, 76.3388],

  Ooty: [11.4102, 76.695],
  Kodaikanal: [10.2381, 77.4892],

  Varanasi: [25.3176, 82.9739],
  Agra: [27.1767, 78.0081],

  Jaipur: [26.9124, 75.7873],
  Udaipur: [24.5854, 73.7125],
  Jaisalmer: [26.9157, 70.9083],
  Jodhpur: [26.2389, 73.0243],

  Rishikesh: [30.0869, 78.2676],
  Mussoorie: [30.4598, 78.0644],

  Kashmir: [34.0837, 74.7973],
  Srinagar: [34.0837, 74.7973],

  Amritsar: [31.634, 74.8723],
  Delhi: [28.6139, 77.209],
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],

  Hyderabad: [17.385, 78.4867],
  Bengaluru: [12.9716, 77.5946],

  Mysore: [12.2958, 76.6394],
  Hampi: [15.335, 76.46],

  Kolkata: [22.5726, 88.3639],

  Bhubaneswar: [20.2961, 85.8245],
  Puri: [19.8135, 85.8312],

  Guwahati: [26.1445, 91.7362],
  Kaziranga: [26.5775, 93.1711],
};


// ============================================================
// YATRA AI MAP
// ============================================================

function YatraMap({ destination }) {

  const matchedDestination =
    Object.keys(destinationCoordinates).find(
      (key) =>
        key.toLowerCase() ===
        destination?.trim().toLowerCase()
    );

  const coordinates =
    destinationCoordinates[matchedDestination];


  if (!coordinates) {
    return (
      <div className="map-placeholder">

        <div className="map-placeholder-icon">
          🗺️
        </div>

        <h3>
          Map coming up
        </h3>

        <p>
          We couldn't find map coordinates for{" "}
          <strong>
            {destination}
          </strong>.
        </p>

      </div>
    );
  }


  return (
    <div className="yatra-map-wrapper">

      <MapContainer
        center={coordinates}
        zoom={11}
        scrollWheelZoom={true}
        className="yatra-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={coordinates}
        >

          <Popup>

            <strong>
              📍 {matchedDestination}
            </strong>

            <br />

            Your Yatra AI destination

          </Popup>

        </Marker>

      </MapContainer>

    </div>
  );
}


// ============================================================
// APP
// ============================================================

function App() {

  const [showPlanner, setShowPlanner] =
    useState(false);

  const [showItinerary, setShowItinerary] =
    useState(false);

  const [showScamChecker, setShowScamChecker] =
    useState(false);

  const [itinerary, setItinerary] =
    useState("");

  const [budgetBreakdown, setBudgetBreakdown] =
    useState(null);

  const [scamText, setScamText] =
    useState("");

  const [scamResult, setScamResult] =
    useState("");

  const [scamLoading, setScamLoading] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [trip, setTrip] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 2,
    budget: "",
    interests: "",
  });

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [images, setImages] =
    useState({});


  // ============================================================
  // LOAD WIKIMEDIA IMAGES
  // ============================================================

  useEffect(() => {

    let cancelled = false;

    const loadImages = async () => {

      const imageMap = {};

      await Promise.all(

        destinations.map(
          async (destination) => {

            try {

              const searchUrl =
                "https://commons.wikimedia.org/w/api.php" +
                "?action=query" +
                "&generator=search" +
                "&gsrsearch=" +
                encodeURIComponent(
                  destination.imageQuery
                ) +
                "&gsrnamespace=6" +
                "&gsrlimit=1" +
                "&prop=imageinfo" +
                "&iiprop=url" +
                "&iiurlwidth=900" +
                "&format=json" +
                "&origin=*";


              const response =
                await fetch(searchUrl);


              if (!response.ok) return;


              const data =
                await response.json();


              const pages =
                data?.query?.pages;


              if (!pages) return;


              const page =
                Object.values(pages)[0];


              const imageInfo =
                page?.imageinfo?.[0];


              if (
                imageInfo?.thumburl ||
                imageInfo?.url
              ) {

                imageMap[destination.name] =
                  imageInfo.thumburl ||
                  imageInfo.url;

              }

            } catch (error) {

              console.warn(
                `Image unavailable for ${destination.name}`,
                error
              );

            }

          }
        )
      );


      if (!cancelled) {
        setImages(imageMap);
      }

    };


    loadImages();


    return () => {
      cancelled = true;
    };

  }, []);


  // ============================================================
  // FILTER DESTINATIONS
  // ============================================================

  const filteredDestinations =
    useMemo(() => {

      const searchValue =
        search.trim().toLowerCase();


      return destinations.filter(
        (destination) => {

          const matchesCategory =
            selectedCategory === "All" ||
            destination.category ===
              selectedCategory;


          const matchesSearch =
            !searchValue ||
            destination.name
              .toLowerCase()
              .includes(searchValue) ||
            destination.state
              .toLowerCase()
              .includes(searchValue) ||
            destination.category
              .toLowerCase()
              .includes(searchValue);


          return (
            matchesCategory &&
            matchesSearch
          );

        }
      );

    }, [selectedCategory, search]);


  // ============================================================
  // FORM HANDLER
  // ============================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setTrip((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ============================================================
  // OPEN PLANNER
  // ============================================================

  const openPlannerForDestination =
    (destination) => {

      setTrip((previous) => ({
        ...previous,
        destination,
      }));

      setShowPlanner(true);

    };


  // ============================================================
  // FORMAT ITINERARY
  // ============================================================

  const formatItinerary = (text) => {

    if (!text) return [];


    const cleanedText =
      text
        .replace(/\r\n/g, "\n")
        .replace(/\*\*/g, "");


    const sections =
      cleanedText.split(
        /(?=Day\s+\d+)/i
      );


    return sections
      .filter(
        (section) =>
          section.trim()
      )
      .map(
        (section, index) => {

          const lines =
            section
              .trim()
              .split("\n");


          const dayNumber =
            lines[0]?.match(
              /Day\s+(\d+)/i
            )?.[1];


          const title =
            `Day ${dayNumber || index + 1}`;


          let content =
            section.trim();


          if (lines.length > 1) {
            content =
              lines
                .slice(1)
                .join("\n")
                .trim();
          }


          return {
            title,
            content,
          };

        }
      );

  };


  const itineraryDays =
    formatItinerary(itinerary);


  // ============================================================
  // AI TRIP PLANNER
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/plan-trip",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(trip),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
            "Failed to generate itinerary"
        );

      }


      setItinerary(
        data.itinerary || ""
      );


      setBudgetBreakdown(
        data.budgetBreakdown || null
      );


      setShowPlanner(false);

      setShowItinerary(true);


    } catch (error) {

      console.error(error);


      alert(
        "Unable to generate your itinerary. Make sure the Yatra AI backend and Ollama are running."
      );

    } finally {

      setLoading(false);

    }

  };


  // ============================================================
  // SCAM DETECTOR
  // ============================================================

  const handleScamCheck = async () => {

    if (!scamText.trim()) {

      alert(
        "Please describe the offer, message, price, or situation you want to check."
      );

      return;
    }


    setScamLoading(true);

    setScamResult("");


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/check-scam",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              text: scamText,

              destination:
                trip.destination ||
                "Unknown destination",

            }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
            "Unable to analyze the situation"
        );

      }


      setScamResult(
        data.result || ""
      );


    } catch (error) {

      console.error(error);


      alert(
        "Unable to connect to Yatra AI. Make sure the backend and Ollama are running."
      );


    } finally {

      setScamLoading(false);

    }

  };


  // ============================================================
  // NAVIGATION
  // ============================================================

  const goHome = () => {

    setShowPlanner(false);

    setShowItinerary(false);

    setShowScamChecker(false);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  const goExplore = () => {

    setShowPlanner(false);

    setShowItinerary(false);

    setShowScamChecker(false);


    setTimeout(() => {

      document
        .getElementById("explore")
        ?.scrollIntoView({
          behavior: "smooth",
        });

    }, 50);

  };


  // ============================================================
  // IMAGE ERROR
  // ============================================================

  const handleImageError =
    (destinationName) => {

      setImages((previous) => {

        const updated = {
          ...previous,
        };

        delete updated[destinationName];

        return updated;

      });

    };


  // ============================================================
  // RETURN
  // ============================================================

  return (

    <div className="app">


      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={goHome}
        >

          <span>✈</span>

          Yatra AI

        </div>


        <ul className="nav-links">

          <li onClick={goHome}>
            Home
          </li>

          <li onClick={goExplore}>
            Explore
          </li>

          <li
            onClick={() =>
              setShowPlanner(true)
            }
          >
            Plan Trip
          </li>

          <li
            onClick={() =>
              setShowScamChecker(true)
            }
          >
            Safety
          </li>

        </ul>


        <button className="login-btn">
          Login
        </button>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-text">

          <div className="badge">
            ✨ AI-POWERED TRAVEL COMPANION
          </div>


          <h1>

            Your journey.

            <br />

            <span>
              Our intelligence.
            </span>

          </h1>


          <p>
            Plan smarter, travel safer and
            discover more. Yatra AI creates
            personalized journeys while helping
            you stay protected from travel scams.
          </p>


          <div className="hero-buttons">

            <button
              className="plan-btn"
              onClick={() =>
                setShowPlanner(true)
              }
            >

              Plan My Journey

              <span>
                →
              </span>

            </button>


            <button
              className="explore-btn"
              onClick={goExplore}
            >
              Explore India
            </button>

          </div>


          <div className="hero-stats">

            <div>
              <strong>
                36+
              </strong>

              <span>
                Destinations
              </span>
            </div>


            <div>
              <strong>
                AI
              </strong>

              <span>
                Personalized Plans
              </span>
            </div>


            <div>
              <strong>
                24/7
              </strong>

              <span>
                Safety Support
              </span>
            </div>

          </div>

        </div>


        {/* HERO CARD */}

        <div className="hero-card">

          <div className="hero-card-glow" />


          <div className="hero-card-header">

            <span className="mini-badge">
              YATRA AI
            </span>

            <span className="online-dot">
              ● AI Ready
            </span>

          </div>


          <h2>

            Where will you

            <br />

            <span>
              go next?
            </span>

          </h2>


          <p>
            Tell us your dream destination
            and let AI build your journey.
          </p>


          <div className="trip-input">

            <span>
              📍
            </span>

            <div>

              <small>
                DESTINATION
              </small>

              <strong>
                Where do you want to go?
              </strong>

            </div>

          </div>


          <div className="trip-input">

            <span>
              📅
            </span>

            <div>

              <small>
                TRAVEL DATES
              </small>

              <strong>
                Select your dates
              </strong>

            </div>

          </div>


          <div className="trip-input">

            <span>
              👥
            </span>

            <div>

              <small>
                TRAVELERS
              </small>

              <strong>
                2 travelers
              </strong>

            </div>

          </div>


          <button
            className="card-plan-btn"
            onClick={() =>
              setShowPlanner(true)
            }
          >

            Start Planning

            <span>
              →
            </span>

          </button>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="section-heading">

          <span className="section-label">
            WHY YATRA AI
          </span>


          <h2>

            Everything you need to

            <span>
              {" "}travel smarter.
            </span>

          </h2>


          <p>
            One intelligent platform for your
            entire journey.
          </p>

        </div>


        <div className="feature-grid">

          <div
            className="feature-card"
            onClick={() =>
              setShowPlanner(true)
            }
          >

            <div className="feature-icon">
              🤖
            </div>

            <span className="feature-number">
              01
            </span>

            <h3>
              AI Trip Planner
            </h3>

            <p>
              Get personalized itineraries
              based on your interests,
              budget and time.
            </p>

            <span className="feature-arrow">
              Explore feature →
            </span>

          </div>


          <div
            className="feature-card"
            onClick={() =>
              setShowScamChecker(true)
            }
          >

            <div className="feature-icon">
              🛡️
            </div>

            <span className="feature-number">
              02
            </span>

            <h3>
              Travel Safety
            </h3>

            <p>
              Make smarter decisions and
              receive practical travel
              safety recommendations.
            </p>

            <span className="feature-arrow">
              Stay protected →
            </span>

          </div>


          <div
            className="feature-card"
            onClick={() =>
              setShowScamChecker(true)
            }
          >

            <div className="feature-icon">
              🚨
            </div>

            <span className="feature-number">
              03
            </span>

            <h3>
              Scam Detection
            </h3>

            <p>
              Analyze suspicious offers,
              messages and prices before
              you make a payment.
            </p>

            <span className="feature-arrow">
              Check a situation →
            </span>

          </div>


          <div
            className="feature-card"
            onClick={goExplore}
          >

            <div className="feature-icon">
              🗺️
            </div>

            <span className="feature-number">
              04
            </span>

            <h3>
              Local Insights
            </h3>

            <p>
              Discover beautiful destinations,
              culture and experiences across
              India.
            </p>

            <span className="feature-arrow">
              Explore India →
            </span>

          </div>

        </div>

      </section>


      {/* ================= EXPLORE ================= */}

      <section
        className="explore-section"
        id="explore"
      >

        <div className="explore-heading">

          <div>

            <span className="section-label">
              DISCOVER INDIA
            </span>

            <h2>

              Explore your

              <span>
                {" "}next escape.
              </span>

            </h2>

            <p>
              From Himalayan peaks to tropical
              beaches, discover destinations
              worth adding to your journey.
            </p>

          </div>


          <div className="destination-count">

            <strong>
              {destinations.length}+
            </strong>

            <span>
              destinations
            </span>

          </div>

        </div>


        {/* SEARCH + FILTER */}

        <div className="explore-controls">

          <div className="search-box">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                ×
              </button>

            )}

          </div>


          <div className="category-list">

            {categories.map(
              (category) => (

                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-btn active"
                      : "category-btn"
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >

                  {category}

                </button>

              )
            )}

          </div>

        </div>


        {/* DESTINATION GRID */}

        <div className="destination-grid">

          {filteredDestinations.map(
            (destination) => (

              <div
                className="destination-card"
                key={destination.name}
              >

                <div className="destination-image">

                  {images[destination.name] ? (

                    <img
                      src={
                        images[destination.name]
                      }
                      alt={`${destination.name}, ${destination.state}`}
                      loading="lazy"
                      onError={() =>
                        handleImageError(
                          destination.name
                        )
                      }
                    />

                  ) : (

                    <div className="image-loading">

                      <div>

                        <span>
                          {destination.emoji}
                        </span>

                        <small>
                          Discover{" "}
                          {destination.name}
                        </small>

                      </div>

                    </div>

                  )}


                  <div className="image-overlay" />


                  <div className="destination-tag">
                    {destination.category}
                  </div>


                  <div className="destination-emoji">
                    {destination.emoji}
                  </div>

                </div>


                <div className="destination-content">

                  <div className="destination-title">

                    <div>

                      <h3>
                        {destination.name}
                      </h3>

                      <span>
                        📍 {destination.state}
                      </span>

                    </div>

                  </div>


                  <p>
                    {destination.description}
                  </p>


                  <button
                    className="destination-btn"
                    onClick={() =>
                      openPlannerForDestination(
                        destination.name
                      )
                    }
                  >

                    Plan this trip

                    <span>
                      →
                    </span>

                  </button>

                </div>

              </div>

            )
          )}

        </div>


        {/* EMPTY STATE */}

        {filteredDestinations.length === 0 && (

          <div className="empty-explore">

            <div>
              🧭
            </div>

            <h3>
              No destinations found
            </h3>

            <p>
              Try searching for another
              Indian destination.
            </p>

            <button
              onClick={() => {

                setSearch("");

                setSelectedCategory(
                  "All"
                );

              }}
            >
              Show all destinations
            </button>

          </div>

        )}

      </section>


      {/* ============================================================
          PLANNER MODAL
      ============================================================ */}

      {showPlanner && (

        <div className="modal-overlay">

          <div className="planner-modal">

            <button
              className="close-btn"
              onClick={() =>
                setShowPlanner(false)
              }
            >
              ✕
            </button>


            <div className="ai-badge">
              ✨ YATRA AI PLANNER
            </div>


            <h2>
              Plan Your Journey
            </h2>


            <p className="modal-subtitle">
              Tell Yatra AI about your trip
              and we'll create a personalized
              experience.
            </p>


            <form
              onSubmit={handleSubmit}
            >

              <label>

                Destination

                <input
                  type="text"
                  name="destination"
                  placeholder="e.g. Varanasi, Goa, Leh"
                  value={trip.destination}
                  onChange={handleChange}
                  required
                />

              </label>


              <div className="date-row">

                <label>

                  Start Date

                  <input
                    type="date"
                    name="startDate"
                    value={trip.startDate}
                    onChange={handleChange}
                    required
                  />

                </label>


                <label>

                  End Date

                  <input
                    type="date"
                    name="endDate"
                    value={trip.endDate}
                    onChange={handleChange}
                    required
                  />

                </label>

              </div>


              <label>

                Number of Travelers

                <input
                  type="number"
                  name="travelers"
                  min="1"
                  max="20"
                  value={trip.travelers}
                  onChange={handleChange}
                  required
                />

              </label>


              <label>

                Budget

                <select
                  name="budget"
                  value={trip.budget}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select your budget
                  </option>

                  <option value="budget">
                    Budget — Under ₹20,000
                  </option>

                  <option value="moderate">
                    Moderate — ₹20,000–₹50,000
                  </option>

                  <option value="premium">
                    Premium — ₹50,000–₹1,00,000
                  </option>

                  <option value="luxury">
                    Luxury — ₹1,00,000+
                  </option>

                </select>

              </label>


              <label>

                What are you interested in?

                <input
                  type="text"
                  name="interests"
                  placeholder="Food, beaches, culture, adventure..."
                  value={trip.interests}
                  onChange={handleChange}
                />

              </label>


              <button
                className="generate-btn"
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "🤖 Yatra AI is planning..."
                  : "✨ Generate My Trip"}

              </button>

            </form>

          </div>

        </div>

      )}


      {/* ============================================================
          ITINERARY MODAL
      ============================================================ */}

      {showItinerary && (

        <div className="modal-overlay">

          <div className="itinerary-modal">

            <button
              className="close-btn"
              onClick={() =>
                setShowItinerary(false)
              }
            >
              ✕
            </button>


            <div className="ai-badge">
              ✨ YATRA AI
            </div>


            <h2>
              Your Personalized Journey
            </h2>


            <p className="itinerary-intro">

              Here's a smart travel plan created
              for your trip to{" "}

              <strong>
                {trip.destination}
              </strong>.

            </p>


            {/* SUMMARY */}

            <div className="trip-summary">

              <div>

                <span>
                  📍 Destination
                </span>

                <strong>
                  {trip.destination}
                </strong>

              </div>


              <div>

                <span>
                  👥 Travelers
                </span>

                <strong>
                  {trip.travelers}
                </strong>

              </div>


              <div>

                <span>
                  💰 Budget
                </span>

                <strong>

                  {trip.budget ===
                    "budget"
                    ? "Budget"
                    : trip.budget ===
                      "moderate"
                    ? "Moderate"
                    : trip.budget ===
                      "premium"
                    ? "Premium"
                    : "Luxury"}

                </strong>

              </div>

            </div>


            {/* BUDGET */}

            {budgetBreakdown && (

              <div className="budget-card">

                <div className="budget-header">

                  <div>

                    <span className="section-label">
                      SMART ESTIMATE
                    </span>

                    <h3>
                      💰 Trip Budget
                    </h3>

                  </div>


                  <div className="budget-total-small">

                    ₹
                    {Number(
                      budgetBreakdown.total ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </div>

                </div>


                {[
                  [
                    "🏨 Accommodation",
                    budgetBreakdown.accommodation,
                  ],
                  [
                    "🍛 Food",
                    budgetBreakdown.food,
                  ],
                  [
                    "🚕 Transportation",
                    budgetBreakdown.transportation,
                  ],
                  [
                    "🎟️ Activities",
                    budgetBreakdown.activities,
                  ],
                  [
                    "🛍️ Miscellaneous",
                    budgetBreakdown.miscellaneous,
                  ],
                ].map(
                  ([label, value]) => (

                    <div
                      className="budget-row"
                      key={label}
                    >

                      <span>
                        {label}
                      </span>

                      <strong>

                        ₹
                        {Number(
                          value || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </strong>

                    </div>

                  )
                )}


                <div className="budget-divider" />


                <div className="budget-total">

                  <span>
                    💰 Estimated Total
                  </span>

                  <strong>

                    ₹
                    {Number(
                      budgetBreakdown.total ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>


                <p className="budget-note">

                  Approximate estimate based on
                  your selected budget, trip duration
                  and number of travelers.

                </p>

              </div>

            )}


            {/* ======================================================
                YATRA MAP
            ====================================================== */}

            <div className="trip-map-card">

              <div className="trip-map-header">

                <div>

                  <span className="section-label">
                    📍 YOUR DESTINATION
                  </span>

                  <h3>
                    🗺️ Explore{" "}
                    {trip.destination}
                  </h3>

                  <p>
                    View your destination on the
                    map and get a visual feel for
                    your journey.
                  </p>

                </div>


                <div className="map-location-badge">

                  📍{" "}
                  {trip.destination}

                </div>

              </div>


              <YatraMap
                destination={
                  trip.destination
                }
              />

            </div>


            {/* ITINERARY */}

            <div className="ai-itinerary">

              <div className="itinerary-header">

                <span className="section-label">
                  ✨ YOUR AI TRAVEL PLAN
                </span>

                <h3>
                  🗺️ Day-by-Day Itinerary
                </h3>

                <p>
                  A personalized journey designed
                  around your destination,
                  interests and budget.
                </p>

              </div>


              <div className="day-cards">

                {itineraryDays.length > 0 ? (

                  itineraryDays.map(
                    (day, index) => (

                      <div
                        className="day-card"
                        key={index}
                      >

                        <div className="day-card-top">

                          <div className="day-icon">

                            {index === 0
                              ? "🌅"
                              : index === 1
                              ? "🌴"
                              : index === 2
                              ? "🏛️"
                              : index === 3
                              ? "🍜"
                              : index === 4
                              ? "🌄"
                              : "✨"}

                          </div>


                          <div>

                            <span className="day-label">
                              DAY{" "}
                              {index + 1}
                            </span>

                            <h4>
                              {day.title}
                            </h4>

                          </div>

                        </div>


                        <div className="day-content">

                          {day.content
                            .split("\n")
                            .filter(
                              (line) =>
                                line.trim()
                            )
                            .map(
                              (
                                line,
                                lineIndex
                              ) => {

                                const cleanLine =
                                  line
                                    .replace(
                                      /^\s*[-•*]\s*/,
                                      ""
                                    )
                                    .replace(
                                      /\*\*/g,
                                      ""
                                    )
                                    .trim();


                                const isBullet =
                                  /^[-•*]/.test(
                                    line.trim()
                                  );


                                const isHeading =
                                  cleanLine.endsWith(
                                    ":"
                                  );


                                return (

                                  <div
                                    className="itinerary-line"
                                    key={
                                      lineIndex
                                    }
                                  >

                                    {isBullet && (

                                      <span className="bullet">
                                        ✦
                                      </span>

                                    )}


                                    <span
                                      className={
                                        isHeading
                                          ? "itinerary-subheading"
                                          : ""
                                      }
                                    >
                                      {cleanLine}
                                    </span>

                                  </div>

                                );

                              }
                            )}

                        </div>

                      </div>

                    )

                  )

                ) : (

                  <div className="day-card">

                    <div className="day-content">

                      <pre>
                        {itinerary}
                      </pre>

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* SAFETY */}

            <div className="safety-box">

              <div className="safety-icon">
                🛡️
              </div>

              <div>

                <h3>
                  Yatra Safety Tip
                </h3>

                <p>
                  Keep your valuables secure,
                  verify transportation prices
                  before travelling, and avoid
                  making payments to unverified
                  individuals.
                </p>

              </div>

            </div>


            <button
              className="generate-btn"
              onClick={() => {

                setShowItinerary(false);

                setShowPlanner(true);

              }}
            >

              ✨ Plan Another Trip

            </button>

          </div>

        </div>

      )}


      {/* ============================================================
          SCAM CHECKER
      ============================================================ */}

      {showScamChecker && (

        <div className="modal-overlay">

          <div className="planner-modal">

            <button
              className="close-btn"
              onClick={() => {

                setShowScamChecker(false);

                setScamResult("");

                setScamText("");

              }}
            >
              ✕
            </button>


            <div className="ai-badge">
              🚨 YATRA AI SAFETY
            </div>


            <h2>
              🛡️ Travel Scam Detector
            </h2>


            <p className="modal-subtitle">

              Found a suspicious hotel offer,
              taxi price, tour package or message?
              Let Yatra AI analyze it.

            </p>


            <label>

              Describe the offer or situation

              <textarea
                value={scamText}
                onChange={(e) =>
                  setScamText(
                    e.target.value
                  )
                }
                placeholder="Example: A taxi driver at the airport is asking for ₹3,000 to take me to my hotel. Is this suspicious?"
                rows="6"
              />

            </label>


            <button
              className="generate-btn"
              onClick={handleScamCheck}
              disabled={scamLoading}
            >

              {scamLoading
                ? "🤖 Yatra AI is checking..."
                : "🔍 Check for Scam"}

            </button>


            {scamResult && (

              <div className="ai-itinerary scam-result">

                <div className="itinerary-header">

                  <span className="section-label">
                    AI SAFETY ANALYSIS
                  </span>

                  <h3>
                    🔎 Yatra AI Result
                  </h3>

                </div>


                <div className="day-card">

                  <div className="day-content">

                    <pre>
                      {scamResult}
                    </pre>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


export default App;