/**
 * NutriTrack - Vanilla Calorie & Macro Tracker
 * Pure HTML, CSS, and JavaScript. Persistent LocalStorage.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // Storage Key & Initial State
  // -------------------------------------------------------------
  const STORAGE_KEY = 'nutritrack_app_data_v1';

  // Default App State
  let appData = {
    settings: {
      calorieGoal: 2000
    },
    days: {}
  };

  // Currently viewed date in YYYY-MM-DD format
  let currentDateStr = getLocalDateString(new Date());

  // -------------------------------------------------------------
  // DOM Element References
  // -------------------------------------------------------------
  const datePicker = document.getElementById('date-picker');
  const dateLabel = document.getElementById('date-label');
  const prevDayBtn = document.getElementById('prev-day-btn');
  const nextDayBtn = document.getElementById('next-day-btn');
  const todayBtn = document.getElementById('today-btn');

  // Calorie Status Card
  const editGoalBtn = document.getElementById('edit-goal-btn');
  const calorieRingFill = document.getElementById('calorie-ring-fill');
  const statRemaining = document.getElementById('stat-remaining');
  const statRemainingLabel = document.getElementById('stat-remaining-label');
  const statGoal = document.getElementById('stat-goal');
  const statConsumed = document.getElementById('stat-consumed');
  const statPercent = document.getElementById('stat-percent');
  const calorieBanner = document.getElementById('calorie-banner');

  // Macro Elements
  const statProtein = document.getElementById('stat-protein');
  const statProteinCals = document.getElementById('stat-protein-cals');
  const barProtein = document.getElementById('bar-protein');

  const statCarbs = document.getElementById('stat-carbs');
  const statCarbsCals = document.getElementById('stat-carbs-cals');
  const barCarbs = document.getElementById('bar-carbs');

  const statFat = document.getElementById('stat-fat');
  const statFatCals = document.getElementById('stat-fat-cals');
  const barFat = document.getElementById('bar-fat');

  const ratioProtein = document.getElementById('ratio-protein');
  const ratioCarbs = document.getElementById('ratio-carbs');
  const ratioFat = document.getElementById('ratio-fat');
  const ratioProteinText = document.getElementById('ratio-protein-text');
  const ratioCarbsText = document.getElementById('ratio-carbs-text');
  const ratioFatText = document.getElementById('ratio-fat-text');

  // Water Tracker
  const waterAddBtn = document.getElementById('water-add-btn');
  const waterResetBtn = document.getElementById('water-reset-btn');
  const waterCount = document.getElementById('water-count');
  const waterProgressBar = document.getElementById('water-progress-bar');

  // Food Entry Form
  const foodForm = document.getElementById('food-form');
  const foodNameInput = document.getElementById('food-name');
  const foodCalsInput = document.getElementById('food-cals');
  const foodMealSelect = document.getElementById('food-meal');
  const foodProteinInput = document.getElementById('food-protein');
  const foodCarbsInput = document.getElementById('food-carbs');
  const foodFatInput = document.getElementById('food-fat');

  // Meals Section
  const mealsCounterLabel = document.getElementById('meals-counter-label');
  const filterInput = document.getElementById('filter-input');
  const weeklyChart = document.getElementById('weekly-chart');

  // Goal Modal Elements
  const goalModal = document.getElementById('goal-modal');
  const customGoalInput = document.getElementById('custom-goal-input');
  const saveGoalBtn = document.getElementById('save-goal-btn');
  const cancelGoalBtn = document.getElementById('cancel-goal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const presetChips = document.querySelectorAll('.chip-btn');

  // Data Actions
  const exportJsonBtn = document.getElementById('export-json-btn');
  const importJsonInput = document.getElementById('import-json-input');
  const clearDayBtn = document.getElementById('clear-day-btn');
  const resetAllBtn = document.getElementById('reset-all-btn');

  // -------------------------------------------------------------
  // Date Helpers
  // -------------------------------------------------------------
  function getLocalDateString(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseDateString(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatDisplayDate(dateStr) {
    const todayStr = getLocalDateString(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterdayDate);

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = getLocalDateString(tomorrowDate);

    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else if (dateStr === tomorrowStr) {
      return 'Tomorrow';
    }

    const dateObj = parseDateString(dateStr);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  }

  // -------------------------------------------------------------
  // Data Persistence (LocalStorage)
  // -------------------------------------------------------------
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        appData = JSON.parse(raw);
        if (!appData.settings) appData.settings = { calorieGoal: 2000 };
        if (!appData.days) appData.days = {};
      } else {
        // Preload helpful demo items for today on first launch
        seedDemoData();
        saveData();
      }
    } catch (e) {
      console.error('Error loading data from LocalStorage:', e);
      appData = { settings: { calorieGoal: 2000 }, days: {} };
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.error('Error saving data to LocalStorage:', e);
      showToast('Error saving data! Storage might be full.');
    }
  }

  function seedDemoData() {
    const today = getLocalDateString(new Date());
    appData = {
      settings: { calorieGoal: 2000 },
      days: {
        [today]: {
          water: 750,
          items: [
            {
              id: 'demo-1',
              name: 'Greek Yogurt with Blueberries & Honey',
              cals: 260,
              meal: 'Breakfast',
              protein: 18,
              carbs: 32,
              fat: 4,
              createdAt: new Date().toISOString()
            },
            {
              id: 'demo-2',
              name: 'Grilled Chicken Caesar Salad',
              cals: 480,
              meal: 'Lunch',
              protein: 42,
              carbs: 16,
              fat: 22,
              createdAt: new Date().toISOString()
            },
            {
              id: 'demo-3',
              name: 'Handful of Raw Almonds',
              cals: 160,
              meal: 'Snacks',
              protein: 6,
              carbs: 6,
              fat: 14,
              createdAt: new Date().toISOString()
            }
          ]
        }
      }
    };
  }

  function getDayRecord(dateStr) {
    if (!appData.days[dateStr]) {
      appData.days[dateStr] = {
        water: 0,
        items: []
      };
    }
    return appData.days[dateStr];
  }

  // -------------------------------------------------------------
  // UI Render Functions
  // -------------------------------------------------------------
  function renderAll() {
    updateDateControls();
    renderDayStats();
    renderMealsList();
    renderWeeklyTrend();
  }

  function updateDateControls() {
    datePicker.value = currentDateStr;
    dateLabel.textContent = formatDisplayDate(currentDateStr);
  }

  function renderDayStats() {
    const day = getDayRecord(currentDateStr);
    const goal = appData.settings.calorieGoal || 2000;
    const items = day.items || [];

    // Calculate totals
    let consumedCals = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    items.forEach(function (item) {
      consumedCals += Number(item.cals) || 0;
      totalProtein += Number(item.protein) || 0;
      totalCarbs += Number(item.carbs) || 0;
      totalFat += Number(item.fat) || 0;
    });

    consumedCals = Math.round(consumedCals);
    totalProtein = Math.round(totalProtein * 10) / 10;
    totalCarbs = Math.round(totalCarbs * 10) / 10;
    totalFat = Math.round(totalFat * 10) / 10;

    const remainingCals = goal - consumedCals;
    const percentOfGoal = goal > 0 ? Math.round((consumedCals / goal) * 100) : 0;

    // Ring & Calorie Labels
    statGoal.textContent = `${goal.toLocaleString()} kcal`;
    statConsumed.textContent = `${consumedCals.toLocaleString()} kcal`;
    statPercent.textContent = `${percentOfGoal}%`;

    // SVG Ring Progress (Circumference of r=70 is 2 * PI * 70 = 439.82)
    const circumference = 439.82;
    const progressFactor = Math.min(consumedCals / goal, 1);
    const offset = circumference * (1 - progressFactor);
    calorieRingFill.style.strokeDashoffset = offset;

    if (remainingCals >= 0) {
      statRemaining.textContent = remainingCals.toLocaleString();
      statRemainingLabel.textContent = 'kcal left';
      calorieRingFill.style.stroke = '#10b981'; // Green
      calorieBanner.className = 'status-banner banner-normal';
      calorieBanner.textContent = `On track! ${remainingCals.toLocaleString()} kcal remaining`;
    } else {
      const overBy = Math.abs(remainingCals);
      statRemaining.textContent = `+${overBy.toLocaleString()}`;
      statRemainingLabel.textContent = 'kcal over';
      calorieRingFill.style.stroke = '#ef4444'; // Red
      calorieBanner.className = 'status-banner banner-warning';
      calorieBanner.textContent = `Target exceeded by ${overBy.toLocaleString()} kcal`;
    }

    // Macros Calculations
    // 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
    const proteinCals = Math.round(totalProtein * 4);
    const carbsCals = Math.round(totalCarbs * 4);
    const fatCals = Math.round(totalFat * 9);
    const totalMacroCals = proteinCals + carbsCals + fatCals;

    statProtein.textContent = totalProtein;
    statProteinCals.textContent = `(${proteinCals} kcal)`;
    statCarbs.textContent = totalCarbs;
    statCarbsCals.textContent = `(${carbsCals} kcal)`;
    statFat.textContent = totalFat;
    statFatCals.textContent = `(${fatCals} kcal)`;

    // Calculate approximate targets:
    // Default reference targets: Protein 25%, Carbs 50%, Fat 25% of goal calories
    const targetProteinGrams = Math.max(1, Math.round((goal * 0.25) / 4));
    const targetCarbsGrams = Math.max(1, Math.round((goal * 0.50) / 4));
    const targetFatGrams = Math.max(1, Math.round((goal * 0.25) / 9));

    barProtein.style.width = `${Math.min(100, Math.round((totalProtein / targetProteinGrams) * 100))}%`;
    barCarbs.style.width = `${Math.min(100, Math.round((totalCarbs / targetCarbsGrams) * 100))}%`;
    barFat.style.width = `${Math.min(100, Math.round((totalFat / targetFatGrams) * 100))}%`;

    // Ratio distribution split
    if (totalMacroCals > 0) {
      const pPercent = Math.round((proteinCals / totalMacroCals) * 100);
      const cPercent = Math.round((carbsCals / totalMacroCals) * 100);
      const fPercent = Math.max(0, 100 - pPercent - cPercent);

      ratioProtein.style.width = `${pPercent}%`;
      ratioCarbs.style.width = `${cPercent}%`;
      ratioFat.style.width = `${fPercent}%`;

      ratioProteinText.textContent = `Protein: ${pPercent}%`;
      ratioCarbsText.textContent = `Carbs: ${cPercent}%`;
      ratioFatText.textContent = `Fat: ${fPercent}%`;
    } else {
      ratioProtein.style.width = '33.3%';
      ratioCarbs.style.width = '33.3%';
      ratioFat.style.width = '33.4%';

      ratioProteinText.textContent = 'Protein: 0%';
      ratioCarbsText.textContent = 'Carbs: 0%';
      ratioFatText.textContent = 'Fat: 0%';
    }

    // Water Tracker
    const water = day.water || 0;
    const waterTarget = 2000;
    waterCount.textContent = `${water} / ${waterTarget} ml`;
    waterProgressBar.style.width = `${Math.min(100, (water / waterTarget) * 100)}%`;
  }

  function renderMealsList() {
    const day = getDayRecord(currentDateStr);
    const items = day.items || [];
    const filterText = (filterInput.value || '').trim().toLowerCase();

    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    const categorizedItems = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snacks: []
    };
    const categoryTotals = {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
      Snacks: 0
    };

    let totalFilteredCount = 0;

    items.forEach(function (item) {
      const cat = categorizedItems[item.meal] ? item.meal : 'Snacks';
      categoryTotals[cat] += Number(item.cals) || 0;

      if (!filterText || item.name.toLowerCase().includes(filterText)) {
        categorizedItems[cat].push(item);
        totalFilteredCount++;
      }
    });

    mealsCounterLabel.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'} logged`;

    // Render each category container
    categories.forEach(function (cat) {
      const listEl = document.getElementById(`items-${cat}`);
      const calsEl = document.getElementById(`cat-cals-${cat}`);

      if (calsEl) {
        calsEl.textContent = `${Math.round(categoryTotals[cat])} kcal`;
      }

      if (!listEl) return;

      listEl.innerHTML = '';
      const catList = categorizedItems[cat];

      if (catList.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'empty-placeholder';
        placeholder.textContent = filterText
          ? 'No matching items'
          : `No items logged for ${cat.toLowerCase()}`;
        listEl.appendChild(placeholder);
      } else {
        catList.forEach(function (item) {
          const itemEl = createFoodItemElement(item);
          listEl.appendChild(itemEl);
        });
      }
    });
  }

  function createFoodItemElement(item) {
    const row = document.createElement('div');
    row.className = 'food-item';
    row.dataset.id = item.id;

    const info = document.createElement('div');
    info.className = 'food-item-info';

    const title = document.createElement('span');
    title.className = 'food-item-title';
    title.textContent = item.name;
    info.appendChild(title);

    // Macros details line if present
    const p = Number(item.protein) || 0;
    const c = Number(item.carbs) || 0;
    const f = Number(item.fat) || 0;

    if (p > 0 || c > 0 || f > 0) {
      const macros = document.createElement('span');
      macros.className = 'food-item-macros';
      macros.textContent = `${p}g P • ${c}g C • ${f}g F`;
      info.appendChild(macros);
    }

    const actions = document.createElement('div');
    actions.className = 'food-item-actions';

    const cals = document.createElement('span');
    cals.className = 'food-item-calories';
    cals.textContent = `${Math.round(item.cals)} kcal`;
    actions.appendChild(cals);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete-item';
    delBtn.title = 'Delete item';
    delBtn.innerHTML = '&times;';
    delBtn.addEventListener('click', function () {
      deleteFoodItem(item.id);
    });
    actions.appendChild(delBtn);

    row.appendChild(info);
    row.appendChild(actions);

    return row;
  }

  function renderWeeklyTrend() {
    weeklyChart.innerHTML = '';

    const goal = appData.settings.calorieGoal || 2000;
    const selectedDate = parseDateString(currentDateStr);

    // Build array for 7 days ending on selected date
    const daysArr = [];
    let maxCalsSeen = goal;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - i);
      const dateString = getLocalDateString(d);

      const record = appData.days[dateString];
      let cals = 0;
      if (record && record.items) {
        cals = record.items.reduce(function (sum, item) {
          return sum + (Number(item.cals) || 0);
        }, 0);
      }
      cals = Math.round(cals);
      if (cals > maxCalsSeen) {
        maxCalsSeen = cals;
      }

      daysArr.push({
        dateStr: dateString,
        dayObj: d,
        calories: cals
      });
    }

    const maxChartHeight = Math.max(maxCalsSeen, goal * 1.25);

    daysArr.forEach(function (dayInfo) {
      const col = document.createElement('div');
      col.className = 'chart-column';
      col.title = `${dayInfo.dateStr}: ${dayInfo.calories} kcal (Goal: ${goal})`;

      // Click column to switch to that date
      col.addEventListener('click', function () {
        currentDateStr = dayInfo.dateStr;
        renderAll();
      });

      const valLabel = document.createElement('span');
      valLabel.className = 'chart-val-label';
      valLabel.textContent = dayInfo.calories > 0 ? dayInfo.calories : '-';
      col.appendChild(valLabel);

      const barContainer = document.createElement('div');
      barContainer.className = 'chart-bar-container';

      const fill = document.createElement('div');
      const heightPercent = Math.min(100, Math.round((dayInfo.calories / maxChartHeight) * 100));
      fill.style.height = `${heightPercent}%`;
      fill.className = 'chart-bar-fill';

      if (dayInfo.calories > goal) {
        fill.classList.add('bar-over');
      } else {
        fill.classList.add('bar-under');
      }

      if (dayInfo.dateStr === currentDateStr) {
        fill.classList.add('bar-current');
      }

      barContainer.appendChild(fill);
      col.appendChild(barContainer);

      const dayLabel = document.createElement('span');
      dayLabel.className = 'chart-day-label';
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayLabel.textContent = dayNames[dayInfo.dayObj.getDay()];
      col.appendChild(dayLabel);

      weeklyChart.appendChild(col);
    });
  }

  // -------------------------------------------------------------
  // User Actions & Handlers
  // -------------------------------------------------------------
  function addFoodItem(entry) {
    const day = getDayRecord(currentDateStr);
    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name: entry.name,
      cals: Number(entry.cals),
      meal: entry.meal || 'Snacks',
      protein: entry.protein ? Number(entry.protein) : 0,
      carbs: entry.carbs ? Number(entry.carbs) : 0,
      fat: entry.fat ? Number(entry.fat) : 0,
      createdAt: new Date().toISOString()
    };

    day.items.unshift(newItem);
    saveData();
    renderAll();
    showToast(`Added: ${newItem.name} (+${newItem.cals} kcal)`);
  }

  function deleteFoodItem(id) {
    const day = getDayRecord(currentDateStr);
    const itemIndex = day.items.findIndex(function (it) {
      return it.id === id;
    });

    if (itemIndex > -1) {
      const removed = day.items.splice(itemIndex, 1)[0];
      saveData();
      renderAll();
      showToast(`Removed "${removed.name}"`);
    }
  }

  function quickAddCalories(cals) {
    addFoodItem({
      name: `Quick Add (+${cals} kcal)`,
      cals: cals,
      meal: 'Snacks',
      protein: 0,
      carbs: 0,
      fat: 0
    });
  }

  function showToast(message) {
    const existing = document.querySelector('.toast-msg');
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2500);
  }

  // -------------------------------------------------------------
  // Event Listeners Initialization
  // -------------------------------------------------------------
  function setupEventListeners() {
    // Date Navigation
    datePicker.addEventListener('change', function (e) {
      if (e.target.value) {
        currentDateStr = e.target.value;
        renderAll();
      }
    });

    prevDayBtn.addEventListener('click', function () {
      const d = parseDateString(currentDateStr);
      d.setDate(d.getDate() - 1);
      currentDateStr = getLocalDateString(d);
      renderAll();
    });

    nextDayBtn.addEventListener('click', function () {
      const d = parseDateString(currentDateStr);
      d.setDate(d.getDate() + 1);
      currentDateStr = getLocalDateString(d);
      renderAll();
    });

    todayBtn.addEventListener('click', function () {
      currentDateStr = getLocalDateString(new Date());
      renderAll();
    });

    // Food Entry Form Submission
    foodForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = foodNameInput.value.trim();
      const cals = parseFloat(foodCalsInput.value);
      const meal = foodMealSelect.value;
      const protein = foodProteinInput.value ? parseFloat(foodProteinInput.value) : 0;
      const carbs = foodCarbsInput.value ? parseFloat(foodCarbsInput.value) : 0;
      const fat = foodFatInput.value ? parseFloat(foodFatInput.value) : 0;

      if (!name) {
        foodNameInput.focus();
        return;
      }

      if (isNaN(cals) || cals < 0) {
        foodCalsInput.focus();
        return;
      }

      addFoodItem({
        name: name,
        cals: cals,
        meal: meal,
        protein: protein,
        carbs: carbs,
        fat: fat
      });

      // Reset form fields
      foodNameInput.value = '';
      foodCalsInput.value = '';
      foodProteinInput.value = '';
      foodCarbsInput.value = '';
      foodFatInput.value = '';
      foodNameInput.focus();
    });

    // Quick Add Buttons
    document.querySelectorAll('.quick-add-btn[data-cals]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cals = parseInt(this.dataset.cals, 10);
        if (!isNaN(cals)) {
          quickAddCalories(cals);
        }
      });
    });

    // Water Tracker Handlers
    waterAddBtn.addEventListener('click', function () {
      const day = getDayRecord(currentDateStr);
      day.water = (day.water || 0) + 250;
      saveData();
      renderDayStats();
      showToast('Hydration logged: +250ml 💧');
    });

    waterResetBtn.addEventListener('click', function () {
      const day = getDayRecord(currentDateStr);
      day.water = 0;
      saveData();
      renderDayStats();
      showToast('Water counter reset');
    });

    // Search / Filter
    filterInput.addEventListener('input', function () {
      renderMealsList();
    });

    // Goal Modal Handlers
    editGoalBtn.addEventListener('click', function () {
      customGoalInput.value = appData.settings.calorieGoal || 2000;
      goalModal.classList.remove('hidden');
      customGoalInput.focus();
    });

    closeModalBtn.addEventListener('click', function () {
      goalModal.classList.add('hidden');
    });

    cancelGoalBtn.addEventListener('click', function () {
      goalModal.classList.add('hidden');
    });

    saveGoalBtn.addEventListener('click', function () {
      const newGoal = parseInt(customGoalInput.value, 10);
      if (!isNaN(newGoal) && newGoal > 0) {
        appData.settings.calorieGoal = newGoal;
        saveData();
        renderAll();
        goalModal.classList.add('hidden');
        showToast(`Target calorie goal updated to ${newGoal.toLocaleString()} kcal`);
      }
    });

    presetChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const val = this.dataset.target;
        if (val) {
          customGoalInput.value = val;
        }
      });
    });

    // Close modal on click outside backdrop
    goalModal.addEventListener('click', function (e) {
      if (e.target === goalModal) {
        goalModal.classList.add('hidden');
      }
    });

    // Export Data as JSON
    exportJsonBtn.addEventListener('click', function () {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `nutritrack-backup-${getLocalDateString(new Date())}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('NutriTrack data exported successfully');
    });

    // Import Data from JSON
    importJsonInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported && (imported.settings || imported.days)) {
            appData = imported;
            if (!appData.settings) appData.settings = { calorieGoal: 2000 };
            if (!appData.days) appData.days = {};
            saveData();
            renderAll();
            showToast('Data imported successfully!');
          } else {
            showToast('Invalid backup file format.');
          }
        } catch (err) {
          console.error(err);
          showToast('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Clear Selected Day
    clearDayBtn.addEventListener('click', function () {
      if (confirm(`Are you sure you want to clear all logs for ${formatDisplayDate(currentDateStr)}?`)) {
        if (appData.days[currentDateStr]) {
          appData.days[currentDateStr] = { water: 0, items: [] };
          saveData();
          renderAll();
          showToast(`Cleared logs for ${formatDisplayDate(currentDateStr)}`);
        }
      }
    });

    // Reset All Records
    resetAllBtn.addEventListener('click', function () {
      if (confirm('CAUTION: This will delete all logged days, meals, and reset your targets. Continue?')) {
        appData = {
          settings: { calorieGoal: 2000 },
          days: {}
        };
        saveData();
        renderAll();
        showToast('All records reset.');
      }
    });
  }

  // -------------------------------------------------------------
  // Application Startup
  // -------------------------------------------------------------
  loadData();
  setupEventListeners();
  renderAll();

})();

