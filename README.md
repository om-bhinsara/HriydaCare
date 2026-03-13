# ❤️ HridyaCare  
### **Smart, Accessible, Context-Aware & Family-Centric Digital Health Monitoring**

HridyaCare is a **browser-based, family-centric digital health platform** designed to make **heart health, stress, lifestyle, and environmental health monitoring accessible to everyone**, using just a smartphone and the web.  

It is built with a strong focus on **individuals, families, elderly members, and caregivers**, enabling shared awareness and proactive health monitoring within households.

**No wearables. No subscriptions. No hospital visits for basic screening.**

---

## 🚧 Project Status (Important)

> **HridyaCare is currently under active development.**  
> Several features are functional, while others are being continuously refined, expanded, and validated.  
> The platform should be viewed as an **evolving health monitoring and awareness system**, not a finished commercial product.

---

## ⚠️ Device Recommendation

Heart rate monitoring in HridyaCare relies on the **smartphone camera and flash (PPG technique)**.  
Since most laptops and desktops do **not support continuous camera flash**, this feature is **fully supported only on mobile devices**.

For the **best accuracy and reliability**, users are **strongly advised to access HridyaCare on a smartphone**.

---

## 🌍 Problem Statement

Today’s health monitoring solutions are often:
- **Device-dependent** (require wearables)
- **Data-heavy but insight-poor** (numbers without interpretation)
- **Expensive or inaccessible**, especially in rural, remote, or low-resource regions

As a result, individuals and families often become aware of health risks **only after symptoms escalate**.

HridyaCare bridges this gap by combining **real-time physiological signals, lifestyle patterns, stress assessment, and environmental factors** to provide **clear, human-readable health insights — instantly**.

---

## 💡 What Makes HridyaCare Unique?

- Measures **heart rate using a phone camera** (rPPG-based)
- Links health with **real-world context** (AQI, lifestyle, age)
- Includes **clinically recognized stress assessment**
- Provides **actionable insights**, not just raw data
- Works on **any browser-enabled smartphone**
- Optional **telehealth support with verified health coaches**
- Designed as a **family-centric platform**, enabling shared health awareness and care

---

## 🧠 Core Features

### ❤️ Heart Rate Monitoring
- Real-time heart rate measurement using smartphone camera (rPPG-based)
- No wearables required
- Achieved accuracy:
  - **Best case:** ±4 BPM  
  - **Worst case:** ±8 BPM
- Stores the **last 7 heart rate measurements** for short-term tracking
- Displays **clear trends**: upward, downward, or steady
- Focuses on **trends rather than isolated readings**
- Context-aware guidance:
  - **Upward trend:** rest, hydration, breathing exercises, reduced pollution exposure  
  - **Downward trend:** recovery and normalization  
  - **Steady trend:** stable condition, maintain habits
- **Uniquely integrates real-time city AQI** to show environmental impact on heart rate
- Instant access to **verified health coaches** for guidance
- Insights designed after reviewing **multiple peer-reviewed research studies**

---

### 🌫️ “How My City AQI Affects My Heart”
- Fetches real-time city AQI
- Displays:
  - AQI
  - PM2.5
  - PM10
- Explains how air pollution influences cardiovascular stress
- Converts environmental data into **health impact insights**

---

### 😌 Stress Check (Clinically Backed)
- Uses the **Perceived Stress Scale (PSS)**
- Developed by **Cohen et al. (1983)**
- Clinically validated and globally recognized
- Measures:
  - Perceived unpredictability
  - Lack of control
  - Mental overload
- 10-question assessment
- Generates an easy-to-understand **stress score**
- Categorizes results into **5 distinct stress levels**
- Each level includes **clear, practical solutions**
- Visualized using a **radar chart** for intuitive understanding

---

### 🧬 Lifestyle Analysis
- Built on **World Health Organization (WHO) lifestyle assessment matrices**
- Uses **WHO-defined benchmarks and risk thresholds**
- Analyzes:
  - Physical activity
  - Sleep quality and duration
  - Daily habits
  - Sedentary behavior
- Visually flags weak lifestyle areas
- Converts lifestyle data into **actionable recommendations**

---

### 📊 Health Insights & Reports
- Combines:
  - Heart rate
  - Stress level
  - Lifestyle score
  - Environmental exposure
- Generates:
  - Visual insights
  - Trend-based analysis
  - Downloadable reports
- Focuses on **why health changes occur**, not just what changed

---

### 🩺 Telehealth Support
- Access to **verified health coaches**
- Coaches can:
  - View user reports (with consent)
  - Analyze trends
  - Provide personalized guidance
- Coaches are **admin-verified** to ensure safety and trust
- Especially useful for **elderly users and family care scenarios**
- Enables professional guidance **without hospital visits**

---

## 👥 User Roles

### 👤 User
- Measure heart rate
- Check stress levels
- Analyze lifestyle
- View AQI impact
- Track reports and trends
- Consult health coaches

### 🧑‍⚕️ Health Coach
- Secure dashboard
- View assigned user reports
- Provide guidance
- No access without admin approval

### 🛠️ Admin
- Verify and approve health coaches
- Manage platform data
- Maintain system integrity

> Admin and Coach dashboards operate independently and are non-linear.

---

## 🧪 Technology Stack

### Frontend
- HTML5
- CSS3 (Glassmorphism / Futuristic UI)
- JavaScript (ES Modules)
- Chart.js

### Backend
- Flask (Python)
- REST APIs

### Database
- PostgreSQL

---

## 🔌 APIs Used

### Air Quality Data (AQI & Pollutants)
- AQICN / WAQI API
- Uses authenticated `AQICN_API_TOKEN`
- Fetches real-time AQI using geographic coordinates
- For India, data is sourced from **CPCB government monitoring stations**
- Enables correlation between **air pollution and cardiovascular stress**

---

## 🔐 Privacy & Ethics
- No medical diagnosis claims
- User data remains private
- Coach access only after admin verification
- Designed as a **decision-support system**, not a replacement for doctors

---

## 🚀 Impact & Vision

- Breaks the **wealth and access barrier in healthcare**
- Enables **early awareness before conditions worsen**
- Supports **family-level health awareness and care**
- Promotes:
  - Proactive monitoring
  - Preventive care
  - Personalized insights
- Anyone with a smartphone and browser can access professional-grade health insights

---

## 📌 Future Scope

- Long-term trend prediction for cardiovascular risk awareness  
- Personalized alerts based on health and environmental trends  
- Integration with public health systems  
- Expanded environmental indicators (heat, pollution, lifestyle)

Currently:
- No unified government platform continuously links heart health with real-time environmental data
- Public health monitoring for elderly populations is often **infrequent and reactive**

HridyaCare aims to **bridge this gap** through **continuous, family-centric, at-home monitoring** and timely guidance.

---

## 📄 Disclaimer

HridyaCare is a health monitoring and awareness platform.  
It does **not provide medical diagnoses** and should not replace professional medical consultation.

---

## 👨‍💻 Project Name

**HridyaCare**  
_Heart health, understood — not just measured._

© 2026 HridyaCare. All rights reserved.  
Developed by **Om J. Bhinsara and Team**.
