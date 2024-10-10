document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Forhindrer standard formular-submit

    // Henter værdier fra inputfelterne
    var username = document.getElementsByName('username')[0].value;
    var password = document.getElementsByName('password')[0].value;

    // Tjekker om brugernavn og password matcher
    if (username === 'admin' && password === 'admin') {
        // Hvis korrekt, omdiriger til indexadmin.html
        window.location.href = '../html/admin.html';
    } else {
        // Hvis forkert, vis en fejlbesked (kan styles yderligere)
        alert('Forkert brugernavn eller kodeord!');
    }
});
