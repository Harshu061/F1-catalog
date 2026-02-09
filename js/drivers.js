const driversContainer = document.getElementById("drivers");

function getDriverName(driver) {
  return (
    driver.fullName ||
    `${driver.givenName || ""} ${driver.familyName || ""}`.trim() ||
    driver.driverId ||
    driver.ref ||
    "Unknown Driver"
  );
}

async function loadDrivers() {
  try {
    const res = await fetch("http://localhost:3000/api/drivers");
    const drivers = await res.json();

    driversContainer.innerHTML = "";

    drivers.forEach((driver, index) => {
      const name = getDriverName(driver);
      const nationality = driver.nationality || "—";
      const points = driver.points ?? "—";
      const wins = driver.wins ?? "—";
      const ref = driver.ref || driver.driverId;

      const card = document.createElement("div");
      card.className = "driver-card scroll-fade-up";

      card.innerHTML = `
        <h3>${name}</h3>
        <p>${nationality}</p>
        <p><strong>${driver.team || "Current Team"}</strong></p>
        <p>Points: <span style="color: red;">${points}</span> | Wins: <span style="color: red;">${wins}</span></p>
        <button onclick="window.location.href='driver.html?ref=${ref}'">
          View Profile
        </button>
      `;

      driversContainer.appendChild(card);
    });

    // Trigger scroll animation observer for dynamically added elements
    setTimeout(() => {
      const scrollElements = document.querySelectorAll('.scroll-fade-up');
      scrollElements.forEach(el => {
        if (!el.classList.contains('visible')) {
          // Manually trigger if already in viewport
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
          }
        }
      });
    }, 100);
  } catch (err) {
    console.error("Error loading drivers:", err);
    driversContainer.innerHTML = "<p>Failed to load drivers</p>";
  }
}

loadDrivers();