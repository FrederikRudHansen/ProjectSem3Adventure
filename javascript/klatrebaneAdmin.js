const calendarContainer = document.getElementById('calendar-container');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const currentMonthLabel = document.getElementById('current-month');
const selectedDateLabel = document.getElementById('selected-date');
const instructorSection = document.getElementById('instructor-section');
const confirmButton = document.getElementById('confirm-button');
const instructorsListContainer = document.getElementById('instructors-list-container');
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Unique key for the Indendørs Gokart page
const storageKey = 'klatrebaneAdmin.html'; // Adjust based on your specific page

function updateCurrentMonthLabel() {
    const options = { year: 'numeric', month: 'long' };
    currentMonthLabel.textContent = new Date(currentYear, currentMonth).toLocaleDateString('da-DK', options);
}

function selectDate(year, month, day) {
    const selectedDate = new Date(year, month, day);
    const formattedDate = selectedDate.toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' });
    confirmButton.setAttribute('data-date', formattedDate);
    selectedDateLabel.textContent = `Valgt dato: ${formattedDate}`;
    instructorSection.style.display = 'block';
}

function generateCalendar(year, month) {
    const date = new Date(year, month, 1);
    const monthDays = new Date(year, month + 1, 0).getDate();
    calendarContainer.innerHTML = '';
    for (let day = 1; day <= monthDays; day++) {
        const dayButton = document.createElement('button');
        dayButton.textContent = day;
        dayButton.classList.add('calendar-day');
        dayButton.addEventListener('click', () => selectDate(year, month, day));
        calendarContainer.appendChild(dayButton);
    }
    updateCurrentMonthLabel();
}

prevMonthButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
});

confirmButton.addEventListener('click', () => {
    const selectedDate = confirmButton.getAttribute('data-date');
    const instructorName = document.getElementById('instructor-name').value;
    if (instructorName.trim() === "") {
        alert('Indtast venligst et navn for instruktøren');
        return;
    }

    const booking = `${selectedDate}: Instruktør - ${instructorName}`;
    let bookings = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newBooking = {
        date: selectedDate,
        name: instructorName
    };
    bookings.push(newBooking);
    localStorage.setItem(storageKey, JSON.stringify(bookings));
    displayBookings();
    alert(`Instruktør booket: ${booking}`);
});

function addBookingToList(booking, index) {
    const bookingItem = document.createElement('div');
    bookingItem.classList.add('booking-item');
    bookingItem.textContent = `${booking.date}: Instruktør - ${booking.name}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Slet';
    deleteButton.addEventListener('click', () => deleteBooking(index));
    bookingItem.appendChild(deleteButton);
    instructorsListContainer.appendChild(bookingItem);
}

function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem(storageKey)) || [];
    bookings.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(bookings));
    displayBookings();
}

function displayBookings() {
    instructorsListContainer.innerHTML = '';
    let savedBookings = JSON.parse(localStorage.getItem(storageKey)) || [];
    savedBookings.forEach(addBookingToList);
}

// Initialize calendar and other components when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar(currentYear, currentMonth); // Create the calendar
    displayBookings(); // Display existing instructor bookings
});
