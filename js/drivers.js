const driversContainer = document.getElementById("drivers");

async function loadDrivers() {
  try {
    const res = await fetch("http://localhost:3000/api/drivers");
    const data = await res.json();

    driversContainer.innerHTML = "";

    data.forEach(driver => {
      const fullName = `${driver.givenName} ${driver.familyName}`;

      const card = document.createElement("div");
      card.className = "driver-card";

      card.innerHTML = `
        <h3>${fullName}</h3>
        <p>${driver.nationality}</p>
        <p><strong>Current Team</strong></p>
        <p>Points: — | Wins: —</p>
        <a class="btn small" href="driver.html?ref=${driver.driverId}">
          View Profile
        </a>
      `;

      driversContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading drivers:", err);
  }
}

loadDrivers();
