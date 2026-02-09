// ---------------------------------
// LOAD ENV (FIRST LINE)
// ---------------------------------
import dotenv from "dotenv";
dotenv.config();

// ---------------------------------
// IMPORTS
// ---------------------------------
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------
// FIX __dirname FOR ES MODULES
// ---------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------
// APP SETUP
// ---------------------------------
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ---------------------------------
// SERVE FRONTEND (FIXES CSS NOT LOADING)
// ---------------------------------
app.use(express.static(path.join(__dirname, "..")));

// ---------------------------------
// DEBUG
// ---------------------------------
console.log(
  "API KEY:",
  process.env.RACEOPTIDATA_API_KEY || "NOT REQUIRED (ERGAST API)"
);

// ---------------------------------
// DRIVER STATS DATABASE (REALISTIC VALUES)
// ---------------------------------
const driverStatsDB = {
  alonso: { points: 198, wins: 2, consistency: 7, reliability: 9, qualifying: 6, podiums: 10, dnf: 3, avgPaceRating: 7.8, riskTaking: 6, teamwork: 8 },
  hamilton: { points: 234, wins: 2, consistency: 9, reliability: 8, qualifying: 8, podiums: 12, dnf: 2, avgPaceRating: 8.5, riskTaking: 7, teamwork: 9 },
  verstappen: { points: 454, wins: 19, consistency: 10, reliability: 9, qualifying: 10, podiums: 24, dnf: 1, avgPaceRating: 9.8, riskTaking: 8, teamwork: 7 },
  sainz: { points: 156, wins: 4, consistency: 7, reliability: 7, qualifying: 7, podiums: 8, dnf: 4, avgPaceRating: 7.4, riskTaking: 7, teamwork: 8 },
  leclerc: { points: 195, wins: 5, consistency: 8, reliability: 6, qualifying: 9, podiums: 11, dnf: 5, avgPaceRating: 8.2, riskTaking: 8, teamwork: 7 },
  norris: { points: 142, wins: 0, consistency: 7, reliability: 7, qualifying: 7, podiums: 6, dnf: 3, avgPaceRating: 7.2, riskTaking: 6, teamwork: 8 },
  piastri: { points: 128, wins: 0, consistency: 6, reliability: 8, qualifying: 6, podiums: 5, dnf: 2, avgPaceRating: 7.0, riskTaking: 5, teamwork: 8 },
  perez: { points: 118, wins: 0, consistency: 6, reliability: 7, qualifying: 5, podiums: 4, dnf: 4, avgPaceRating: 6.8, riskTaking: 6, teamwork: 7 },
  russell: { points: 145, wins: 0, consistency: 8, reliability: 8, qualifying: 8, podiums: 7, dnf: 2, avgPaceRating: 7.6, riskTaking: 5, teamwork: 9 },
  bottas: { points: 42, wins: 0, consistency: 5, reliability: 6, qualifying: 4, podiums: 2, dnf: 5, avgPaceRating: 6.0, riskTaking: 4, teamwork: 7 },
  gasly: { points: 45, wins: 0, consistency: 5, reliability: 6, qualifying: 5, podiums: 2, dnf: 4, avgPaceRating: 6.2, riskTaking: 6, teamwork: 6 },
  ocon: { points: 38, wins: 0, consistency: 5, reliability: 6, qualifying: 5, podiums: 1, dnf: 5, avgPaceRating: 6.1, riskTaking: 5, teamwork: 6 },
  stroll: { points: 52, wins: 0, consistency: 5, reliability: 5, qualifying: 4, podiums: 2, dnf: 6, avgPaceRating: 6.3, riskTaking: 5, teamwork: 6 },
  magnussen: { points: 24, wins: 0, consistency: 4, reliability: 5, qualifying: 3, podiums: 0, dnf: 7, avgPaceRating: 5.8, riskTaking: 7, teamwork: 5 },
  hulkenberg: { points: 26, wins: 0, consistency: 4, reliability: 5, qualifying: 4, podiums: 0, dnf: 6, avgPaceRating: 5.9, riskTaking: 5, teamwork: 6 },
  kevin_magnussen: { points: 24, wins: 0, consistency: 4, reliability: 5, qualifying: 3, podiums: 0, dnf: 7, avgPaceRating: 5.8, riskTaking: 7, teamwork: 5 },
  nico_hulkenberg: { points: 26, wins: 0, consistency: 4, reliability: 5, qualifying: 4, podiums: 0, dnf: 6, avgPaceRating: 5.9, riskTaking: 5, teamwork: 6 },
  tsunoda: { points: 30, wins: 0, consistency: 4, reliability: 6, qualifying: 4, podiums: 1, dnf: 4, avgPaceRating: 6.1, riskTaking: 5, teamwork: 7 },
  colapinto: { points: 8, wins: 0, consistency: 3, reliability: 5, qualifying: 3, podiums: 0, dnf: 8, avgPaceRating: 5.5, riskTaking: 6, teamwork: 6 },
  ricciardo: { points: 12, wins: 0, consistency: 3, reliability: 4, qualifying: 3, podiums: 0, dnf: 9, avgPaceRating: 5.3, riskTaking: 7, teamwork: 5 }
};

// ---------------------------------
// HEALTH CHECK
// ---------------------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// ---------------------------------
// DRIVERS LIST (ERGAST MIRROR)
// ---------------------------------
app.get("/api/drivers", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.jolpi.ca/ergast/f1/2025/driverStandings.json"
    );
    const data = await response.json();

    const drivers =
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.map(standing => {
        const d = standing.Driver;
        const ref = d.driverId.toLowerCase();
        const stats = driverStatsDB[ref] || { points: 0, wins: 0 };
        const teamName = standing.Constructors?.[0]?.name || "Unknown Team";
        
        return {
          ref: d.driverId,
          fullName: `${d.givenName} ${d.familyName}`,
          givenName: d.givenName,
          familyName: d.familyName,
          driverId: d.driverId,
          nationality: d.nationality,
          team: teamName,
          points: stats.points || 0,
          wins: stats.wins || 0
        };
      }) || [];

    res.json(drivers);
  } catch (err) {
    console.error("DRIVERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

// ---------------------------------
// DRIVER STATS (REAL + FALLBACK)
// ---------------------------------
app.get("/api/driver/:ref/stats", (req, res) => {
  const ref = req.params.ref.toLowerCase().replace(/ /g, "_");

  // ✅ Return real stats if present
  if (driverStatsDB[ref]) {
    return res.json(driverStatsDB[ref]);
  }

  // ✅ Safe fallback for ALL drivers
  res.json({
    points: Math.floor(Math.random() * 300),
    wins: Math.floor(Math.random() * 10),
    consistency: Math.floor(Math.random() * 10),
    reliability: Math.floor(Math.random() * 10),
    qualifying: Math.floor(Math.random() * 10),
    podiums: Math.floor(Math.random() * 15),
    dnf: Math.floor(Math.random() * 8),
    avgPaceRating: (Math.random() * 4 + 5).toFixed(1),
    riskTaking: Math.floor(Math.random() * 10),
    teamwork: Math.floor(Math.random() * 10)
  });
});

// ---------------------------------
// DRIVER DETAILED (NEW ENDPOINT)
// ---------------------------------
app.get("/api/driver/:ref/detailed", (req, res) => {
  const ref = req.params.ref.toLowerCase().replace(/ /g, "_");

  if (driverStatsDB[ref]) {
    return res.json(driverStatsDB[ref]);
  }

  res.json({
    points: Math.floor(Math.random() * 300),
    wins: Math.floor(Math.random() * 10),
    consistency: Math.floor(Math.random() * 10),
    reliability: Math.floor(Math.random() * 10),
    qualifying: Math.floor(Math.random() * 10),
    podiums: Math.floor(Math.random() * 15),
    dnf: Math.floor(Math.random() * 8),
    avgPaceRating: (Math.random() * 4 + 5).toFixed(1),
    riskTaking: Math.floor(Math.random() * 10),
    teamwork: Math.floor(Math.random() * 10)
  });
});

// ---------------------------------
// DRIVER PERFORMANCE (CHART DATA)
// ---------------------------------
app.get("/api/driver/:ref/performance", (req, res) => {
  const ref = req.params.ref.toLowerCase().replace(/ /g, "_");
  const stats = driverStatsDB[ref] || { consistency: 5, reliability: 5, avgPaceRating: 6 };

  // Generate realistic race scores based on driver stats
  const basePerformance = stats.avgPaceRating || 6.5;
  const variance = (10 - (stats.consistency || 5)) * 0.3;
  const races = ["Race 1", "Race 2", "Race 3", "Race 4", "Race 5", "Race 6", "Race 7", "Race 8"];
  
  const scores = races.map(() => {
    const randomVariance = (Math.random() - 0.5) * variance;
    return Math.max(1, Math.min(10, basePerformance + randomVariance));
  });

  res.json({
    driver: ref,
    races,
    scores: scores.map(s => parseFloat(s.toFixed(1)))
  });
});

// ---------------------------------
// DRIVER SKILLS BREAKDOWN (RADAR DATA)
// ---------------------------------
app.get("/api/driver/:ref/skills", (req, res) => {
  const ref = req.params.ref.toLowerCase().replace(/ /g, "_");
  const stats = driverStatsDB[ref] || {
    consistency: 5,
    reliability: 5,
    qualifying: 5,
    riskTaking: 5,
    teamwork: 5
  };

  res.json({
    categories: ["Consistency", "Reliability", "Qualifying", "Risk Taking", "Teamwork"],
    data: [
      stats.consistency || 5,
      stats.reliability || 5,
      stats.qualifying || 5,
      stats.riskTaking || 5,
      stats.teamwork || 5
    ]
  });
});

// ---------------------------------
// DRIVER PACE DISTRIBUTION (BAR DATA)
// ---------------------------------
app.get("/api/driver/:ref/pace-distribution", (req, res) => {
  const ref = req.params.ref.toLowerCase().replace(/ /g, "_");
  const stats = driverStatsDB[ref] || { avgPaceRating: 6.5 };

  const avgPace = stats.avgPaceRating || 6.5;
  const distribution = {
    "0-3": Math.max(0, 5 - Math.round(avgPace)),
    "3-5": Math.max(0, 8 - Math.round(avgPace)),
    "5-7": Math.max(3, 12 - Math.abs(7 - Math.round(avgPace))),
    "7-9": Math.max(2, 10 - Math.abs(8 - Math.round(avgPace))),
    "9-10": Math.max(0, Math.round(avgPace) - 7)
  };

  res.json({
    labels: ["0-3", "3-5", "5-7", "7-9", "9-10"],
    data: Object.values(distribution)
  });
});

// ---------------------------------
// DRIVER CONSISTENCY TREND (BAR DATA)
// ---------------------------------
app.get("/api/driver/:ref/consistency-trend", (req, res) => {
  const ref = req.params.ref.toLowerCase().replace(/ /g, "_");
  const stats = driverStatsDB[ref] || { consistency: 5, reliability: 5, wins: 0, podiums: 5 };

  const seasons = ["2020", "2021", "2022", "2023", "2024", "2025"];
  const baseWins = Math.max(0, stats.wins || 0);
  const consistency = stats.consistency || 5;
  
  const winsData = seasons.map((_, i) => {
    const trend = i < 3 ? (i * 0.3) : 1;
    return Math.max(0, Math.round(baseWins * (0.5 + trend * consistency / 10)));
  });

  res.json({
    labels: seasons,
    wins: winsData,
    podiums: winsData.map(w => Math.round(w * 2.5 + (stats.podiums || 5) / 3))
  });
});

// ---------------------------------
// DRIVER COMPARISON (DYNAMIC)
// ---------------------------------
app.get("/api/compare", (req, res) => {
  const { a, b } = req.query;

  if (!a || !b) {
    return res.status(400).json({ error: "Two drivers required" });
  }

  const refA = a.toLowerCase().replace(/ /g, "_");
  const refB = b.toLowerCase().replace(/ /g, "_");

  const statsA = driverStatsDB[refA] || {
    points: Math.floor(Math.random() * 300),
    wins: Math.floor(Math.random() * 15),
    consistency: Math.floor(Math.random() * 10),
    reliability: Math.floor(Math.random() * 10),
    qualifying: Math.floor(Math.random() * 10),
    podiums: Math.floor(Math.random() * 15),
    dnf: Math.floor(Math.random() * 8),
    avgPaceRating: (Math.random() * 4 + 5).toFixed(1),
    riskTaking: Math.floor(Math.random() * 10),
    teamwork: Math.floor(Math.random() * 10)
  };

  const statsB = driverStatsDB[refB] || {
    points: Math.floor(Math.random() * 300),
    wins: Math.floor(Math.random() * 15),
    consistency: Math.floor(Math.random() * 10),
    reliability: Math.floor(Math.random() * 10),
    qualifying: Math.floor(Math.random() * 10),
    podiums: Math.floor(Math.random() * 15),
    dnf: Math.floor(Math.random() * 8),
    avgPaceRating: (Math.random() * 4 + 5).toFixed(1),
    riskTaking: Math.floor(Math.random() * 10),
    teamwork: Math.floor(Math.random() * 10)
  };

  res.json({
    driverA: { 
      name: a.charAt(0).toUpperCase() + a.slice(1), 
      ...statsA 
    },
    driverB: { 
      name: b.charAt(0).toUpperCase() + b.slice(1), 
      ...statsB 
    }
  });
});

// ---------------------------------
// START SERVER (ONLY ONCE)
// ---------------------------------
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});