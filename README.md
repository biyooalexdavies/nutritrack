# 🔥 NutriTrack - Vanilla Calorie & Macro Tracker

A lightweight, responsive calorie and macronutrient tracking web app built with **100% vanilla HTML, CSS, and JavaScript**. No frameworks, no Tailwind, no CSS variables, and zero external dependencies. All data is persisted directly in the browser's `localStorage`.

🌐 **Live Demo**: [https://biyooalexdavies.github.io/nutritrack/](https://biyooalexdavies.github.io/nutritrack/)

---

## ✨ Features

- **Energy & Calorie Tracking**:
  - Interactive SVG circular progress gauge.
  - Remaining and over-budget calorie calculation.
  - Customizable daily target goal (defaults to 2,000 kcal with quick deficit/surplus presets).

- **Macronutrient Breakdown**:
  - Track Protein (g), Carbohydrates (g), and Fat (g).
  - Energy ratio visualization and automatic macro calorie estimation (4 kcal/g for Protein & Carbs, 9 kcal/g for Fat).

- **Meal Logging by Category**:
  - Categorize entries into **Breakfast**, **Lunch**, **Dinner**, and **Snacks**.
  - Live category calorie subtotals.
  - Inline search and filter tool to quickly find logged items.
  - One-click item removal with instant recalculations.

- **Quick Shortcuts & Hydration**:
  - Rapid calorie increment buttons (+50, +100, +200, +350, +500 kcal).
  - Built-in 2,000ml water intake tracker with progress indicator (+250ml per tap).

- **Calendar Navigation & 7-Day History**:
  - Switch between days using previous/next arrows, the "Today" button, or an HTML5 date picker.
  - Interactive 7-day intake chart comparing daily consumption against your target goal.
  - Click any column in the chart to jump directly to that day.

- **Data Privacy & Backup**:
  - 100% client-side: no server, no external database, no telemetry.
  - Export your complete log history as a `.json` backup.
  - Import previous backups across devices and browsers.
  - Clear specific days or reset all data anytime.

---

## 🚀 Getting Started

No build step or installation required!

1. Clone the repository:
   ```bash
   git clone https://github.com/biyooalexdavies/nutritrack.git
   cd nutritrack
   ```
2. Open `index.html` directly in your web browser:
   - On Windows: double-click `index.html` or run `start index.html` in PowerShell.
   - On macOS: `open index.html`
   - On Linux: `xdg-open index.html`

---

## 🛠 Tech Stack

- **HTML5**: Semantic and accessible markup.
- **CSS3**: Pure vanilla CSS (clean responsive grid/flexbox, transitions, direct color values without CSS variables).
- **JavaScript (ES6+)**: Vanilla modular architecture, DOM event handling, SVG manipulation, and `localStorage` persistence.
