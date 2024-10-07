document.getElementById('calendar').addEventListener('change', function () {
    const selectedDate = this.value;
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';

    // Generer tidsbokse fra 10:00 til 19:00
    for (let hour = 10; hour <= 19; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = `${hour}:00`;

        timeSlot.addEventListener('click', function () {
            document.getElementById('confirmed-time').textContent = `Tid: ${hour}:00, Dato: ${selectedDate}`;
            document.getElementById('confirmation').style.display = 'block';
            // Gem den valgte dato og tid i en data-attribut
            timeSlot.setAttribute('data-time', `${selectedDate} ${hour}:00`);
        });

        timeSlotsContainer.appendChild(timeSlot);
    }
});

document.getElementById('confirm-button').addEventListener('click', function () {
    const confirmedTime = document.getElementById('confirmed-time').textContent;
    const bookedTimesContainer = document.getElementById('booked-times');

    // Gem bekræftet tid i lokal lagring
    let bookedTimes = JSON.parse(localStorage.getItem('bookedTimes')) || [];
    bookedTimes.push(confirmedTime);
    localStorage.setItem('bookedTimes', JSON.stringify(bookedTimes));

    // Vis bookede tider
    displayBookedTimes();

    // Skjul bekræftelsesafsnit
    document.getElementById('confirmation').style.display = 'none';
});

function displayBookedTimes() {
    const bookedTimesContainer = document.getElementById('booked-times');
    bookedTimesContainer.innerHTML = '';
    const bookedTimes = JSON.parse(localStorage.getItem('bookedTimes')) || [];

    bookedTimes.forEach(time => {
        const timeElement = document.createElement('div');
        timeElement.textContent = time;
        bookedTimesContainer.appendChild(timeElement);
    });
}

// Vis bookede tider ved indlæsning af siden
window.onload = displayBookedTimes;
