// --- 1. Data & Memory ---

// We ask the browser if it has any saved memory called "myTrackerData"
const savedData = localStorage.getItem("myTrackerData");

// If it has memory, we translate it (parse) and use it. 
// If it is completely empty, we use our default starting list.
let habits = savedData ? JSON.parse(savedData) : [
    { id: 1, text: "Drink 2 glasses of water", category: "Daily Habits", completed: false },
    { id: 2, text: "1hr Workout", category: "Daily Habits", completed: false },
    { id: 3, text: "Maths Class", category: "Study Routine", completed: false },
    { id: 4, text: "Memorize English Vocab", category: "Study Routine", completed: false }
];

// This new function saves our current list into the browser's memory
function saveData() {
    localStorage.setItem("myTrackerData", JSON.stringify(habits));
}

// --- 2. Habit Logic ---

function renderHabits() {
    const dailyList = document.getElementById("daily-habits-list");
    const studyList = document.getElementById("study-habits-list");
    
    dailyList.innerHTML = "";
    studyList.innerHTML = "";

    habits.forEach(habit => {
        const habitDiv = document.createElement("div");
        habitDiv.className = "habit-item";
        
        // Notice the 'onchange="toggleHabit()"' added to the checkbox!
        habitDiv.innerHTML = `
            <label style="display: flex; align-items: center; width: 100%; cursor: pointer;">
                <input type="checkbox" ${habit.completed ? "checked" : ""} onchange="toggleHabit(${habit.id})">
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

function addHabit() {
    const inputField = document.getElementById("new-habit-input");
    const categorySelect = document.getElementById("new-habit-category");
    const text = inputField.value;
    const category = categorySelect.value;

    if (text === "") {
        alert("Please enter a habit first!");
        return; 
    }

    const newHabit = {
        id: Date.now(), 
        text: text,
        category: category,
        completed: false
    };

    habits.push(newHabit); 
    inputField.value = ""; 
    
    saveData(); // Save the new habit to memory!
    renderHabits(); 
}

function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id);
    
    saveData(); // Save the list after deleting to memory!
    renderHabits(); 
}

// New function: This flips a habit between true (checked) and false (unchecked)
function toggleHabit(id) {
    // Find the specific habit we clicked
    const habitToToggle = habits.find(habit => habit.id === id);
    
    // Flip its status
    habitToToggle.completed = !habitToToggle.completed;
    
    saveData(); // Save the checked box to memory!
}

// --- 3. Calendar Logic ---

function renderCalendar() {
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYearHeader = document.getElementById("month-year");
    
    calendarGrid.innerHTML = ""; 

    const today = new Date();
    const currentMonth = today.getMonth(); 
    const currentYear = today.getFullYear();
    const currentDate = today.getDate(); 

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

        if (i === currentDate) {
            dayDiv.classList.add("today");
        }

        calendarGrid.appendChild(dayDiv);
    }
}

// --- 4. Boot Up ---
renderHabits();
renderCalendar();

