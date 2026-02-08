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

// ----------------------------------
// LOAD DRIVER STATS
// ----------------------------------
async function loadStats() {
  try {
    const res = await fetch(
      `http://localhost:3000/api/driver/${ref}/stats`
    );

    if (!res.ok) throw new Error("Stats not found");

    const data = await res.json();

    nameEl.innerText = ref.replace("_", " ").toUpperCase();
    pointsEl.innerText = data.points ?? "—";
    winsEl.innerText = data.wins ?? "—";
    consistencyEl.innerText = data.consistency ?? "—";
    reliabilityEl.innerText = data.reliability ?? "—";
  } catch (err) {
    console.error("STATS ERROR:", err);
  }
}

// ----------------------------------
// LOAD PERFORMANCE CHART
// ----------------------------------
async function loadChart() {
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
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } catch (err) {
    console.error("CHART ERROR:", err);
  }
}

// ----------------------------------
// INIT
// ----------------------------------
loadStats();
loadChart();
