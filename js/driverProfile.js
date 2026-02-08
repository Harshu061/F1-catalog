const params = new URLSearchParams(window.location.search);
const driverRef = params.get("ref");

let chart;

function formatName(ref) {
  return ref
    .split("_")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function loadDriverStats(ref) {
  const res = await fetch(`http://localhost:3000/api/driver/${ref}/stats`);
  const data = await res.json();

  document.getElementById("points").innerText = data.points;
  document.getElementById("wins").innerText = data.wins;
  document.getElementById("consistency").innerText = data.consistency;
  document.getElementById("reliability").innerText = data.reliability;
}

async function renderChartFromBackend(ref) {
  const res = await fetch(
    `http://localhost:3000/api/driver/${ref}/performance`
  );
  const data = await res.json();

  const ctx = document.getElementById("performanceChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.races,
      datasets: [{
        label: "Performance Score",
        data: data.scores,
        borderColor: "#ff0000",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.4,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#aaa" },
          grid: { color: "#222" }
        },
        y: {
          ticks: { color: "#aaa" },
          grid: { color: "#222" }
        }
      }
    }
  });
}

function loadDriver() {
  if (!driverRef) return;

  document.getElementById("name").innerText = formatName(driverRef);
  document.getElementById("team").innerText = "Current Team";

  loadDriverStats(driverRef);       // ✅ IMPORTANT
  renderChartFromBackend(driverRef); // ✅ IMPORTANT
}

loadDriver();
