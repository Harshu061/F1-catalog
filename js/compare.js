let chart;

async function compareDrivers() {
  const a = document.getElementById("driverA").value;
  const b = document.getElementById("driverB").value;

  const res = await fetch(
    `http://localhost:3000/api/compare?a=${a}&b=${b}`
  );
  const data = await res.json();

  const ctx = document.getElementById("compareChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Points", "Wins", "Consistency", "Reliability", "Qualifying"],
      datasets: [
        {
          label: data.driverA.name,
          data: [
            data.driverA.points,
            data.driverA.wins,
            data.driverA.consistency,
            data.driverA.reliability,
            data.driverA.qualifying
          ],
          borderColor: "#ff0000",
          backgroundColor: "rgba(255,0,0,0.3)"
        },
        {
          label: data.driverB.name,
          data: [
            data.driverB.points,
            data.driverB.wins,
            data.driverB.consistency,
            data.driverB.reliability,
            data.driverB.qualifying
          ],
          borderColor: "#00bfff",
          backgroundColor: "rgba(0,191,255,0.3)"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { color: "#222" },
          grid: { color: "#222" },
          pointLabels: { color: "#fff" },
          ticks: { display: false }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      }
    }
  });
}
