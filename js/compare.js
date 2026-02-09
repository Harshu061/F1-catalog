let chart;
let allDrivers = [];

// Load all drivers on page load
async function loadAllDrivers() {
  try {
    const res = await fetch("http://localhost:3000/api/drivers");
    allDrivers = await res.json();

    const selectA = document.getElementById("driverA");
    const selectB = document.getElementById("driverB");

    selectA.innerHTML = "";
    selectB.innerHTML = "";

    allDrivers.forEach((driver, index) => {
      const name = driver.fullName || `${driver.givenName} ${driver.familyName}`;
      const ref = driver.ref || driver.driverId;

      const optionA = document.createElement("option");
      optionA.value = ref;
      optionA.textContent = name;
      selectA.appendChild(optionA);

      const optionB = document.createElement("option");
      optionB.value = ref;
      optionB.textContent = name;
      selectB.appendChild(optionB);

      if (index === 1) optionB.selected = true;
    });
  } catch (err) {
    console.error("Error loading drivers:", err);
  }
}

async function compareDrivers() {
  const a = document.getElementById("driverA").value;
  const b = document.getElementById("driverB").value;

  if (!a || !b) {
    alert("Please select both drivers");
    return;
  }

  if (a === b) {
    alert("Please select two different drivers");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/compare?a=${a}&b=${b}`);
    const data = await res.json();

    const driverAObj = allDrivers.find(d => (d.ref || d.driverId) === a);
    const driverBObj = allDrivers.find(d => (d.ref || d.driverId) === b);

    document.getElementById("driversSideBySide").style.display = "flex";
    document.getElementById("driverAName").textContent = data.driverA.name;
    document.getElementById("driverBName").textContent = data.driverB.name;
    document.getElementById("driverATeam").textContent = driverAObj?.team || "Team";
    document.getElementById("driverBTeam").textContent = driverBObj?.team || "Team";
    
    // Update all metrics for Driver A
    document.getElementById("driverAPoints").textContent = data.driverA.points ?? "—";
    document.getElementById("driverAWins").textContent = data.driverA.wins ?? "—";
    document.getElementById("driverAPodiums").textContent = data.driverA.podiums ?? "—";
    document.getElementById("driverADNF").textContent = data.driverA.dnf ?? "—";
    document.getElementById("driverAConsistency").textContent = data.driverA.consistency ?? "—";
    document.getElementById("driverAReliability").textContent = data.driverA.reliability ?? "—";
    document.getElementById("driverAQualifying").textContent = data.driverA.qualifying ?? "—";
    document.getElementById("driverAAvgPace").textContent = data.driverA.avgPaceRating ?? "—";
    document.getElementById("driverARiskTaking").textContent = data.driverA.riskTaking ?? "—";
    document.getElementById("driverATeamwork").textContent = data.driverA.teamwork ?? "—";
    
    // Update all metrics for Driver B
    document.getElementById("driverBPoints").textContent = data.driverB.points ?? "—";
    document.getElementById("driverBWins").textContent = data.driverB.wins ?? "—";
    document.getElementById("driverBPodiums").textContent = data.driverB.podiums ?? "—";
    document.getElementById("driverBDNF").textContent = data.driverB.dnf ?? "—";
    document.getElementById("driverBConsistency").textContent = data.driverB.consistency ?? "—";
    document.getElementById("driverBReliability").textContent = data.driverB.reliability ?? "—";
    document.getElementById("driverBQualifying").textContent = data.driverB.qualifying ?? "—";
    document.getElementById("driverBAvgPace").textContent = data.driverB.avgPaceRating ?? "—";
    document.getElementById("driverBRiskTaking").textContent = data.driverB.riskTaking ?? "—";
    document.getElementById("driverBTeamwork").textContent = data.driverB.teamwork ?? "—";

    // Scaling factors - tune these if you want different visual emphasis
    const SCALE_WINS = 30;       // convert wins to "points" magnitude
    const SCALE_OTHER = 40;      // consistency/reliability/qualifying multiplier

    // Build scaled data arrays so all metrics live on same magnitude
    const scaledA = [
      Number(data.driverA.points) || 0,
      (Number(data.driverA.wins) || 0) * SCALE_WINS,
      (Number(data.driverA.consistency) || 0) * SCALE_OTHER,
      (Number(data.driverA.reliability) || 0) * SCALE_OTHER,
      (Number(data.driverA.qualifying) || 0) * SCALE_OTHER
    ];

    const scaledB = [
      Number(data.driverB.points) || 0,
      (Number(data.driverB.wins) || 0) * SCALE_WINS,
      (Number(data.driverB.consistency) || 0) * SCALE_OTHER,
      (Number(data.driverB.reliability) || 0) * SCALE_OTHER,
      (Number(data.driverB.qualifying) || 0) * SCALE_OTHER
    ];

    // Compute chart max from scaled arrays and round up for a clean outer ring
    const rawMax = Math.max(...scaledA, ...scaledB, 50);
    const step = 50;
    const chartMax = Math.ceil(rawMax / step) * step;

    const ctx = document.getElementById("compareChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Points", "Wins", "Consistency", "Reliability", "Qualifying"],
        datasets: [
          {
            label: data.driverA.name,
            data: scaledA,
            borderColor: "#ff0000",
            backgroundColor: "rgba(255,0,0,0.22)",
            borderWidth: 3,
            pointRadius: 6,
            pointBorderWidth: 2,
            pointBorderColor: "#ff0000",
            pointBackgroundColor: "#fff",
            tension: 0.3,
            fill: true
          },
          {
            label: data.driverB.name,
            data: scaledB,
            borderColor: "#00bfff",
            backgroundColor: "rgba(0,191,255,0.22)",
            borderWidth: 3,
            pointRadius: 6,
            pointBorderWidth: 2,
            pointBorderColor: "#00bfff",
            pointBackgroundColor: "#fff",
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          line: { borderJoinStyle: 'round' }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: chartMax,
            angleLines: { color: "#333", lineWidth: 1 },
            grid: { color: "#333", lineWidth: 1 },
            pointLabels: { color: "#fff", font: { size: 14, weight: "600" }, padding: 12 },
            ticks: { color: "#aaa", backdropColor: "transparent", stepSize: step }
          }
        },
        plugins: {
          legend: {
            labels: { color: "#fff", font: { size: 14, weight: "600" }, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              // show original unscaled metric where appropriate
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                const idx = context.dataIndex;
                if (idx === 0) return `${label}: ${value}`; // Points already unscaled
                if (idx === 1) { // Wins were scaled
                  const wins = Math.round(value / SCALE_WINS);
                  return `${label} - Wins: ${wins} (scaled ${value})`;
                }
                // other metrics
                return `${label}: ${Math.round(value / SCALE_OTHER)} (scaled ${value})`;
              }
            },
            backgroundColor: "rgba(0,0,0,0.9)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#fff",
            borderWidth: 1
          }
        }
      }
    });
  } catch (err) {
    console.error("Error comparing drivers:", err);
    alert("Error comparing drivers. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", loadAllDrivers);