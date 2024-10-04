const timeSlotsContainer = document.querySelector('.time-slots');
const confirmButton = document.getElementById('confirm-button');
const timeSelectionDiv = document.getElementById('time-selection');
const dateInput = document.getElementById('booking-date');
const bookingsList = document.getElementById('bookings-list');

// Generer tidsknapper fra 10:00 til 18:00
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
}

// Håndterer når en dato vælges
dateInput.addEventListener('change', () => {
  const selectedDate = new Date(dateInput.value);
  const dayOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = selectedDate.toLocaleDateString('da-DK', dayOptions);
  confirmButton.setAttribute('data-date', formattedDate);
  timeSelectionDiv.style.display = 'block';
});

// Håndter bekræftelse af booking
confirmButton.addEventListener('click', () => {
  const selectedDate = confirmButton.getAttribute('data-date');
  const selectedTime = confirmButton.getAttribute('data-time');
  const booking = `${selectedDate} kl ${selectedTime}`;
  
  // Gem booking i JSON-format
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const newBooking = {
    date: selectedDate,
    time: selectedTime
  };
  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Opdater listen af bookinger
  addBookingToList(newBooking);
  alert(`Du har booket: ${booking}`);
});

// Tilføj en booking til visningen
function addBookingToList(booking) {
  const bookingItem = document.createElement('div');
  bookingItem.classList.add('booking-item');
  bookingItem.textContent = `${booking.date} kl ${booking.time}`;
  bookingsList.appendChild(bookingItem);
}

// Hent og vis eksisterende bookinger ved indlæsning
function loadBookings() {
  const savedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
  savedBookings.forEach(addBookingToList);
}

// Start ved at generere tidsknapperne og vise eksisterende bookinger
generateTimeSlots();
loadBookings();
