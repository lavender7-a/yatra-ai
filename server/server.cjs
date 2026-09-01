const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Yatra AI backend is running!"
  });
});


// ==========================================
// CALCULATE TRIP BUDGET
// ==========================================

function calculateBudget(startDate, endDate, travelers, budget) {

  const start = new Date(startDate);
  const end = new Date(endDate);

  let days = Math.ceil(
    (end - start) / (1000 * 60 * 60 * 24)
  );

  // Minimum 1 day
  if (days < 1) {
    days = 1;
  }

  const people = Number(travelers) || 1;


  // Approximate daily budget PER PERSON
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


  // Percentage allocation
  const accommodation =
    Math.round(
      dailyBudget *
      days *
      people *
      0.35
    );

  const food =
    Math.round(
      dailyBudget *
      days *
      people *
      0.25
    );

  const transportation =
    Math.round(
      dailyBudget *
      days *
      people *
      0.15
    );

  const activities =
    Math.round(
      dailyBudget *
      days *
      people *
      0.20
    );

  const miscellaneous =
    Math.round(
      dailyBudget *
      days *
      people *
      0.05
    );


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

    total

  };

}


// ==========================================
// AI TRIP PLANNER
// ==========================================

app.post("/api/plan-trip", async (req, res) => {

  try {

    const {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      interests
    } = req.body;


    console.log("Trip request received:");
    console.log(req.body);


    // ======================================
    // CALCULATE BUDGET
    // ======================================

    const budgetBreakdown = calculateBudget(
      startDate,
      endDate,
      travelers,
      budget
    );


    // ======================================
    // AI PROMPT
    // ======================================

    const prompt = `

You are Yatra AI, an intelligent travel planning assistant.

Create a practical, realistic and personalized travel itinerary.

TRIP DETAILS

Destination: ${destination}

Start Date: ${startDate}

End Date: ${endDate}

Number of Travelers: ${travelers}

Budget Category: ${budget}

Interests: ${interests}


IMPORTANT CURRENCY RULE:

This is an Indian travel application.

ALL prices and expenses MUST be written in Indian Rupees (₹).

DO NOT use dollars ($).

DO NOT use USD.

Examples:

₹500

₹1,500

₹5,000

₹10,000


Create a day-by-day itinerary.

For each day include:

• Morning activities
• Afternoon activities
• Evening activities
• Food recommendations
• Transportation suggestions
• Approximate expenses in ₹
• Safety tips
• Tourist scam warnings
• One unique/local experience


IMPORTANT:

Do not invent businesses, prices or facts.

If you are uncertain about a specific place or price,
give a general recommendation instead.

Keep the itinerary practical and easy to follow.

Make the response attractive and well organized.

Use headings and bullet points.

Remember:

USE ₹ FOR ALL MONEY VALUES.
NEVER USE $ OR USD.

`;


    // ======================================
    // SEND REQUEST TO OLLAMA
    // ======================================

    const response = await fetch(
      "http://localhost:11434/api/generate",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "gemma3:1b",

          prompt: prompt,

          stream: false

        })

      }
    );


    if (!response.ok) {

      throw new Error(
        `Ollama returned status ${response.status}`
      );

    }


    const data = await response.json();


    console.log("AI response received");


    // ======================================
    // SEND RESULT TO FRONTEND
    // ======================================

    res.json({

      success: true,

      itinerary: data.response,

      budgetBreakdown: budgetBreakdown

    });


  } catch (error) {

    console.error("AI Error:", error);


    res.status(500).json({

      success: false,

      message: "Unable to generate itinerary.",

      error: error.message

    });

  }

});
// ==========================================
// TRAVEL SCAM DETECTOR
// ==========================================

app.post("/api/check-scam", async (req, res) => {

  try {

    const { text, destination } = req.body;

    console.log("Scam check request received:");
    console.log({
      text,
      destination
    });


    const scamPrompt = `

You are Yatra AI, an intelligent travel safety assistant.

Your job is to analyze a travel-related offer, message, price,
request, or situation and identify possible tourist scam risks.

DESTINATION:
${destination}

TRAVELER'S SITUATION:
${text}


Analyze the situation carefully.

Return your answer in this exact structure:

🚨 SCAM RISK: LOW / MEDIUM / HIGH

🔎 ANALYSIS:
Explain briefly why this situation may or may not be suspicious.

⚠️ WARNING SIGNS:
• List the suspicious signs, if any.
• Mention unusual pricing, pressure tactics,
  fake offers, advance payments, unofficial agents,
  identity/document requests, etc. when relevant.

✅ WHAT YOU SHOULD DO:
• Give practical steps the traveler should take.
• Recommend verification before making payments.
• Suggest safer alternatives where appropriate.

🛡️ YATRA SAFETY TIP:
Give one short safety tip.

IMPORTANT:

- Do not automatically call something a scam.
- Consider that prices and practices can vary by destination.
- If there is not enough information, say that the traveler
  should verify the information.
- Do not invent specific businesses or official prices.
- Do not claim something is definitely a scam without evidence.
- Keep the answer practical and easy to understand.
- Use Indian Rupees (₹) whenever discussing money.
- Never use dollars ($) or USD.

`;


    // ======================================
    // SEND REQUEST TO OLLAMA
    // ======================================

    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "gemma3:1b",

          prompt: scamPrompt,

          stream: false

        })
      }
    );


    if (!response.ok) {

      throw new Error(
        `Ollama returned status ${response.status}`
      );

    }


    const data = await response.json();


    console.log("Scam analysis received");


    // ======================================
    // SEND RESULT TO FRONTEND
    // ======================================

    res.json({

      success: true,

      result: data.response

    });


  } catch (error) {

    console.error("Scam Detection Error:", error);


    res.status(500).json({

      success: false,

      message: "Unable to analyze the travel situation.",

      error: error.message

    });

  }

});

// ==========================================
// START SERVER
// ==========================================


app.listen(PORT, () => {

  console.log(
    `Yatra AI backend running on http://localhost:${PORT}`
  );

});