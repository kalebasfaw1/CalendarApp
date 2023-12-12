// Update the currentYear and currentMonth variables
let currentYear = new Date().getFullYear(); // Example current year
let currentMonth = new Date().getMonth(); // Example current month (zero-based index)

// Load events when the page loads
loadEvents();

// Populate the month dropdown with options
const monthSelect = document.getElementById("monthSelect");
const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    monthSelect.appendChild(option);
});

// Populate the year dropdown with future years
const yearSelect = document.getElementById("yearSelect");

for (let i = 0; i < 10; i++) {
    const option = document.createElement("option");
    option.value = currentYear + i;
    option.textContent = currentYear + i;
    yearSelect.appendChild(option);
}

// Function to load events from localStorage
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || {};
    const eventList = document.getElementById('eventList');
    for (const [date, eventArray] of Object.entries(events)) {
        const modalHeader = document.querySelector('.modal-title');
        modalHeader.textContent = date;

        eventArray.forEach(eventText => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('card', 'card-body', 'mb-2');
            eventItem.textContent = eventText;
            eventList.appendChild(eventItem);
        });
    }
}

// Event listener for month selection change
monthSelect.addEventListener("change", function () {
    currentMonth = parseInt(this.value);
    displayCalendar(currentYear, currentMonth); // Call function to display calendar for the selected month and year
});

// Event listener for year selection change
yearSelect.addEventListener("change", function () {
    currentYear = parseInt(this.value);
    displayCalendar(currentYear, currentMonth); // Call function to display calendar for the selected month and year
});

function displayCalendar(year, month) {
    const calendarContainer = document.querySelector('.calendar');
    calendarContainer.innerHTML = ''; // Clear previous calendar content

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // Day of the week (0 - 6) for the first day of the month

    const monthHeader = document.createElement('h2');
    monthHeader.textContent = `${months[month]} ${year}`;
    calendarContainer.appendChild(monthHeader);

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered');

    // Create table headers (days of the week)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body (dates)
    const tbody = document.createElement('tbody');
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfWeek) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                const cell = document.createElement('td');
                cell.textContent = date;
                row.appendChild(cell);
                date++;
            }
        }
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    calendarContainer.appendChild(table);
}

// Display initial calendar
displayCalendar(currentYear, currentMonth);

document.addEventListener("DOMContentLoaded", function () {
    // Event listener for table cell click
    document.querySelector('.calendar').addEventListener('click', function (e) {
        const clickedElement = e.target;
        if (clickedElement.tagName === 'TD' && clickedElement.textContent.trim() !== '') {
            const clickedDate = clickedElement.textContent.trim();
            openEventModal(clickedDate);
        }
    });

    // Event listener for modal close button
    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('eventModal').style.display = 'none';
    });

    // Event listener for saving event
    document.getElementById('saveEventBtn').addEventListener('click', function () {
        const eventInput = document.getElementById('eventInput');
        const eventText = eventInput.value.trim();
        const formattedDay = date < 10 ? `0${date}` : `${date}`;
        if (eventText !== '') {
            saveEvent(eventText, formattedDay);
            openEventModal(formattedDay);
            eventInput.value = ''; // Clear input field after saving
        }
    });
});

// Function to open modal for event entry
function openEventModal(date) {
    const modal = document.getElementById('eventModal');
    const eventList = document.getElementById('eventList');

    // Show modal
    modal.style.display = 'block';

    // Display date in modal header with proper day formatting
    const formattedDay = date < 10 ? `0${date}` : `${date}`; // Ensure two digits for the day
    const formattedMonth = currentMonth < 9 ? `0${currentMonth + 1}` : `${currentMonth + 1}`; // Ensure two digits for the month
    const modalHeader = document.querySelector('.modal-title');
    modalHeader.textContent = `${months[currentMonth]} ${formattedDay}, ${currentYear}`;

    const eventDateKey = `${months[currentMonth]} ${formattedDay}, ${currentYear}`;
    const events = JSON.parse(localStorage.getItem('events')) || {};
    const selectedEvents = events[eventDateKey] || [];

    selectedEvents.forEach(eventText => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('card', 'card-body', 'mb-2');

        const eventTextElement = document.createElement('span');
        eventTextElement.textContent = eventText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right', 'ml-2');

        deleteButton.addEventListener('click', function () {
            deleteEvent(eventText, formattedDay);
            openEventModal(date);
        });
        eventItem.appendChild(eventTextElement);
        eventItem.appendChild(deleteButton);
        eventList.appendChild(eventItem);
    });
}

// Function to save events for a date
function saveEvent(eventText, date) {
    const eventList = document.getElementById('eventList');
    const eventItem = document.createElement('div');
    eventItem.classList.add('card', 'card-body', 'mb-2');
    eventItem.textContent = eventText;
    eventList.appendChild(eventItem);

    // Save event to localStorage
    const eventDateKey = `${months[currentMonth]} ${date}, ${currentYear}`;
    let events = JSON.parse(localStorage.getItem('events')) || {};
    if (!events[eventDateKey]) {
        events[eventDateKey] = [];
    }
    events[eventDateKey].push(eventText);
    localStorage.setItem('events', JSON.stringify(events));
}

function deleteEvent(eventText, date) {
    const eventDateKey = `${months[currentMonth]} ${date}, ${currentYear}`;
    let events = JSON.parse(localStorage.getItem('events')) || {};
    const updatedEvents = events[eventDateKey].filter(text => text !== eventText);
    events[eventDateKey] = updatedEvents;
    localStorage.setItem('events', JSON.stringify(events));
}