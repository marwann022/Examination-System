# 🎓 ExamHub – Premium Online Examination System

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-supported-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-vanilla-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JS](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8.svg)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-v4-570df8.svg)](https://daisyui.com/)

**ExamHub** is a responsive, feature-rich, and visually stunning web-based examination portal designed for students. Built using raw HTML, CSS, JavaScript, TailwindCSS, and DaisyUI, it features a state-of-the-art developer-inspired aesthetic, fluid micro-animations, glassmorphic design elements, a robust security system, and an intuitive user interface.

---

## ✨ Key Features

### 🖥️ Student Dashboard
- **Active & Completed Exams**: Instantly track your exam progress, scores, and completion rate.
- **Search & Filters**: Easily look up exam subjects using the dynamic, real-time search interface.
- **Theme Toggle**: Switch effortlessly between a curated **Sleek Light Mode** and a premium, deep **Space Dark Mode**.
- **Modern Typography & Glassmorphism**: Utilizes the modern *Plus Jakarta Sans* typeface paired with beautiful glassmorphism overlays and card sweep hover animations.

### 🛡️ Exam Security & Anti-Cheating Guard
- **Visibility Monitor (Tab Switching Detector)**: Monitors if the student attempts to switch tabs or minimize the window during a live exam.
- **Warning & Auto-Submit System**: Warns the student on their first infraction, and **automatically submits** their exam on the second violation to ensure maximum integrity.

### ⏱️ Dynamic Exam Experience
- **Auto-Save Session State**: Automatically saves student answers, notes, bookmarks, and remaining time to `localStorage` in real-time. If the tab or browser is closed accidentally, students can resume exactly where they left off.
- **Urgent Time Alerts**: The primary exam timer shifts color (green ➡️ orange ➡️ red) and pulses as time becomes critical.
- **Individual Question Timer**: Track the exact time spent per question to optimize time allocation.
- **Rich Interaction Utilities**:
  - **Calculator Widget**: Built-in interactive basic calculator for quick computations.
  - **Question Bookmarks**: Flag complex questions to review them later using the sidebar navigation.
  - **Question Notes**: Take quick scratchpad notes for each question.
- **Dynamic Question Pool**: Generates exam questions dynamically with automated array shuffling for randomized presentation.

### 📊 Results & Performance Analytics
- **Instant Detailed Feedback**: Real-time evaluation upon exam submission showing passing status (threshold set at **60%**).
- **Correct/Incorrect Card Breakdown**: Clearly labeled review list displaying student answers against correct answers.
- **Success & Failure Sounds**: Interactive sound triggers depending on pass/fail outcomes.

### 🔒 Secure Authentication Flow
- **Interactive Registration**: Multi-field signup form validating full names, credentials, and matching passwords.
- **Session Auth Guard**: Keeps routes secure so that users cannot access the exam portal or dashboard without being logged in.

---

## 🛠️ Tech Stack & Libraries

- **Frontend Core**: Semantic HTML5, CSS3, ES6 JavaScript.
- **Styling**: [TailwindCSS (v3 via CDN)](https://tailwindcss.com/) for fluid utility layouts.
- **Component UI**: [DaisyUI (v4)](https://daisyui.com/) for cohesive components and native theme controls.
- **Icons**: [Heroicons SVG](https://heroicons.com/) for sharp vector layouts.
- **Fonts**: *Plus Jakarta Sans* via Google Fonts.

---

## 📂 Project Structure

```bash
d:\Exam\
├── assets/                     # Image assets and illustrations
│   ├── 24770152_101.jpg        # Design assets & screenshots
│   ├── ...                     # Other placeholder graphics
├── cursor.js                   # Custom premium mouse cursor follower
├── home.html                   # Student dashboard & portal landing page
├── home.js                     # Dashboard interaction controller
├── exam.html                   # The exam page with widgets, calculator, and sidebar
├── exam.js                     # Core exam engine, timer, and visibility guards
├── login.html                  # Secure student login portal
├── login.js                    # Authenticator script
├── register.html               # Registration page
├── register.js                 # User registration validation script
├── tailwind.config.js          # Tailwind styling definitions
└── README.md                   # Project documentation (this file)
```

---

## 🚀 Getting Started & Local Setup

Since ExamHub runs entirely as a static frontend application powered by client-side storage, there are **no complex databases or backend servers to set up**!

### Method 1: Local Launch (Direct)
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/marwann022/Examination-System.git
   ```
2. Navigate into the project folder:
   ```bash
   cd Examination-System
   ```
3. Open `login.html` directly in your favorite browser (e.g. Chrome, Edge, Safari, Firefox).

### Method 2: Live Server Extension (Recommended for Development)
If you are developing inside Visual Studio Code:
1. Search and install the **Live Server** extension.
2. Right-click on `login.html` and select **"Open with Live Server"**.
3. Enjoy hot-reloads and automatic state syncing!

---

## 📜 Security Protocol & Exam Rules
When taking an exam in ExamHub:
- Do **not** refresh the page unless necessary (although session states are auto-saved).
- Do **not** leave the tab or click on other windows. The system actively detects tab-focus changes. 
- You have **1 warning** buffer. The **second** window/tab switch immediately submits your current work for grading.

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with 💙 by **[Marwan Ashraf](https://github.com/marwann022)**.
