

if (window.APP_JS_LOADED) {
    console.warn("⚠️ app.js loaded twice - Stopping duplicate execution");
    // Throwing an error is a clean way to stop a module from executing further
    throw new Error("DUPLICATE_APP_JS"); 
}
window.APP_JS_LOADED = true;

import { Utils } from './utils.js';
import { UI } from './ui.js';
import { Sensor } from './sensor.js';
let SENSOR_STARTED = false;
let RESULTS_PROCESSED = false;
window.HCARE_HR_SAVED = false;
let PROCESSING_LOCK = false;



/* =========================
   GLOBAL STATE
========================= */
let userData = {
  intenseActivity: false,
  city: "",
  aqi: 0,      // US EPA
  pm25: null,  
  pm10: null,  
  age: 0,
  baseline: 0,
  bpm: 0
};

/* =========================
   AQI FETCH & CALCULATIONS
========================= */
async function fetchRealAQIByCity(city) {
  try {
    const res = await fetch(`/api/aqi?city=${encodeURIComponent(city)}`);
    const json = await res.json(); 

    if (!res.ok || json.error) {
        console.warn("AQI Error:", json.error);
        return null;
    }

    let finalAQI = json.aqi;
    const pm25 = json.pm25;

    // Recalculate if AQI looks suspicious but we have PM2.5
    if (pm25 !== null && (finalAQI < 20 || finalAQI === pm25)) {
        finalAQI = calculateUS_AQI(pm25);
    }

const result = {
  aqi: finalAQI,
  pm25: pm25 || 0,
  pm10: json.pm10 || 0
};

// 🔥 SYNC GLOBAL
window.currentAqi = result.aqi;
window.currentPm25 = result.pm25;
window.currentPm10 = result.pm10;
userData.aqi = result.aqi;
userData.pm25 = result.pm25;
userData.pm10 = result.pm10;

return result;


  } catch (err) {
    console.error("Failed to fetch AQI:", err);
    return null;
  }
}

function calculateUS_AQI(pm25) {
    if (pm25 == null || pm25 < 0) return 0;
    let c = parseFloat(pm25);
    if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * (c - 0) + 0);
    if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
    if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
    if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
    if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
    if (c <= 350.4) return Math.round(((400 - 301) / (350.4 - 250.5)) * (c - 250.5) + 301);
    return Math.round(((500 - 401) / (500.4 - 350.5)) * (c - 350.5) + 401);
}

/* =========================
   MAIN APP LOGIC
========================= */
document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------------------------------------
  // 1. FORCE FRESH START (The New Logic)
  // ---------------------------------------------------------
  console.log("🧹 Clearing previous session data for fresh start...");
  
  // Forget who was selected last time
  localStorage.removeItem("HCARE_MEMBER_ID");
  
  // Forget the last report/result
  localStorage.removeItem("CARDIOSENSE_REPORT");
  localStorage.removeItem("RESTORE_RESULT");
  localStorage.removeItem("HR_ALREADY_SAVED");
  
  // Clear any global variables in JS memory
  window.HCARE_MEMBER_ID = null;
  window.HCARE_HR_SAVED = false;

  // Reset the hidden input field if it exists
  const hiddenInput = document.getElementById("selected-member-id");
  if (hiddenInput) hiddenInput.value = "";

  // ---------------------------------------------------------
  // 2. Navigation Buttons (Keep this part)
  // ---------------------------------------------------------
  document.getElementById("btn-dashboard")?.addEventListener('click', () => {
      window.location.href = "/";
  });
  
  // ... The rest of your event listeners (Step 1, Step 2 buttons) ...

  // Step 1: Activity
  document.getElementById("btn-activity-yes")?.addEventListener('click', () => {
    userData.intenseActivity = true;
    UI.showStep("step-2");
  });

  document.getElementById("btn-activity-no")?.addEventListener('click', () => {
    userData.intenseActivity = false;
    UI.showStep("step-2");
  });

  document.getElementById("btn-back-to-activity")?.addEventListener('click', () => UI.showStep("step-1"));

  // Step 2: Location & Autocomplete
  const cityInput = document.getElementById("input-city");
  const suggestionBox = document.getElementById("city-suggestions");

  if(cityInput && suggestionBox) {
      cityInput.addEventListener("input", () => {
        const value = cityInput.value.trim().toLowerCase();
        suggestionBox.innerHTML = "";
        
        if (!value) {
            suggestionBox.style.display = "none";
            return;
        }

        const matches = cities.filter(c => c.toLowerCase().startsWith(value));
        
        if (!matches.length) {
            suggestionBox.style.display = "none";
            return;
        }

        matches.forEach(city => {
            const li = document.createElement("li");
            li.textContent = city;
            li.onclick = () => {
                cityInput.value = city;
                suggestionBox.innerHTML = "";
                suggestionBox.style.display = "none";
            };
            suggestionBox.appendChild(li);
        });
        suggestionBox.style.display = "block";
      });
  }

document.getElementById("btn-city-next")?.addEventListener('click', async () => {
    const city = document.getElementById("input-city").value.trim();
    const age = parseInt(document.getElementById("input-age").value);

    if (!city) return alert("Enter city");
    if (!age) return alert("Enter age");

    const btn = document.getElementById("btn-city-next");
    btn.innerText = "Checking AQI...";

    const aqiData = await fetchRealAQIByCity(city);
    if (aqiData) {
  window.currentAqi = aqiData.aqi;
  window.currentPm25 = aqiData.pm25;
  window.currentPm10 = aqiData.pm10;
}

    btn.innerText = "Continue";

    if (!aqiData) return alert("AQI fetch failed");

    userData.city = city;
    userData.aqi = aqiData.aqi;
    userData.pm25 = aqiData.pm25;
    userData.pm10 = aqiData.pm10;

    userData.age = age;
    userData.baseline = Utils.getBaselineHR(age);

    console.log("✅ USER DATA:", userData);


});


  document.getElementById("btn-back-to-location")?.addEventListener('click', () => UI.showStep("step-2"));


document.getElementById('btn-start-measure')?.addEventListener('click', () => {

    if (SENSOR_STARTED) return;
    SENSOR_STARTED = true;

    UI.showStep('step-monitor');
Sensor.init((bpm, progress) => {
    if (progress !== undefined) {
        const p = progress / 100;
        UI.setRingProgress(p, "var(--primary)", 565);
        document.getElementById("measure-percent").innerText = progress + "%";
    }

    if (bpm) {
        userData.bpm = bpm;
        processResults();
    }
});


});
  // Step 5: Results
  document.getElementById("btn-view-report")?.addEventListener('click', () => {
    localStorage.setItem("RESTORE_RESULT", "1");
    window.location.href = "/report";
  });

   document.getElementById("btn-restart")?.addEventListener('click', () => {
     RESULTS_PROCESSED = false;
    SENSOR_STARTED = false;
      window.HCARE_HR_SAVED = false;
       Sensor.stop?.(); // 
    localStorage.removeItem("CARDIOSENSE_REPORT");
    localStorage.removeItem("HR_ALREADY_SAVED"); // <--- ADD THIS LINE
    window.location.href = "/heart-rate";
  });

});


async function waitForAQI() {
    // If AQI not loaded yet, wait
    if (!window.currentAqi || window.currentAqi === 0) {
        console.log("⏳ Waiting for AQI...");
        await new Promise(r => setTimeout(r, 2500));
    }
}


async function processResults() {
  
    if (PROCESSING_LOCK) return;
    PROCESSING_LOCK = true;

    if (RESULTS_PROCESSED) return;
    RESULTS_PROCESSED = true;

    UI.showStep("step-5");

    const deltaHR = Math.max(0, userData.bpm - userData.baseline);
    const impactPercent = Math.min(100, deltaHR * 5);

    const impactCategory =
        impactPercent < 10 ? "Minimal Influence" :
        impactPercent < 30 ? "Mild Contribution" :
        impactPercent < 50 ? "Moderate Impact" :
        "High Strain";

    const message =
        impactCategory === "Minimal Influence"
            ? "Your heart rate is within expected range."
            : "Environmental factors may be affecting your heart rate.";

    // 1. Update UI via UI module
    if(UI.updateReport) {
        UI.updateReport(
            {
                age: userData.age,
                city: userData.city,
                bpm: userData.bpm,
                aqi: userData.aqi,
                pm25: userData.pm25,
                pm10: userData.pm10,
                impactCategory,
                message,
                timestamp: new Date().toISOString()
            },
            impactPercent,
            impactCategory,
            "#10b981",
            message
        );
    }

    // --- FIX START: Use LocalStorage directly instead of Fetching ---
    const selectedMemberId = localStorage.getItem("HCARE_MEMBER_ID");
    const selectedMemberName = localStorage.getItem("HCARE_MEMBER_NAME");       // <--- NEW
    const selectedRelation = localStorage.getItem("HCARE_MEMBER_RELATION");     // <--- NEW

    const report = {
        age: userData.age,
        city: userData.city,
        bpm: userData.bpm,
        aqi: userData.aqi,
        pm25: userData.pm25,
        pm10: userData.pm10,
        impactCategory,
        message,
        timestamp: new Date().toISOString(),
        
        member_id: selectedMemberId,
        // 🔥 USE STORED VALUES DIRECTLY (No Fetching needed!)
        member_name: selectedMemberName || "You",
        relationship: selectedRelation || "Self"
    };

    // Save report immediately so next page can see it
    localStorage.setItem("CARDIOSENSE_REPORT", JSON.stringify(report));
    console.log("✅ Report saved locally with name:", report.member_name);
    // --- FIX END ---

    // 2. Explanation Logic
    const activityState = userData.intenseActivity ? "active" : "resting";
    
    const explanation = explainHeartRate({
        bpm: userData.bpm,
        age: userData.age,
        activity: activityState,
        aqi: userData.aqi
    });

    const confidence = getConfidenceScore({
        bpm: userData.bpm,
        age: userData.age,
        activity: activityState,
        aqi: userData.aqi
    });

    const explainBox = document.getElementById("hr-explanation");
    const resMsg = document.getElementById("res-msg");

    if (explainBox && explanation) {
        document.getElementById("hr-explanation-text").innerText = explanation;
        document.getElementById("hr-confidence").innerText = `Confidence: ${confidence}%`;
        explainBox.style.display = "block";
        if (resMsg) resMsg.style.display = "none";
    }

    // 🔥 Ensure AQI is ready before saving
await waitForAQI();

console.log("🔥 AQI FINAL BEFORE SAVE:", window.currentAqi);
console.log("🚀 SENDING TO DB:", {
  aqi: window.currentAqi,
  pm25: window.currentPm25,
  pm10: window.currentPm10
});

saveHeartRateToBackend(impactCategory, "Normal");


    // 4. FETCH HISTORY (For Selected Family Member)
    let memberId = document.getElementById("selected-member-id")?.value;
    if (!memberId) memberId = localStorage.getItem("HCARE_MEMBER_ID");

    console.log("Fetching history for Member ID:", memberId);

    // ... inside saveHeartRateToBackend ...

    // DEBUG: Print what we are about to send
    console.log("🔍 PRE-SAVE CHECK:");
    console.log("Global AQI:", window.currentAqi);
    console.log("UserData AQI:", userData.aqi);

    const payload = {
        bpm: userData.bpm,
        
        // 🔥 PRIORITY: 
        // 1. Global Window Variable (Most reliable from HTML fetch)
        // 2. UserData (from app.js logic)
        // 3. Default to 0
        aqi: window.currentAqi || userData.aqi || 0,
        pm25: window.currentPm25 || userData.pm25 || 0.0,
        pm10: window.currentPm10 || userData.pm10 || 0.0,
        
        impact: impactCategory,
        stress: stressLevel,
        member_id: memberIdToSend
    };
    
    console.log("🚀 FINAL DATA TO DB:", {
  bpm: userData.bpm,
  aqi: window.currentAqi,
  pm25: window.currentPm25,
  pm10: window.currentPm10
});

    // ... fetch call ...

    fetch(`/api/heart-rate/last-7?member_id=${memberId || ''}`)
        .then(res => res.json())
        .then(history => {
            const box = document.getElementById("personal-baseline-box");
            if (!box || !history || history.length === 0) return;

            const insights = Utils.generatePersonalInsights(history);
            box.innerHTML = `
                <div>📊 ${insights.deviationText}</div>
                <div style="margin-top:6px;">🧠 ${insights.stabilityText}</div>
            `;
            box.style.display = "block";
        })
        .catch(e => console.log("History fetch failed", e));
        
}

function saveHeartRateToBackend(impactCategory, stressLevel) {
    // 1. Prevent double-saving
    if (window.HCARE_HR_SAVED || localStorage.getItem("HR_ALREADY_SAVED") === "1") {
        console.log("❌ Duplicate save blocked by Lock");
        return;
    }

    // 2. Lock immediately
    window.HCARE_HR_SAVED = true;
    localStorage.setItem("HR_ALREADY_SAVED", "1");

    // 3. GET AND CLEAN THE ID (The Fix)
    let rawID = document.getElementById("selected-member-id")?.value 
                || localStorage.getItem("HCARE_MEMBER_ID");

    // Logic: If it is "null" (text), empty, or undefined -> make it real null
    // If it is a number string "5" -> make it integer 5
    let memberIdToSend = null;
    if (rawID && rawID !== "null" && rawID !== "") {
        memberIdToSend = parseInt(rawID); 
    }

    console.log("📤 Sending clean ID to DB:", memberIdToSend); 
    console.log("🚀 SENDING TO DB:", {
  aqi: window.currentAqi,
  pm25: window.currentPm25,
  pm10: window.currentPm10
});

    console.log("Saving Data - Local:", userData.aqi, "Window:", window.currentAqi); // Debug Log

    fetch("/save-heart-rate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},

body: JSON.stringify({
    bpm: userData.bpm,
    aqi: window.currentAqi ?? userData.aqi ?? 0,
    pm25: window.currentPm25 ?? userData.pm25 ?? 0,
    pm10: window.currentPm10 ?? userData.pm10 ?? 0,
    impact: impactCategory,
    stress: stressLevel,
    member_id: memberIdToSend
})

    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Server Response:", data);
        if(data.error) {
            alert("Save Error: " + data.error); 
        }
    })
    .catch(err => console.error("❌ Fetch Error:", err));
}

// Helpers
function getExpectedBPM(age) {
    if (age < 25) return 72;
    if (age < 40) return 70;
    if (age < 55) return 73;
    return 75;
}

function explainHeartRate({ bpm, age, activity, aqi }) {
    if (activity === "active") return "Your heart rate is elevated primarily due to recent physical activity.";
    const expected = getExpectedBPM(age) + getAQIImpact(aqi).bpm + getTimeImpact().bpm;
    if (bpm > expected + 6) return "Environmental and situational factors may be contributing to your elevated heart rate.";
    return "Your heart rate aligns with expected levels for current conditions.";
}

function getConfidenceScore({ bpm, age, activity, aqi }) {
  let score = 50;
  if (aqi > 300) score += 25;
  else if (aqi > 200) score += 20;
  else if (aqi > 150) score += 15;
  else if (aqi > 100) score += 10;
  else score += 5;
  score += activity === "active" ? 15 : 10;
  score += Math.abs(bpm - getExpectedBPM(age)) >= 8 ? 10 : 5;
  return Math.min(95, score);
}

function getAQIImpact(aqi) {
  if (aqi <= 50) return { bpm: 0 };
  if (aqi <= 100) return { bpm: 2 };
  if (aqi <= 150) return { bpm: 5 };
  if (aqi <= 200) return { bpm: 10 };
  if (aqi <= 300) return { bpm: 15 };
  return { bpm: 20 };
}

function getTimeImpact() {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return { bpm: 0 };
    if (h >= 12 && h < 17) return { bpm: 3 };
    if (h >= 17 && h < 22) return { bpm: 6 };
    return { bpm: 4 };
}

// City List (Preserved)
const cities = [
  "Ahmedabad","Surat","Vadodara","Rajkot","Gandhinagar",
  "Mumbai","Pune","Nagpur","Nashik","Thane", "Ankleshwar",
  "Delhi","Noida","Ghaziabad","Faridabad","Gurugram",
  "Bengaluru","Chennai","Hyderabad","Kolkata",
  "Jaipur","Udaipur","Jodhpur","Ajmer","Kota","Bikaner",
  "Indore","Bhopal","Gwalior","Jabalpur","Ujjain","Sagar",
  "Lucknow","Kanpur","Varanasi","Prayagraj","Agra","Meerut",
  "Bareilly","Aligarh","Moradabad","Saharanpur",
  "Bhavnagar","Jamnagar","Junagadh","Porbandar","Anand",
  "Nadiad","Navsari","Valsad","Vapi","Morbi",
  "Aurangabad","Solapur","Kolhapur","Sangli","Satara",
  "Amravati","Akola","Latur","Nanded","Parbhani",
  "Coimbatore","Madurai","Tiruchirappalli","Salem","Erode",
  "Vellore","Tirunelveli","Thoothukudi",
  "Kochi","Thiruvananthapuram","Kozhikode","Thrissur",
  "Mysuru","Mangaluru","Hubballi","Belagavi",
  "Vijayawada","Guntur","Nellore","Tirupati","Kakinada",
  "Bhubaneswar","Cuttack","Rourkela",
  "Patna","Gaya","Muzaffarpur","Bhagalpur",
  "Ranchi","Dhanbad","Jamshedpur",
  "Siliguri","Asansol","Durgapur",
  "Chandigarh","Dehradun","Haridwar","Roorkee",
  "Shimla","Solan","Una",
  "Jammu","Srinagar","Anantnag",
  "Amritsar","Ludhiana","Jalandhar","Patiala","Bathinda",
  "Guwahati","Silchar","Dibrugarh",
  "Imphal","Agartala","Aizawl","Kohima","Dimapur",
  "Shillong","Itanagar",
  "Raipur","Bilaspur","Durg",
  "Panaji","Margao",
  "Port Blair"
];