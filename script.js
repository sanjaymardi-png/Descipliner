// --- 1. Data & Memory (With History Upgrade) ---

let savedData = null;
try { savedData = localStorage.getItem("myTrackerData"); } catch (e) { }

let habits = savedData ? JSON.parse(savedData) : [
    { id: 1, text: "Drink 2 glasses of water", category: "Daily Habits", history: {} },
    { id: 2, text: "1hr Workout", category: "Daily Habits", history: {} },
    { id: 3, text: "Maths Class", category: "Study Routine", history: {} },
    { id: 4, text: "Memorize English Vocab", category: "Study Routine", history: {} }
];

// UPGRADE OLD DATA: If any old habits don't have a history yet, we give them one
habits.forEach(habit => {
    if (!habit.history) habit.history = {};
});

function saveData() {
    try { localStorage.setItem("myTrackerData", JSON.stringify(habits)); } catch (e) { }
}


// --- 2. Date Tracking Logic ---

// Helper function to create clean date strings like "2026-4-26"
function getFormattedDate(year, month, date) {
    return `${year}-${month + 1}-${date}`; 
}

const todayObj = new Date();
const todayString = getFormattedDate(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());

// The app will always start by looking at today's date
let selectedDate = todayString;


// --- 3. Habit Logic ---

function renderHabits() {
    const dailyList = document.getElementById("daily-habits-list");
    const studyList = document.getElementById("study-habits-list");
    const habitsTitle = document.getElementById("habits-title");
    
    dailyList.innerHTML = "";
    studyList.innerHTML = "";

    // Update the title so we know what day we are looking at!
    if (selectedDate === todayString) {
        habitsTitle.innerText = "📝 Today's Habits";
    } else {
        habitsTitle.innerText = `📝 Habits for ${selectedDate}`;
    }

    habits.forEach(habit => {
        const habitDiv = document.createElement("div");
        habitDiv.className = "habit-item";
        
        // Check the history dictionary for the selected date. If it's true, check the box.
        const isChecked = habit.history[selectedDate] ? "checked" : "";

        habitDiv.innerHTML = `
            <label style="display: flex; align-items: center; width: 100%; cursor: pointer;">
                <input type="checkbox" ${isChecked} onchange="toggleHabit(${habit.id})">
                ${habit.text} 
            </label>
            <button onclick="deleteHabit(${habit.id})" class="delete-btn">❌</button>
        `;
        
        if (habit.category === "Daily Habits") {
            dailyList.appendChild(habitDiv);
        } else if (habit.category === "Study Routine") {
            studyList.appendChild(habitDiv);
        }
    });
}

function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    
    // Flip the true/false switch for THIS specific date only!
    habit.history[selectedDate] = !habit.history[selectedDate];
    
    saveData();
}

function addHabit() {
    const inputField = document.getElementById("new-habit-input");
    const categorySelect = document.getElementById("new-habit-category");
    const text = inputField.value;

    if (text === "") { alert("Please enter a habit first!"); return; }

    const newHabit = {
        id: Date.now(), 
        text: text,
        category: categorySelect.value,
        history: {} // Starts with an empty history
    };

    habits.push(newHabit); 
    inputField.value = ""; 
    saveData(); 
    renderHabits(); 
}

function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id);
    saveData(); 
    renderHabits(); 
}


// --- 4. Calendar Logic ---

function renderCalendar() {
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYearHeader = document.getElementById("month-year");
    calendarGrid.innerHTML = ""; 

    const currentMonth = todayObj.getMonth(); 
    const currentYear = todayObj.getFullYear();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearHeader.innerText = `🗓️ ${monthNames[currentMonth]} ${currentYear}`;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
        const dayLabel = document.createElement("div");
        dayLabel.className = "day-name";
        dayLabel.innerText = day;
        calendarGrid.appendChild(dayLabel);
    });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-day";
        calendarGrid.appendChild(emptyDiv);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        dayDiv.innerText = i;
        
        // Generate the date string for the calendar box we are drawing right now
        const loopDateString = getFormattedDate(currentYear, currentMonth, i);

        // Make the day clickable!
        dayDiv.onclick = function() {
            selectedDate = loopDateString; // Change our global target date
            renderCalendar(); // Redraw calendar to move the highlight box
            renderHabits(); // Redraw the habits for the new day
        };

        // Highlight "Today"
        if (loopDateString === todayString) {
            dayDiv.classList.add("today");
        }
        
        // Highlight the "Selected Day"
        if (loopDateString === selectedDate) {
            dayDiv.classList.add("selected-day");
        }

        calendarGrid.appendChild(dayDiv);
    }
}

// --- 5. Boot Up ---
renderHabits();
renderCalendar();
