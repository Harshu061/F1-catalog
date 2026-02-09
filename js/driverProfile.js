// ----------------------------------
// GET DRIVER REF FROM URL
// ----------------------------------
const params = new URLSearchParams(window.location.search);
const ref = params.get("ref");

if (!ref) {
  document.getElementById("name").innerText = "Driver not found";
  throw new Error("No driver ref provided");
}

// ----------------------------------
// DOM ELEMENTS
// ----------------------------------
const nameEl = document.getElementById("name");
const pointsEl = document.getElementById("points");
const winsEl = document.getElementById("wins");
const consistencyEl = document.getElementById("consistency");
const reliabilityEl = document.getElementById("reliability");
const qualifyingEl = document.getElementById("qualifying");
const podiumsEl = document.getElementById("podiums");
const dnfEl = document.getElementById("dnf");
const avgPaceEl = document.getElementById("avgPace");
const riskTakingEl = document.getElementById("riskTaking");
const teamworkEl = document.getElementById("teamwork");

// ----------------------------------
// LOAD DRIVER STATS
// ----------------------------------
async function loadStats() {
  try {
    // Fetch detailed stats
    const res = await fetch(`http://localhost:3000/api/driver/${ref}/detailed`);
    if (!res.ok) throw new Error("Stats not found");
    const data = await res.json();

    // Try to fetch driver meta (name + team) from drivers list
    let displayName = ref.replace("_", " ").toUpperCase();
    let teamName = "Current Team";
    try {
      const listRes = await fetch("http://localhost:3000/api/drivers");
      if (listRes.ok) {
        const drivers = await listRes.json();
        const driverObj = drivers.find(d => (d.ref || d.driverId) === ref || d.driverId === ref.toLowerCase());
        if (driverObj) {
          displayName = driverObj.fullName || `${driverObj.givenName || ''} ${driverObj.familyName || ''}`.trim() || displayName;
          teamName = driverObj.team || teamName;
        }
      }
    } catch (err) {
      console.warn('Could not load drivers list for meta:', err);
    }

    // Populate DOM
    nameEl.innerText = displayName;
    document.getElementById('team').innerText = teamName;
    pointsEl.innerText = data.points ?? "—";
    winsEl.innerText = data.wins ?? "—";
    consistencyEl.innerText = data.consistency ?? "—";
    reliabilityEl.innerText = data.reliability ?? "—";
    qualifyingEl.innerText = data.qualifying ?? "—";
    podiumsEl.innerText = data.podiums ?? "—";
    dnfEl.innerText = data.dnf ?? "—";
    avgPaceEl.innerText = data.avgPaceRating ?? "—";
    riskTakingEl.innerText = data.riskTaking ?? "—";
    teamworkEl.innerText = data.teamwork ?? "—";

    // Load photo: prefer local asset (assets/drivers/<ref>.jpg/png), fallback to UI Avatars
    const imgEl = document.getElementById('driverPhoto');
    const localJpg = `assets/drivers/${ref}.jpg`;
    const localPng = `assets/drivers/${ref}.png`;
    imgEl.src = localJpg;
    imgEl.onerror = function () {
      if (imgEl.src.endsWith('.jpg')) {
        imgEl.src = localPng;
        return;
      }
      imgEl.onerror = null;
      imgEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=111111&color=ffffff&size=256&rounded=true`;
    };
  } catch (err) {
    console.error("STATS ERROR:", err);
  }
}

// ----------------------------------
// LOAD PERFORMANCE CHART
// ----------------------------------
async function loadPerformanceChart() {
  try {
    const res = await fetch(
      `http://localhost:3000/api/driver/${ref}/performance`
    );
    const data = await res.json();

    const ctx = document
      .getElementById("performanceChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: data.races,
        datasets: [
          {
            label: "Performance Score",
            data: data.scores,
            borderColor: "#ff0000",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#ff0000",
            pointBorderColor: "#fff",
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#fff", font: { size: 14 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: { color: "#aaa" },
            grid: { color: "#333" }
          },
          x: {
            ticks: { color: "#aaa" },
            grid: { color: "#333" }
          }
        }
      }
    });
  } catch (err) {
    console.error("PERFORMANCE CHART ERROR:", err);
  }
}

// ----------------------------------
// LOAD SKILLS BREAKDOWN CHART
// ----------------------------------
async function loadSkillsChart() {
  try {
    const res = await fetch(
      `http://localhost:3000/api/driver/${ref}/skills`
    );
    const data = await res.json();

    const ctx = document
      .getElementById("skillsChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "radar",
      data: {
        labels: data.categories,
        datasets: [
          {
            label: "Driver Skills",
            data: data.data,
            borderColor: "#00bfff",
            backgroundColor: "rgba(0, 191, 255, 0.2)",
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: "#00bfff",
            pointBorderColor: "#fff",
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#fff", font: { size: 14 } }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: { color: "#aaa" },
            grid: { color: "#333" },
            pointLabels: { color: "#fff", font: { size: 12 } }
          }
        }
      }
    });
  } catch (err) {
    console.error("SKILLS CHART ERROR:", err);
  }
}

// ----------------------------------
// LOAD PACE DISTRIBUTION CHART
// ----------------------------------
async function loadPaceChart() {
  try {
    const res = await fetch(
      `http://localhost:3000/api/driver/${ref}/pace-distribution`
    );
    const data = await res.json();

    const ctx = document
      .getElementById("paceChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Number of Races",
            data: data.data,
            backgroundColor: "#ff6600",
            borderColor: "#ff8800",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        indexAxis: "x",
        plugins: {
          legend: {
            labels: { color: "#fff", font: { size: 14 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#aaa" },
            grid: { color: "#333" }
          },
          x: {
            ticks: { color: "#aaa" },
            grid: { color: "#333" }
          }
        }
      }
    });
  } catch (err) {
    console.error("PACE CHART ERROR:", err);
  }
}

// ----------------------------------
// LOAD CONSISTENCY TREND CHART
// ----------------------------------
async function loadTrendChart() {
  try {
    const res = await fetch(
      `http://localhost:3000/api/driver/${ref}/consistency-trend`
    );
    const data = await res.json();

    const ctx = document
      .getElementById("trendChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Wins",
            data: data.wins,
            backgroundColor: "#ff0000",
            borderColor: "#cc0000",
            borderWidth: 2
          },
          {
            label: "Podiums",
            data: data.podiums,
            backgroundColor: "#00bfff",
            borderColor: "#0099cc",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#fff", font: { size: 14 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#aaa" },
            grid: { color: "#333" }
          },
          x: {
            ticks: { color: "#aaa" },
            grid: { color: "#333" }
          }
        }
      }
    });
  } catch (err) {
    console.error("TREND CHART ERROR:", err);
  }
}

// ----------------------------------
// INIT
// ----------------------------------
loadStats();
loadPerformanceChart();
loadSkillsChart();
loadPaceChart();
loadTrendChart();
