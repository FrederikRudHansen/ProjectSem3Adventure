const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
    const daysContainer = document.getElementById('days');
    daysContainer.innerHTML = ''; // Ryd de tidligere dage

    const monthYearText = document.getElementById('month-year');
    monthYearText.innerHTML = `${monthNames[month]} ${year}`;

    const firstDay = (new Date(year, month).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Opret tomme celler før den første dag i måneden
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('td');
        daysContainer.appendChild(cell);
    }

    // Udfyld kalenderen med månedens dage
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('td');
        cell.innerHTML = day;
        cell.addEventListener('click', () => {
            showTimeSlots(day, month, year);
        });
        daysContainer.appendChild(cell);

        // Start en ny række efter lørdag
        if ((firstDay + day) % 7 === 0) {
            const row = document.createElement('tr');
            daysContainer.appendChild(row);
        }
    }
}

function showTimeSlots(day, month, year) {
    const timeSlotsContainer = document.getElementById('time-slots');
    const slotsList = document.getElementById('slots');
    
    // Ryd de tidligere tidspunkter
    slotsList.innerHTML = '';
    
    // Definer tidspunkter
    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
    
    // Vis tidspunkter
    timeSlots.forEach(slot => { // 'slot' er navnet på den aktuelle tid i hver iteration
        const listItem = document.createElement('li'); // Opretter et nyt listeelement
        listItem.innerHTML = slot; // Sætter tekstindholdet til tidspunktet
        listItem.addEventListener('click', () => {
            alert(`Du har booket ${slot} den ${day} ${monthNames[month]} ${year}`);
        });
        slotsList.appendChild(listItem);  // Tilføjer listeelementet til listen
    });
    
    // Vis tidspunkts-sektionen
    timeSlotsContainer.style.display = 'block';
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

// Render den aktuelle måned, når siden indlæses
renderCalendar(currentMonth, currentYear);
