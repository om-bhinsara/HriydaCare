// ===============================
// GLOBAL REPORT STORE
// ===============================
window.__CARDIOSENSE_REPORT__ = null;
let smoothProgress = 0;

// ✅ ADD THIS HELPER FUNCTION AT THE TOP
function calculateUS_AQI(pm25) {
    if (pm25 == null || pm25 < 0) return "--";
    let c = parseFloat(pm25);
    // US EPA AQI Calculation Formula (PM2.5)
    if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * (c - 0) + 0);
    if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
    if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
    if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
    if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
    if (c <= 350.4) return Math.round(((400 - 301) / (350.4 - 250.5)) * (c - 250.5) + 301);
    return Math.round(((500 - 401) / (500.4 - 350.5)) * (c - 350.5) + 401);
}

export const UI = {

    showStep(stepId) {
    document.querySelectorAll('.step-container')
        .forEach(el => el.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');

    document.body.style.justifyContent =
        stepId === 'step-monitor' ? "space-between" : "center";

if (stepId === "step-monitor") {
    const ring = document.getElementById("ring-fill");
    if (ring) {
        ring.style.strokeDasharray = 565;
        ring.style.strokeDashoffset = 565;
        ring.getBoundingClientRect(); // 🔥 force reflow (important)
    }
}


    // ✅ SAVE RESULT PAGE URL WHEN RESULT STEP IS SHOWN
    if (stepId === 'step-5') {
        localStorage.setItem("RESULT_PAGE_URL", window.location.href);
    }
},




setRingProgress(progress, color, len) {
    const ring = document.getElementById("ring-fill");
    if (!ring) return;

    progress = Math.max(0, Math.min(progress, 1)); // clamp
    ring.style.stroke = color;
    smoothProgress += (progress - smoothProgress) * 0.15;
    ring.style.strokeDashoffset = len - smoothProgress * len;
},




triggerPulseAnim() {
    const cam = document.getElementById("cam-container");
    cam.classList.add("pulse");
    setTimeout(() => cam.classList.remove("pulse"), 120);
},


    updateCountdown(val) {
        document.getElementById('countdown').innerText = val;
    },

    updateOverlay(show, label = "") {
        const el = document.getElementById('overlay-text');
        el.style.display = show ? 'block' : 'none';
        if (label) document.getElementById('overlay-label').innerText = label;
    },

    updateMessage(text, color = "var(--text-muted)") {
        const msg = document.getElementById('message-box');
        msg.innerText = text;
        msg.style.color = color;
    },

    setBPM(val) {
        document.getElementById('bpm-display').innerText = val;
    },

    triggerPulseAnim() {
        const container = document.getElementById('cam-container');
        container.classList.remove('beat-pulse');
        void container.offsetWidth;
        container.classList.add('beat-pulse');
    },

    setLiveBadge(opacity) {
        document.getElementById('live-badge').style.opacity = opacity;
    },

    setCamBorder(color) {
        document.getElementById('cam-container').style.borderColor = color;
    },


updateReport(data, impactPercent, category, color, message) {

  // META
  document.getElementById("report-meta").innerText =
    `${data.city} • Age ${data.age}`;

  document.getElementById("res-bpm").innerText = data.bpm;

  // AQI (LOCKED)
  let aqi = Number(data.aqi);

  const aqiValEl = document.getElementById("res-aqi");
  const aqiLabelEl = document.getElementById("res-aqi-label");

  let label = "--";
  let colorAQI = "#94a3b8";

  if (!isNaN(aqi)) {
    if (aqi <= 50)      { label = "Good"; colorAQI = "#22c55e"; }
    else if (aqi <= 100){ label = "Moderate"; colorAQI = "#eab308"; }
    else if (aqi <= 150){ label = "Unhealthy (Sensitive)"; colorAQI = "#f97316"; }
    else if (aqi <= 200){ label = "Unhealthy"; colorAQI = "#ef4444"; }
    else if (aqi <= 300){ label = "Very Unhealthy"; colorAQI = "#7c2d12"; }
    else                { label = "Hazardous"; colorAQI = "#3b0764"; }
  }

  aqiValEl.innerText = isNaN(aqi) ? "--" : aqi;
  aqiLabelEl.innerText = label;
  aqiValEl.style.color = colorAQI;
  aqiLabelEl.style.color = colorAQI;

  // SAVE REPORT — ONLY PLACE
  const report = {
    name: data.name || "User",
    age: data.age,
    city: data.city,
    bpm: data.bpm,

    aqi: aqi,          // 🔒 LOCKED
    pm25: data.pm25,
    pm10: data.pm10,

    impactPercent,
    impactCategory: category,
    message,
    intenseActivity: data.intenseActivity || false,

    timestamp: new Date().toISOString(),
    device: "Smartphone Camera (PPG)"
  };

  localStorage.setItem("CARDIOSENSE_REPORT", JSON.stringify(report));
  window.__CARDIOSENSE_REPORT__ = report;

  // IMPACT UI
  if (data.intenseActivity) {
    document.getElementById("aqi-box").style.display = "none";
    document.getElementById("impact-container").style.display = "none";
    document.getElementById("res-msg").innerHTML =
      "Heart rate influenced by recent physical activity.<br><br>Environmental analysis paused.";
  } else {
    document.getElementById("aqi-box").style.display = "block";
    document.getElementById("impact-container").style.display = "flex";

    document.getElementById("res-impact-val").innerText = impactPercent + "%";

    const catEl = document.getElementById("res-impact-category");
    catEl.innerText = category;
    catEl.style.color = color;

    document.getElementById("res-msg").innerText = message;
  }
}

};
