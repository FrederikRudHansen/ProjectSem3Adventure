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
    time: selectedTime,
    timestamp: new Date(`${dateInput.value} ${selectedTime}`).getTime() // Gem en timestamp for sortering
  };
  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Opdater listen af bookinger
  displaySortedBookings();
  alert(`Du har booket: ${booking}`);
});

// Tilføj en booking til visningen med sletteknap
function addBookingToList(booking, index) {
  const bookingItem = document.createElement('div');
  bookingItem.classList.add('booking-item');
  bookingItem.textContent = `${booking.date} kl ${booking.time}`;

  // Opret en "Slet"-knap for hver booking
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Slet';
  deleteButton.style.marginLeft = '10px';
  deleteButton.addEventListener('click', () => deleteBooking(index));

  bookingItem.appendChild(deleteButton);
  bookingsList.appendChild(bookingItem);
}

// Slet en booking fra listen og localStorage
function deleteBooking(index) {
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.splice(index, 1); // Fjern booking på den angivne indeks
  localStorage.setItem('bookings', JSON.stringify(bookings)); // Opdater localStorage
  displaySortedBookings(); // Opdater visningen
}

// Hent og vis eksisterende bookinger i sorteret rækkefølge
function displaySortedBookings() {
  bookingsList.innerHTML = ''; // Ryd listen
  let savedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
  
  // Sorter bookingerne efter timestamp (dato og tid)
  savedBookings.sort((a, b) => a.timestamp - b.timestamp);
  
  // Vis de sortered bookinger med indeks
  savedBookings.forEach(addBookingToList);
}

// Start ved at generere tidsknapperne og vise eksisterende bookinger
generateTimeSlots();
displaySortedBookings();
