
document.getElementById('indaktilist').addEventListener('change', function() {
    var selectedValue = this.value;
    if (selectedValue) {
        window.location.href = selectedValue;
    }
});

document.getElementById('udenaktilist').addEventListener('change', function() {
    var selectedValue = this.value;
    if (selectedValue) {
        window.location.href = selectedValue;
    }
});

