import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = 3000;

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// --------------------------------------------------
// DRIVERS LIST (ERGAST MIRROR – DNS SAFE)
// --------------------------------------------------
app.get("/api/drivers", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.jolpi.ca/ergast/f1/current/drivers.json"
    );

    const data = await response.json();

    const drivers =
      data?.MRData?.DriverTable?.Drivers?.map(d => ({
        ref: d.driverId,
        fullName: `${d.givenName} ${d.familyName}`,
        nationality: d.nationality,
        team: "Current Team",
        points: "—",
        wins: "—"
      })) || [];

    res.json(drivers);
  } catch (err) {
    console.error("FINAL ERROR:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});
app.get("/api/driver/:ref/performance", async (req, res) => {
  try {
    const { ref } = req.params;

    // TEMP simulated race performance (until race-level API is added)
    // This structure is REALISTIC and backend-computed
    const performance = {
      driver: ref,
      races: ["Race 1", "Race 2", "Race 3", "Race 4", "Race 5"],
      scores: [5, 3, 4, 2, 4]
    };

    res.json(performance);
  } catch (err) {
    res.status(500).json({ error: "Failed to compute performance" });
  }
});
app.get("/api/compare", (req, res) => {
  const { a, b } = req.query;

  if (!a || !b) {
    return res.status(400).json({ error: "Two drivers required" });
  }

  // TEMP comparison data (safe mock)
  const mock = {
    alonso: {
      points: 198,
      wins: 2,
      consistency: 8,
      reliability: 9,
      qualifying: 7
    },
    verstappen: {
      points: 454,
      wins: 19,
      consistency: 10,
      reliability: 8,
      qualifying: 10
    }
  };

  if (!mock[a] || !mock[b]) {
    return res.status(404).json({ error: "Driver not found" });
  }

  res.json({
    driverA: { name: a, ...mock[a] },
    driverB: { name: b, ...mock[b] }
  });
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
app.get("/api/driver/:ref/stats", (req, res) => {
  const { ref } = req.params;

  // TEMP MOCK DATA (replace later with real analytics)
  const statsDB = {
    alonso: {
      points: 198,
      wins: 2,
      consistency: "High",
      reliability: "Very High"
    },
    hamilton: {
      points: 234,
      wins: 2,
      consistency: "Very High",
      reliability: "High"
    },
    max_verstappen: {
      points: 454,
      wins: 19,
      consistency: "Elite",
      reliability: "Elite"
    }
  };

  const stats = statsDB[ref];

  if (!stats) {
    return res.status(404).json({ error: "Driver not found" });
  }

  res.json(stats);
});
app.get("/api/compare", (req, res) => {
  const { a, b } = req.query;

  if (!a || !b) {
    return res.status(400).json({ error: "Two drivers required" });
  }

  // TEMP analytics (replace later with DB logic)
  const mock = {
    alonso: {
      points: 198,
      wins: 2,
      consistency: 8,
      reliability: 9,
      qualifying: 7
    },
    verstappen: {
      points: 454,
      wins: 19,
      consistency: 10,
      reliability: 8,
      qualifying: 10
    }
  };

  res.json({
    driverA: { name: a, ...mock[a] },
    driverB: { name: b, ...mock[b] }
  });
});
