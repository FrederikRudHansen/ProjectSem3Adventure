const timeSlotsContainer = document.querySelector('.time-slots');
const confirmButton = document.getElementById('confirm-button');
const timeSelectionDiv = document.getElementById('time-selection');
const bookingsList = document.getElementById('bookings-list');
const calendarContainer = document.getElementById('calendar-container');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const currentMonthLabel = document.getElementById('current-month');
const selectedDateDisplay = document.getElementById('selected-date'); // Tilføjet linje
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function updateCurrentMonthLabel() {
  const options = { year: 'numeric', month: 'long' };
  currentMonthLabel.textContent = new Date(currentYear, currentMonth).toLocaleDateString('da-DK', options);
}

function generateTimeSlots() {
  for (let hour = 10; hour <= 18; hour++) {
    const timeButton = document.createElement('button');
    timeButton.textContent = `${hour}:00`;
    timeButton.addEventListener('click', () => selectTime(`${hour}:00`));
    timeSlotsContainer.appendChild(timeButton);
  }
}

function selectTime(time) {
  confirmButton.setAttribute('data-time', time);
  confirmButton.style.display = 'inline';
  
  // Opdater det viste valgte tidspunkt
  const selectedTimeLabel = document.getElementById('selected-time');
  selectedTimeLabel.textContent = `Valgt tidspunkt: ${time}`;
  selectedTimeLabel.style.display = 'block'; // Gør det synligt
}

function selectDate(year, month, day) {
  const selectedDate = new Date(year, month, day);
  const dayOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = selectedDate.toLocaleDateString('da-DK', dayOptions);
  
  // Opdater den valgte dato i HTML
  selectedDateDisplay.textContent = `Valgt dato: ${formattedDate}`;

  confirmButton.setAttribute('data-date', formattedDate);
  timeSelectionDiv.style.display = 'block';
  timeSlotsContainer.innerHTML = '';
  generateTimeSlots();
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
  const selectedTime = confirmButton.getAttribute('data-time');
  const booking = `${selectedDate} kl ${selectedTime}`;
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const newBooking = {
    date: selectedDate,
    time: selectedTime,
    timestamp: new Date(`${currentYear}-${currentMonth + 1}-${selectedDate.split(' ')[1]} ${selectedTime}`).getTime()
  };
  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  displaySortedBookings();
  alert(`Du har booket: ${booking}`);
});

function addBookingToList(booking, index) {
  const bookingItem = document.createElement('div');
  bookingItem.classList.add('booking-item');
  bookingItem.textContent = `${booking.date} kl ${booking.time}`;
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Slet';
  deleteButton.style.marginLeft = '10px';
  deleteButton.addEventListener('click', () => deleteBooking(index));
  bookingItem.appendChild(deleteButton);
  bookingsList.appendChild(bookingItem);
}

function deleteBooking(index) {
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.splice(index, 1);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  displaySortedBookings();
}

function displaySortedBookings() {
  bookingsList.innerHTML = '';
  let savedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
  savedBookings.sort((a, b) => a.timestamp - b.timestamp);
  savedBookings.forEach(addBookingToList);
}

generateTimeSlots();
displaySortedBookings();
generateCalendar(currentYear, currentMonth);
