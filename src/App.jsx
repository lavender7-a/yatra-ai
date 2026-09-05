import { useEffect, useMemo, useState, useRef } from "react";
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
  ["Leh", "Ladakh", "Mountains", "🏔️"],
  ["Manali", "Himachal Pradesh", "Mountains", "🏔️"],
  ["Shimla", "Himachal Pradesh", "Mountains", "🌲"],
  ["Meghalaya", "Northeast India", "Nature", "🌿"],
  ["Sikkim", "Northeast India", "Mountains", "🏔️"],
  ["Gangtok", "Sikkim", "Mountains", "⛰️"],
  ["Darjeeling", "West Bengal", "Nature", "🍃"],
  ["Goa", "Goa", "Beach", "🏖️"],
  ["Andaman", "Andaman & Nicobar Islands", "Beach", "🌊"],
  ["Lakshadweep", "India", "Beach", "🏝️"],
  ["Kerala", "Kerala", "Nature", "🌴"],
  ["Munnar", "Kerala", "Nature", "🍃"],
  ["Alappuzha", "Kerala", "Nature", "🚤"],
  ["Ooty", "Tamil Nadu", "Nature", "🌲"],
  ["Kodaikanal", "Tamil Nadu", "Nature", "🌲"],
  ["Varanasi", "Uttar Pradesh", "Culture", "🪔"],
  ["Agra", "Uttar Pradesh", "Heritage", "🏛️"],
  ["Jaipur", "Rajasthan", "Heritage", "🏰"],
  ["Udaipur", "Rajasthan", "Heritage", "🏰"],
  ["Jaisalmer", "Rajasthan", "Heritage", "🐪"],
  ["Jodhpur", "Rajasthan", "Heritage", "🏰"],
  ["Rishikesh", "Uttarakhand", "Adventure", "🧘"],
  ["Mussoorie", "Uttarakhand", "Mountains", "🌲"],
  ["Kashmir", "Jammu & Kashmir", "Mountains", "🏔️"],
  ["Srinagar", "Jammu & Kashmir", "Nature", "🚣"],
  ["Amritsar", "Punjab", "Culture", "🛕"],
  ["Delhi", "Delhi", "Culture", "🏙️"],
  ["Mumbai", "Maharashtra", "City", "🌆"],
  ["Pune", "Maharashtra", "City", "🏙️"],
  ["Hyderabad", "Telangana", "Culture", "🕌"],
  ["Bengaluru", "Karnataka", "City", "🌆"],
  ["Mysore", "Karnataka", "Heritage", "🏛️"],
  ["Hampi", "Karnataka", "Heritage", "🏛️"],
  ["Kolkata", "West Bengal", "Culture", "🌆"],
  ["Bhubaneswar", "Odisha", "Heritage", "🛕"],
  ["Puri", "Odisha", "Beach", "🌊"],
  ["Guwahati", "Assam", "Nature", "🌿"],
  ["Kaziranga", "Assam", "Wildlife", "🦏"],
].map(
  ([name, state, category, emoji]) => ({
    name,
    state,
    category,
    emoji,
    description:
      `Discover the culture, food, experiences and attractions of ${name}.`,
  })
);


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

const categoryIcons = {
  All: "🌈",
  Mountains: "🏔️",
  Beach: "🏖️",
  Nature: "🌿",
  Heritage: "🏰",
  Culture: "🪔",
  Adventure: "🧘",
  Wildlife: "🦏",
  City: "🌆",
};


// ============================================================
// MAP
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
// MAP COMPONENT
// ============================================================

function YatraMap({ destination }) {

  const match =
    Object.keys(destinationCoordinates)
      .find(
        key =>
          key.toLowerCase() ===
          destination?.trim().toLowerCase()
      );

  if (!match) {

    return (
      <div className="map-placeholder">
        <div className="map-placeholder-icon">
          🗺️
        </div>

        <h3>Map unavailable</h3>

        <p>
          Coordinates are not currently available for{" "}
          <strong>{destination}</strong>.
        </p>
      </div>
    );

  }

  const coordinates =
    destinationCoordinates[match];

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

        <Marker position={coordinates}>
          <Popup>
            <strong>📍 {match}</strong>
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

  const [showSafety, setShowSafety] =
    useState(false);

  const [showLocalInsights, setShowLocalInsights] =
    useState(false);

  const [showSmartGuide, setShowSmartGuide] =
    useState(false);

  // Background Video Control
  const heroVideoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const toggleVideoPlay = () => {
    if (heroVideoRef.current) {
      if (heroVideoRef.current.paused) {
        heroVideoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        heroVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  // Interactive Destination Wishlist
  const [likedDestinations, setLikedDestinations] = useState({});

  const toggleLike = (e, destName) => {
    e.stopPropagation();
    setLikedDestinations(prev => ({
      ...prev,
      [destName]: !prev[destName],
    }));
  };

  // ==========================================================
  // LOGIN / ACCOUNT
  // ==========================================================

  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("yatraUser") || "null");
    } catch {
      return null;
    }
  });

  const [itinerary, setItinerary] =
    useState("");

  const [budgetBreakdown, setBudgetBreakdown] =
    useState(null);

  const [localInsights, setLocalInsights] =
    useState(null);

  const [localLoading, setLocalLoading] =
    useState(false);

  const [safetyData, setSafetyData] =
    useState(null);

  const [safetyLoading, setSafetyLoading] =
    useState(false);

  const [scamText, setScamText] =
    useState("");

  const [scamResult, setScamResult] =
    useState("");

  const [scamLoading, setScamLoading] =
    useState(false);

  const [guidePlace, setGuidePlace] =
    useState("");

  const [guideResult, setGuideResult] =
    useState("");

  const [guideLoading, setGuideLoading] =
    useState(false);

  const [cameraOn, setCameraOn] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [trip, setTrip] =
    useState({
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

  const [videoStream, setVideoStream] =
    useState(null);


  // ==========================================================
  // DESTINATION IMAGES
  // ==========================================================

  useEffect(() => {

    let cancelled = false;

    async function loadImages() {

      const result = {};

      await Promise.all(
        destinations.map(async destination => {

          try {

            const url =
              "https://commons.wikimedia.org/w/api.php" +
              "?action=query" +
              "&generator=search" +
              "&gsrsearch=" +
              encodeURIComponent(
                destination.name
              ) +
              "&gsrnamespace=6" +
              "&gsrlimit=1" +
              "&prop=imageinfo" +
              "&iiprop=url" +
              "&iiurlwidth=800" +
              "&format=json" +
              "&origin=*";

            const response =
              await fetch(url);

            if (!response.ok) return;

            const data =
              await response.json();

            const pages =
              data?.query?.pages;

            if (!pages) return;

            const page =
              Object.values(pages)[0];

            const image =
              page?.imageinfo?.[0];

            if (
              image?.thumburl ||
              image?.url
            ) {

              result[destination.name] =
                image.thumburl ||
                image.url;

            }

          } catch (error) {

            console.warn(
              "Image unavailable:",
              destination.name
            );

          }

        })
      );

      if (!cancelled) {
        setImages(result);
      }

    }

    loadImages();

    return () => {
      cancelled = true;
    };

  }, []);


  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredDestinations =
    useMemo(() => {

      const value =
        search.trim().toLowerCase();

      return destinations.filter(
        destination => {

          const categoryMatch =
            selectedCategory === "All" ||
            destination.category ===
              selectedCategory;

          const searchMatch =
            !value ||
            destination.name
              .toLowerCase()
              .includes(value) ||
            destination.state
              .toLowerCase()
              .includes(value) ||
            destination.category
              .toLowerCase()
              .includes(value);

          return (
            categoryMatch &&
            searchMatch
          );

        }
      );

    }, [
      selectedCategory,
      search,
    ]);


  // ==========================================================
  // FORM
  // ==========================================================

  const handleChange = e => {

    const {
      name,
      value,
    } = e.target;

    setTrip(previous => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================================
  // OPEN PLANNER
  // ==========================================================

  const openPlanner =
    destination => {

      if (destination) {

        setTrip(previous => ({
          ...previous,
          destination,
        }));

      }

      setShowPlanner(true);

    };


  // ==========================================================
  // ITINERARY PARSER
  // ==========================================================

  const formatItinerary =
    text => {

      if (!text?.trim()) {
        return [];
      }

      let cleaned =
        text
          .replace(/\r\n/g, "\n")
          .replace(/\*\*/g, "")
          .replace(/^#+\s*/gm, "")
          .trim();


      // Normalize "DAY 1", "day 1:", etc.
      cleaned =
        cleaned.replace(
          /^\s*DAY\s+(\d+)\s*[:\-—]?\s*$/gim,
          "Day $1"
        );


      // Find every actual Day heading.
      const matches =
        [
          ...cleaned.matchAll(
            /^\s*Day\s+(\d+)\s*$/gim
          ),
        ];


      if (!matches.length) {

        return [
          {
            number: 1,
            title: "Day 1",
            content: cleaned,
          },
        ];

      }


      const days = [];

      matches.forEach(
        (match, index) => {

          const number =
            Number(match[1]);

          const start =
            match.index +
            match[0].length;

          const end =
            index + 1 <
            matches.length
              ? matches[index + 1].index
              : cleaned.length;

          const content =
            cleaned
              .slice(start, end)
              .trim();

          days.push({
            number,
            title: `Day ${number}`,
            content,
          });

        }
      );


      return days;

    };


  const itineraryDays =
    formatItinerary(itinerary);


  // ==========================================================
  // GENERATE TRIP
  // ==========================================================

  const handleSubmit =
    async e => {

      e.preventDefault();

      if (
        new Date(trip.endDate) <
        new Date(trip.startDate)
      ) {

        alert(
          "End date cannot be before the start date."
        );

        return;

      }

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
              "Unable to generate itinerary."
          );

        }

        setItinerary(
          data.itinerary || ""
        );

        setBudgetBreakdown(
          data.budgetBreakdown ||
            null
        );

        setShowPlanner(false);
        setShowItinerary(true);

      } catch (error) {

        console.error(error);

        alert(
          "Unable to generate your itinerary. Make sure Ollama and the Yatra AI backend are running."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // LOCAL INSIGHTS
  // ==========================================================

  const loadLocalInsights =
    async () => {

      if (!trip.destination?.trim()) {

        alert(
          "Please select a destination first."
        );

        setShowPlanner(true);

        return;

      }

      setLocalLoading(true);
      setLocalInsights(null);

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/local-insights",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  destination:
                    trip.destination.trim(),
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
              "Unable to load Local Insights."
          );

        }

        setLocalInsights(
          data.insights
        );

        setShowLocalInsights(true);

      } catch (error) {

        console.error(
          "Local Insights Error:",
          error
        );

        alert(
          error.message ||
            "Unable to load Local Insights."
        );

      } finally {

        setLocalLoading(false);

      }

    };


  // ==========================================================
  // TRAVEL SAFETY
  // ==========================================================

  const loadSafety =
    async () => {

      if (!trip.destination) {

        alert(
          "Please select a destination first."
        );

        setShowPlanner(true);

        return;

      }

      setSafetyLoading(true);
      setSafetyData(null);
      setScamResult("");

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/travel-safety",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  destination:
                    trip.destination,

                  startDate:
                    trip.startDate,

                  interests:
                    trip.interests,
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
              "Unable to load safety."
          );

        }

        setSafetyData(data);

        setShowSafety(true);

      } catch (error) {

        console.error(error);

        alert(
          "Unable to load Travel Safety."
        );

      } finally {

        setSafetyLoading(false);

      }

    };


  // ==========================================================
  // SCAM CHECK
  // ==========================================================

  const handleScamCheck =
    async () => {

      if (!scamText.trim()) {

        alert(
          "Describe the offer, message or situation first."
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

              body:
                JSON.stringify({
                  text: scamText,
                  destination:
                    trip.destination ||
                    "Unknown",
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
              "Unable to check scam."
          );

        }

        setScamResult(
          data.result || ""
        );

      } catch (error) {

        console.error(error);

        alert(
          "Unable to connect to the scam detector."
        );

      } finally {

        setScamLoading(false);

      }

    };


  // ==========================================================
  // CAMERA
  // ==========================================================

  const startCamera =
    async () => {

      try {

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: {
                  ideal: "environment",
                },
              },

              audio: false,
            }
          );

        setVideoStream(stream);
        setCameraOn(true);

      } catch (error) {

        console.error(error);

        alert(
          "Camera permission was not available. Please allow camera access in your browser."
        );

      }

    };


  const stopCamera =
    () => {

      if (videoStream) {

        videoStream
          .getTracks()
          .forEach(track =>
            track.stop()
          );

      }

      setVideoStream(null);
      setCameraOn(false);

    };


  useEffect(() => {

    return () => {

      if (videoStream) {

        videoStream
          .getTracks()
          .forEach(track =>
            track.stop()
          );

      }

    };

  }, [videoStream]);


  // ==========================================================
  // SMART GUIDE
  // ==========================================================

  const generateGuide =
    async () => {

      if (!trip.destination) {

        alert(
          "Please select a destination first."
        );

        return;

      }

      if (!guidePlace.trim()) {

        alert(
          "Enter or select the place you are looking at."
        );

        return;

      }

      setGuideLoading(true);
      setGuideResult("");

      try {

        const response =
          await fetch(
            "http://localhost:5000/api/smart-guide",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  destination:
                    trip.destination,

                  place:
                    guidePlace,
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
              "Unable to generate guide."
          );

        }

        setGuideResult(
          data.guide || ""
        );

      } catch (error) {

        console.error(error);

        alert(
          "Unable to generate Smart Tourist Guide."
        );

      } finally {

        setGuideLoading(false);

      }

    };


  // ==========================================================
  // LOGIN / REGISTER
  // ==========================================================

  const resetAuthForm = () => {
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
  };

  const handleAuthSubmit = async e => {
    e.preventDefault();

    if (!authEmail.trim() || !authPassword.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    if (authMode === "register" && !authName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (authPassword.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    setAuthLoading(true);

    try {
      const endpoint = authMode === "register"
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = authMode === "register"
        ? { name: authName.trim(), email: authEmail.trim(), password: authPassword }
        : { email: authEmail.trim(), password: authPassword };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed.");
      }

      setCurrentUser(data.user);
      localStorage.setItem("yatraUser", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("yatraToken", data.token);
      setShowLogin(false);
      resetAuthForm();

      alert(
        authMode === "register"
          ? "Account created successfully! Welcome to Yatra AI."
          : `Welcome back, ${data.user.name}!`
      );
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error.message || "Unable to connect to the Yatra AI server.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("yatraUser");
    localStorage.removeItem("yatraToken");
  };

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const closeAll =
    () => {

      setShowPlanner(false);
      setShowItinerary(false);
      setShowSafety(false);
      setShowLocalInsights(false);
      setShowSmartGuide(false);

    };


  const goHome =
    () => {

      closeAll();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    };


  const goExplore =
    () => {

      closeAll();

      setTimeout(() => {

        document
          .getElementById("explore")
          ?.scrollIntoView({
            behavior: "smooth",
          });

      }, 100);

    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="app">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={goHome}
        >
          <span className="logo-icon">✈️</span>
          <span className="logo-text">Yatra AI</span>
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
              openPlanner()
            }
          >
            Plan Trip
          </li>

          <li
            onClick={loadSafety}
          >
            Safety
          </li>

          <li
            onClick={loadLocalInsights}
          >
            Local Insights
          </li>

          <li
            onClick={() =>
              setShowSmartGuide(true)
            }
          >
            Smart Guide
          </li>

        </ul>

        <div className="navbar-account">
          {currentUser ? (
            <>
              <span className="user-greeting">
                Hi, {currentUser.name?.split(" ")[0]}
              </span>
              <button className="login-btn logged-in" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-btn"
              onClick={() => {
                setAuthMode("login");
                resetAuthForm();
                setShowLogin(true);
              }}
            >
              Login
            </button>
          )}
        </div>

      </nav>


      {/* ======================================================
          HERO (CINEMATIC BACKGROUND VIDEO & ENGAGING UI)
      ====================================================== */}

      <section className="hero has-video">

        {/* Ambient Cinematic Background Video */}
        <video
          ref={heroVideoRef}
          className="hero-bg-video"
          autoPlay
          loop
          muted
          playsInline
          src="/bgvid.mp4"
        />

        {/* Dark Cinematic Glass Overlay for contrast and readability */}
        <div className="hero-video-overlay" aria-hidden="true" />

        {/* Floating ambient glow accents */}
        <div className="hero-ambient-glow glow-1" aria-hidden="true" />
        <div className="hero-ambient-glow glow-2" aria-hidden="true" />

        <div className="hero-text">

          <span className="badge">
            <span className="badge-sparkle">✨</span> AI-POWERED TRAVEL COMPANION
          </span>

          <h1>
            Your journey.
            <br />
            <span>Our intelligence.</span>
          </h1>

          <p>
            Plan smarter, travel safer and
            discover more with Yatra AI.
          </p>

          {/* Quick Trending Destinations for Instant Engagement */}
          <div className="hero-trending">
            <span className="trending-label">🔥 Trending Now:</span>
            <div className="trending-chips">
              {["Goa 🏖️", "Manali 🏔️", "Kerala 🌴", "Jaipur 🏰", "Rishikesh 🧘"].map(dest => (
                <button
                  key={dest}
                  type="button"
                  className="trending-chip"
                  onClick={() => openPlanner(dest.split(" ")[0])}
                  title={`Plan your journey to ${dest.split(" ")[0]}`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-buttons">

            <button
              className="plan-btn"
              onClick={() =>
                openPlanner()
              }
            >
              Plan My Journey <span className="btn-arrow">→</span>
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
                {destinations.length}+
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


        <div className="hero-card">

          <div className="hero-card-glow" aria-hidden="true" />

          <div className="hero-card-header">
            <span className="mini-badge">
              YATRA AI
            </span>

            <span className="online-dot">
              <span className="live-indicator" /> AI Ready
            </span>
          </div>

          <h2>
            Where will you
            <br />
            <span>go next?</span>
          </h2>

          <p>
            Tell us your dream destination
            and let AI build your journey.
          </p>

          <div className="trip-input" onClick={() => openPlanner()}>
            <span>📍</span>
            <div>
              <small>
                DESTINATION
              </small>
              <strong>
                Choose your destination
              </strong>
            </div>
          </div>

          <div className="trip-input" onClick={() => openPlanner()}>
            <span>📅</span>
            <div>
              <small>
                TRAVEL DATES
              </small>
              <strong>
                Select your dates
              </strong>
            </div>
          </div>

          <div className="trip-input" onClick={() => openPlanner()}>
            <span>👥</span>
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
              openPlanner()
            }
          >
            Start Planning <span className="btn-arrow">→</span>
          </button>

        </div>

        {/* Ambient Video Control Pill */}
        <button
          type="button"
          className="video-control-pill"
          onClick={toggleVideoPlay}
          title={isVideoPlaying ? "Pause ambient video" : "Play ambient video"}
          aria-label={isVideoPlaying ? "Pause ambient video" : "Play ambient video"}
        >
          <span className="video-control-icon">{isVideoPlaying ? "⏸" : "▶"}</span>
          <span className="video-control-text">{isVideoPlaying ? "Ambient Video" : "Video Paused"}</span>
        </button>

      </section>


      {/* ======================================================
          FEATURES
      ====================================================== */}

      <section className="features">

        {/* Ambient colorful glow blobs */}
        <div className="features-ambient-glow feat-glow-1" aria-hidden="true" />
        <div className="features-ambient-glow feat-glow-2" aria-hidden="true" />

        <div className="section-heading">

          <span className="section-label colorful-label">
            ✨ WHY YATRA AI
          </span>

          <h2>
            Everything you need to
            <span className="gradient-text"> travel smarter.</span>
          </h2>

          <p>
            Experience next-generation AI travel planning with curated local intelligence.
          </p>

        </div>


        <div className="feature-grid">

          <div
            className="feature-card card-cyan"
            onClick={() =>
              openPlanner()
            }
          >
            <div className="card-top-row">
              <div className="feature-icon icon-cyan">
                🤖
              </div>
              <span className="card-fun-badge badge-cyan">AI Magic ✨</span>
              <span className="feature-number">
                01
              </span>
            </div>

            <h3>
              AI Trip Planner
            </h3>

            <p>
              Personalized itineraries
              based on dates, interests,
              travelers and budget.
            </p>

            <div className="card-action-cue">
              <span>Plan your trip</span>
              <span className="action-arrow">→</span>
            </div>
          </div>


          <div
            className="feature-card card-emerald"
            onClick={loadSafety}
          >
            <div className="card-top-row">
              <div className="feature-icon icon-emerald">
                🛡️
              </div>
              <span className="card-fun-badge badge-emerald">Safe Travel 🛡️</span>
              <span className="feature-number">
                02
              </span>
            </div>

            <h3>
              Travel Safety
            </h3>

            <p>
              Best travel time, crowd
              estimates, safety advice
              and scam detection.
            </p>

            <div className="card-action-cue">
              <span>Check safety</span>
              <span className="action-arrow">→</span>
            </div>
          </div>


          <div
            className="feature-card card-amber"
            onClick={loadLocalInsights}
          >
            <div className="card-top-row">
              <div className="feature-icon icon-amber">
                🍛
              </div>
              <span className="card-fun-badge badge-amber">Local Vibe 🌶️</span>
              <span className="feature-number">
                03
              </span>
            </div>

            <h3>
              Local Insights
            </h3>

            <p>
              Discover local food,
              souvenirs, shopping areas
              and budget stay areas.
            </p>

            <div className="card-action-cue">
              <span>Explore food & stays</span>
              <span className="action-arrow">→</span>
            </div>
          </div>


          <div
            className="feature-card card-purple"
            onClick={() =>
              setShowSmartGuide(true)
            }
          >
            <div className="card-top-row">
              <div className="feature-icon icon-purple">
                📷
              </div>
              <span className="card-fun-badge badge-purple">AR Vision 📸</span>
              <span className="feature-number">
                04
              </span>
            </div>

            <h3>
              Smart Tourist Guide
            </h3>

            <p>
              Point your camera toward
              a place and use Yatra AI
              as your digital guide.
            </p>

            <div className="card-action-cue">
              <span>Launch AR guide</span>
              <span className="action-arrow">→</span>
            </div>
          </div>

        </div>

      </section>


      {/* ======================================================
          EXPLORE
      ====================================================== */}

      <section
        className="explore-section"
        id="explore"
      >

        <div className="explore-heading">

          <div>

            <span className="section-label colorful-label">
              🌈 DISCOVER INDIA
            </span>

            <h2>
              Explore your
              <span className="gradient-text"> next escape.</span>
            </h2>

            <p>
              From the snowcapped peaks of Ladakh to the sunny beaches of Goa and ancient temples of Varanasi.
            </p>

          </div>

          <div className="destination-count">

            <strong>
              {destinations.length}+
            </strong>

            <span>
              Destinations
            </span>

          </div>

        </div>


        <div className="explore-controls">

          <div className="search-box">

            <span>🔎</span>

            <input
              value={search}
              onChange={e =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search destinations, states, vibes..."
            />

            {search && (
              <button
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

          </div>


          <div className="category-list">

            {categories.map(
              category => (

                <button
                  key={category}
                  className={
                    selectedCategory ===
                    category
                      ? `category-btn active cat-${category.toLowerCase()}`
                      : `category-btn cat-${category.toLowerCase()}`
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >
                  <span className="cat-icon">{categoryIcons[category] || "✨"}</span>
                  <span className="cat-text">{category}</span>
                </button>

              )
            )}

          </div>

        </div>


        <div className="destination-grid">

          {filteredDestinations.map(
            destination => (

              <div
                className={`destination-card card-${destination.category.toLowerCase()}`}
                key={destination.name}
              >

                <div className="destination-image">

                  {images[
                    destination.name
                  ] ? (

                    <img
                      src={
                        images[
                          destination.name
                        ]
                      }
                      alt={
                        destination.name
                      }
                      onError={() =>
                        setImages(
                          previous => {

                            const copy = {
                              ...previous,
                            };

                            delete copy[
                              destination.name
                            ];

                            return copy;

                          }
                        )
                      }
                    />

                  ) : (

                    <div className="image-loading">

                      <span>
                        {destination.emoji}
                      </span>

                      <small>
                        Discover{" "}
                        {destination.name}
                      </small>

                    </div>

                  )}

                  <div className="image-overlay" />

                  {/* Colorful Category Tag with Emoji */}
                  <span className={`destination-tag tag-${destination.category.toLowerCase()}`}>
                    {destination.emoji} {destination.category}
                  </span>

                  {/* Interactive Heart Wishlist Button */}
                  <button
                    type="button"
                    className={`destination-like-btn ${likedDestinations[destination.name] ? "liked" : ""}`}
                    onClick={(e) => toggleLike(e, destination.name)}
                    title={likedDestinations[destination.name] ? "Saved to wishlist" : "Add to wishlist"}
                    aria-label="Save destination"
                  >
                    {likedDestinations[destination.name] ? "❤️" : "🤍"}
                  </button>

                </div>


                <div className="destination-content">

                  <div className="destination-title-row">
                    <h3>
                      {destination.name}
                    </h3>
                    <span className="destination-emoji-pill">{destination.emoji}</span>
                  </div>

                  <span className="destination-state">
                    📍 {destination.state}
                  </span>

                  <p>
                    {destination.description}
                  </p>

                  <button
                    className="destination-btn"
                    onClick={() =>
                      openPlanner(
                        destination.name
                      )
                    }
                  >
                    <span>Plan this trip</span>
                    <span className="btn-arrow">→</span>
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* ======================================================
          PLANNER MODAL
      ====================================================== */}

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

            <span className="ai-badge">
              ✨ YATRA AI PLANNER
            </span>

            <h2>
              Plan Your Journey
            </h2>

            <p className="modal-subtitle">
              Tell Yatra AI about your
              trip and we'll build a
              personalized itinerary.
            </p>


            <form
              onSubmit={handleSubmit}
            >

              <label>
                Destination

                <input
                  name="destination"
                  value={
                    trip.destination
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Goa"
                  required
                />

              </label>


              <div className="date-row">

                <label>
                  Start Date

                  <input
                    type="date"
                    name="startDate"
                    value={
                      trip.startDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </label>


                <label>
                  End Date

                  <input
                    type="date"
                    name="endDate"
                    value={
                      trip.endDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </label>

              </div>


              <label>
                Travelers

                <input
                  type="number"
                  name="travelers"
                  min="1"
                  max="20"
                  value={
                    trip.travelers
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </label>


              <label>
                Budget

                <select
                  name="budget"
                  value={
                    trip.budget
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select budget
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
                Interests

                <input
                  name="interests"
                  value={
                    trip.interests
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Food, culture, adventure..."
                />

              </label>


              <button
                className="generate-btn"
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


      {/* ======================================================
          ITINERARY
      ====================================================== */}

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

            <span className="ai-badge">
              ✨ YATRA AI
            </span>

            <h2>
              Your Personalized Journey
            </h2>

            <p className="itinerary-intro">
              Smart travel plan for{" "}
              <strong>
                {trip.destination}
              </strong>
            </p>


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
                  📅 Dates
                </span>

                <strong>
                  {trip.startDate}
                  {" → "}
                  {trip.endDate}
                </strong>
              </div>

            </div>


            {budgetBreakdown && (

              <div className="budget-card">

                <span className="section-label">
                  SMART ESTIMATE
                </span>

                <h3>
                  💰 Trip Budget
                </h3>

                <div className="budget-total-small">
                  ₹
                  {Number(
                    budgetBreakdown.total
                  ).toLocaleString(
                    "en-IN"
                  )}
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
                    Estimated Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      budgetBreakdown.total
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            )}


            <div className="trip-map-card">

              <div className="section-label">
                📍 DESTINATION MAP
              </div>

              <h3>
                🗺️ Explore{" "}
                {trip.destination}
              </h3>

              <YatraMap
                destination={
                  trip.destination
                }
              />

            </div>


            {/* ==================================================
                DAY CARDS
            ================================================== */}

            <div className="ai-itinerary">

              <span className="section-label">
                ✨ YOUR AI TRAVEL PLAN
              </span>

              <h3>
                🗺️ Day-by-Day Itinerary
              </h3>


              <div className="day-cards">

                {itineraryDays.length > 0
                  ? itineraryDays.map(
                      day => (

                        <div
                          className="day-card"
                          key={`day-${day.number}`}
                        >

                          <div className="day-card-top">

                            <div className="day-icon">
                              {day.number === 1
                                ? "🌅"
                                : day.number === 2
                                ? "🌴"
                                : day.number === 3
                                ? "🏛️"
                                : day.number === 4
                                ? "🍜"
                                : "✨"}
                            </div>

                            <div>

                              <span className="day-label">
                                DAY {day.number}
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
                                line =>
                                  line.trim()
                              )
                              .map(
                                (
                                  line,
                                  index
                                ) => {

                                  const clean =
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

                                  const heading =
                                    /^(Morning|Afternoon|Evening|Food|Transportation|Estimated Expenses|Safety|Local Experience)\s*:/i
                                      .test(
                                        clean
                                      );

                                  return (

                                    <div
                                      className={
                                        heading
                                          ? "itinerary-line itinerary-heading-line"
                                          : "itinerary-line"
                                      }
                                      key={
                                        index
                                      }
                                    >

                                      {!heading && (
                                        <span className="bullet">
                                          ✦
                                        </span>
                                      )}

                                      <span>
                                        {clean}
                                      </span>

                                    </div>

                                  );

                                }
                              )}

                          </div>

                        </div>

                      )
                    )
                  : (

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


      {/* ======================================================
          TRAVEL SAFETY + SCAM DETECTION
      ====================================================== */}

      {showSafety && (

        <div className="modal-overlay">

          <div className="large-modal">

            <button
              className="close-btn"
              onClick={() =>
                setShowSafety(false)
              }
            >
              ✕
            </button>

            <span className="ai-badge">
              🛡️ YATRA AI SAFETY
            </span>

            <h2>
              Travel Safety
            </h2>

            <p className="modal-subtitle">
              Stay informed before and
              during your journey.
            </p>


            {safetyLoading ? (

              <div className="loading-state">
                🤖 Yatra AI is checking
                travel conditions...
              </div>

            ) : safetyData ? (

              <>

                {/* BEST TIME */}

                <div className="safety-card-grid">

                  <div className="safety-feature-card">

                    <div className="feature-icon">
                      📅
                    </div>

                    <span className="section-label">
                      BEST TIME TO VISIT
                    </span>

                    <h3>
                      {safetyData.bestTime}
                    </h3>

                    <p>
                      {safetyData.bestTimeReason}
                    </p>

                  </div>


                  {/* CROWD */}

                  <div className="safety-feature-card">

                    <div className="feature-icon">
                      👥
                    </div>

                    <span className="section-label">
                      CROWD FLOW
                    </span>

                    <h3>
                      {safetyData.crowdLevel}
                    </h3>

                    <p>
                      {safetyData.crowdExplanation}
                    </p>

                  </div>

                </div>


                {/* SAFETY TIPS */}

                <div className="safety-section">

                  <span className="section-label">
                    🛡️ SAFETY TIPS
                  </span>

                  <div className="safety-tip-grid">

                    {safetyData
                      .safetyTips
                      ?.map(
                        (tip, index) => (

                          <div
                            className="safety-tip-card"
                            key={index}
                          >
                            <span>
                              ✓
                            </span>

                            <p>
                              {tip}
                            </p>

                          </div>

                        )
                      )}

                  </div>

                </div>


                {/* SCAM DETECTION */}

                <div className="scam-section">

                  <span className="section-label">
                    🚨 SCAM DETECTION
                  </span>

                  <h3>
                    Check a suspicious
                    travel situation
                  </h3>

                  <p>
                    Enter a taxi quote,
                    hotel offer, message,
                    tour package or payment
                    request and Yatra AI
                    will assess the warning
                    signs.
                  </p>


                  <textarea
                    value={scamText}
                    onChange={e =>
                      setScamText(
                        e.target.value
                      )
                    }
                    placeholder="Example: A taxi driver is asking ₹3,000 for a short airport ride..."
                    rows={6}
                  />


                  <button
                    className="generate-btn"
                    onClick={
                      handleScamCheck
                    }
                    disabled={
                      scamLoading
                    }
                  >
                    {scamLoading
                      ? "🤖 Checking..."
                      : "🔍 Check for Scam"}
                  </button>


                  {scamResult && (

                    <div className="scam-result-card">

                      <span className="section-label">
                        AI SAFETY ANALYSIS
                      </span>

                      <pre>
                        {scamResult}
                      </pre>

                    </div>

                  )}

                </div>

              </>

            ) : (

              <div className="empty-state">
                <p>
                  Safety information
                  could not be loaded.
                </p>
              </div>

            )}

          </div>

        </div>

      )}


      {/* ======================================================
          LOCAL INSIGHTS
      ====================================================== */}

      {showLocalInsights && (

        <div className="modal-overlay">

          <div className="large-modal">

            <button
              className="close-btn"
              onClick={() =>
                setShowLocalInsights(false)
              }
            >
              ✕
            </button>

            <span className="ai-badge">
              🍛 YATRA AI LOCAL INSIGHTS
            </span>

            <h2>
              Discover{" "}
              {trip.destination}
            </h2>

            <p className="modal-subtitle">
              Go beyond tourist attractions.
              Discover what makes the
              locality special.
            </p>


            {localLoading ? (

              <div className="loading-state">
                🍛 Yatra AI is discovering
                the locality...
              </div>

            ) : localInsights ? (

              <>

                {!localInsights.verified && (

                  <div className="info-warning">
                    ℹ️ Verified local data is
                    currently limited for this
                    destination.
                  </div>

                )}


                {/* BEST TIME */}

                <div className="local-highlight">

                  <div className="feature-icon">
                    📅
                  </div>

                  <div>

                    <span className="section-label">
                      BEST TIME
                    </span>

                    <h3>
                      {localInsights.bestTime}
                    </h3>

                    <p>
                      {localInsights.bestTimeReason}
                    </p>

                  </div>

                </div>


                {/* FOOD */}

                {localInsights.food
                  ?.length > 0 && (

                  <section className="local-section">

                    <span className="section-label">
                      🍛 LOCAL FOOD
                    </span>

                    <h3>
                      Must-try food
                    </h3>

                    <div className="local-grid">

                      {localInsights.food.map(
                        food => (

                          <div
                            className="local-card"
                            key={food.name}
                          >

                            <div className="local-card-icon">
                              🍽️
                            </div>

                            <h4>
                              {food.name}
                            </h4>

                            <p>
                              {food.description}
                            </p>

                            {food.mustTry && (

                              <span className="must-try">
                                ⭐ Must Try
                              </span>

                            )}

                          </div>

                        )
                      )}

                    </div>

                  </section>

                )}


                {/* FOOD AREAS */}

                {localInsights
                  .foodAreas
                  ?.length > 0 && (

                  <section className="local-section">

                    <span className="section-label">
                      📍 FOOD AREAS
                    </span>

                    <h3>
                      Where to explore local food
                    </h3>

                    <div className="local-grid">

                      {localInsights
                        .foodAreas
                        .map(area => (

                          <div
                            className="local-card"
                            key={area.name}
                          >

                            <div className="local-card-icon">
                              📍
                            </div>

                            <h4>
                              {area.name}
                            </h4>

                            <p>
                              {area.description}
                            </p>

                          </div>

                        ))}

                    </div>

                  </section>

                )}


                {/* FAMOUS FOR */}

                {localInsights
                  .famousFor
                  ?.length > 0 && (

                  <section className="local-section">

                    <span className="section-label">
                      ⭐ LOCAL HIGHLIGHTS
                    </span>

                    <h3>
                      What is this place famous for?
                    </h3>

                    <div className="famous-list">

                      {localInsights
                        .famousFor
                        .map(
                          item => (

                            <div
                              className="famous-pill"
                              key={item}
                            >
                              ✦ {item}
                            </div>

                          )
                        )}

                    </div>

                  </section>

                )}


                {/* SOUVENIRS */}

                {localInsights
                  .souvenirs
                  ?.length > 0 && (

                  <section className="local-section">

                    <span className="section-label">
                      🛍️ LOCAL SHOPPING
                    </span>

                    <h3>
                      Souvenirs worth taking home
                    </h3>

                    <div className="local-grid">

                      {localInsights
                        .souvenirs
                        .map(item => (

                          <div
                            className="local-card"
                            key={item.item}
                          >

                            <div className="local-card-icon">
                              🛍️
                            </div>

                            <h4>
                              {item.item}
                            </h4>

                            <p>
                              {item.description}
                            </p>

                            <div className="buy-box">

                              <strong>
                                Where to buy
                              </strong>

                              <span>
                                {item.whereToBuy}
                              </span>

                            </div>

                          </div>

                        ))}

                    </div>

                  </section>

                )}


                {/* STAYS */}

                {localInsights
                  .stays
                  ?.length > 0 && (

                  <section className="local-section">

                    <span className="section-label">
                      🏨 STAY SMART
                    </span>

                    <h3>
                      Budget-friendly stay areas
                    </h3>

                    <div className="local-grid">

                      {localInsights
                        .stays
                        .map(stay => (

                          <div
                            className="local-card hotel-card"
                            key={stay.area}
                          >

                            <div className="local-card-icon">
                              🏨
                            </div>

                            <h4>
                              {stay.area}
                            </h4>

                            <p>
                              {stay.recommendation}
                            </p>

                            <small>
                              Compare recent
                              reviews and current
                              prices before booking.
                            </small>

                          </div>

                        ))}

                    </div>

                  </section>

                )}


                {/* LOCAL SAFETY */}

                {localInsights
                  .safety
                  ?.length > 0 && (

                  <section className="local-section">

                    <span className="section-label">
                      🛡️ LOCAL TIPS
                    </span>

                    <div className="safety-tip-grid">

                      {localInsights
                        .safety
                        .map(
                          (tip, index) => (

                            <div
                              className="safety-tip-card"
                              key={index}
                            >

                              <span>
                                ✓
                              </span>

                              <p>
                                {tip}
                              </p>

                            </div>

                          )
                        )}

                    </div>

                  </section>

                )}

              </>

            ) : null}

          </div>

        </div>

      )}


      {/* ======================================================
          SMART TOURIST GUIDE
      ====================================================== */}

      {showSmartGuide && (

        <div className="modal-overlay">

          <div className="large-modal smart-guide-modal">

            <button
              className="close-btn"
              onClick={() => {

                stopCamera();

                setShowSmartGuide(
                  false
                );

              }}
            >
              ✕
            </button>

            <span className="ai-badge">
              📷 YATRA AI SMART GUIDE
            </span>

            <h2>
              Your Digital Tourist Guide
            </h2>

            <p className="modal-subtitle">
              Point your camera toward a
              landmark or place, then tell
              Yatra AI what you're looking at.
            </p>


            {/* CAMERA */}

            <div className="camera-container">

              {cameraOn ? (

                <video
                  className="guide-camera"
                  autoPlay
                  playsInline
                  muted
                  ref={video => {

                    if (
                      video &&
                      videoStream
                    ) {

                      video.srcObject =
                        videoStream;

                    }

                  }}
                />

              ) : (

                <div className="camera-placeholder">

                  <div>
                    📷
                  </div>

                  <h3>
                    Camera Guide
                  </h3>

                  <p>
                    Use your phone camera
                    to look at a landmark.
                  </p>

                </div>

              )}

              <div className="camera-overlay">

                <div className="camera-frame">
                  <span />
                  <span />
                  <span />
                  <span />
                  <div className="scanner-line" />
                </div>

              </div>

            </div>


            <div className="camera-buttons">

              {!cameraOn ? (

                <button
                  className="generate-btn"
                  onClick={
                    startCamera
                  }
                >
                  📷 Start Camera
                </button>

              ) : (

                <button
                  className="secondary-btn"
                  onClick={
                    stopCamera
                  }
                >
                  Stop Camera
                </button>

              )}

            </div>


            <div className="guide-input-card">

              <span className="section-label">
                📍 WHAT ARE YOU LOOKING AT?
              </span>

              <input
                value={guidePlace}
                onChange={e =>
                  setGuidePlace(
                    e.target.value
                  )
                }
                placeholder="Example: Victoria Memorial"
              />

              <p>
                For the current Gemma 3 1B
                setup, enter the landmark
                name after pointing the camera.
                This avoids pretending that a
                text-only model can reliably
                recognise arbitrary landmarks
                from an image.
              </p>

              <button
                className="generate-btn"
                onClick={
                  generateGuide
                }
                disabled={
                  guideLoading
                }
              >
                {guideLoading
                  ? "🤖 Preparing guide..."
                  : "✨ Guide Me"}
              </button>

            </div>


            {guideResult && (

              <div className="guide-result">

                <span className="section-label">
                  🧭 YATRA DIGITAL GUIDE
                </span>

                <pre>
                  {guideResult}
                </pre>

              </div>

            )}

          </div>

        </div>

      )}

      {/* ======================================================
          LOGIN / REGISTER MODAL
      ====================================================== */}

      {showLogin && (
        <div
          className="modal-overlay auth-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowLogin(false);
              resetAuthForm();
            }
          }}
        >
          <div className="auth-modal">
            <button
              className="close-btn"
              onClick={() => {
                setShowLogin(false);
                resetAuthForm();
              }}
            >
              ✕
            </button>

            <div className="auth-logo">✈️</div>
            <span className="ai-badge">YATRA AI ACCOUNT</span>

            <h2>
              {authMode === "login" ? "Welcome back" : "Create your account"}
            </h2>

            <p className="modal-subtitle">
              {authMode === "login"
                ? "Login to continue your journey with Yatra AI."
                : "Create an account to personalize your Yatra AI experience."}
            </p>

            <div className="auth-tabs">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => { setAuthMode("login"); resetAuthForm(); }}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => { setAuthMode("register"); resetAuthForm(); }}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === "register" && (
                <label>
                  Full Name
                  <input
                    type="text"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                  />
                </label>
              )}

              <label>
                Email Address
                <input
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  minLength="6"
                  required
                />
              </label>

              <button className="generate-btn auth-submit-btn" type="submit" disabled={authLoading}>
                {authLoading
                  ? "⏳ Please wait..."
                  : authMode === "login"
                  ? "🔐 Login to Yatra AI"
                  : "✨ Create Account"}
              </button>
            </form>

            <p className="auth-note">
              Your account helps Yatra AI personalize your travel experience.
            </p>
          </div>
        </div>
      )}

    </div>

  );

}

export default App;