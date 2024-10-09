const timeSlotsContainer = document.querySelector('.time-slots');
const confirmButton = document.getElementById('confirm-button');
const timeSelectionDiv = document.getElementById('time-selection');
const bookingsList = document.getElementById('bookings-list');
const calendarContainer = document.getElementById('calendar-container');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const currentMonthLabel = document.getElementById('current-month');
const selectedDateLabel = document.getElementById('selected-date');
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function updateCurrentMonthLabel() {
  const options = { year: 'numeric', month: 'long' };
  currentMonthLabel.textContent = new Date(currentYear, currentMonth).toLocaleDateString('da-DK', options);
}

function generateTimeSlots() {
  const selectedDate = confirmButton.getAttribute('data-date');
  const bookings = JSON.parse(localStorage.getItem('karaokeBookings')) || [];
  const bookedSlots = bookings
    .filter(booking => booking.date === selectedDate)
    .map(booking => booking.time);

  timeSlotsContainer.innerHTML = ''; // Clear previous slots
  for (let hour = 10; hour <= 18; hour++) {
    const timeButton = document.createElement('button');
    const time = `${hour}:00`;
    timeButton.textContent = time;
    
    if (bookedSlots.includes(time)) {
      timeButton.classList.add('booked-time-slot');
      timeButton.disabled = true;
    } else {
      timeButton.addEventListener('click', () => selectTime(time));
    }

    timeSlotsContainer.appendChild(timeButton);
  }
}

function selectTime(time) {
  confirmButton.setAttribute('data-time', time);
  confirmButton.style.display = 'inline';
  selectedDateLabel.textContent = `Valgt tid: ${time}`;
  const selectedTimeElement = document.getElementById('selected-time');
  selectedTimeElement.textContent = `Valgt tid: ${time}`;
  selectedTimeElement.style.display = 'block'; 
}

function selectDate(year, month, day) {
  const selectedDate = new Date(year, month, day);
  const dayOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = selectedDate.toLocaleDateString('da-DK', dayOptions);
  confirmButton.setAttribute('data-date', formattedDate);
  selectedDateLabel.textContent = `Valgt dato: ${formattedDate}`;
  timeSelectionDiv.style.display = 'block';
  generateTimeSlots();
}

function generateCalendar(year, month) {
  const date = new Date(year, month, 1);
  const monthDays = new Date(year, month + 1, 0).getDate();
  calendarContainer.innerHTML = '';
  const bookings = JSON.parse(localStorage.getItem('karaokeBookings')) || [];
  
  for (let day = 1; day <= monthDays; day++) {
    const dayButton = document.createElement('button');
    dayButton.textContent = day;
    dayButton.classList.add('calendar-day');

    const dayBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.timestamp);
      return bookingDate.getDate() === day &&
             bookingDate.getMonth() === month &&
             bookingDate.getFullYear() === year;
    });

    if (dayBookings.length > 0) {
      if (dayBookings.length === 9) {
        dayButton.classList.add('fully-booked');
      } else {
        dayButton.classList.add('partially-booked');
      }
    }

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
  let bookings = JSON.parse(localStorage.getItem('karaokeBookings')) || [];
  const newBooking = {
    date: selectedDate,
    time: selectedTime,
    timestamp: new Date(`${currentYear}-${currentMonth + 1}-${selectedDate.split(' ')[1]} ${selectedTime}`).getTime()
  };
  bookings.push(newBooking);
  localStorage.setItem('karaokeBookings', JSON.stringify(bookings));
  displaySortedBookings();
  alert(`Du har booket: ${booking}`);

  location.reload();

});

function addBookingToList(booking, index) {
  const bookingItem = document.createElement('div');
  bookingItem.classList.add('booking-item');
  bookingItem.textContent = `${booking.date} kl ${booking.time}`;
  bookingsList.appendChild(bookingItem);
}

function deleteBooking(index) {
  let bookings = JSON.parse(localStorage.getItem('karaokeBookings')) || [];
  bookings.splice(index, 1);
  localStorage.setItem('karaokeBookings', JSON.stringify(bookings));
  displaySortedBookings();
}

function displaySortedBookings() {
  bookingsList.innerHTML = '';
  let savedBookings = JSON.parse(localStorage.getItem('karaokeBookings')) || [];
  savedBookings.sort((a, b) => a.timestamp - b.timestamp);
  savedBookings.forEach(addBookingToList);
}

document.addEventListener('DOMContentLoaded', () => {
    generateCalendar(currentYear, currentMonth); 
    displaySortedBookings(); 
});
