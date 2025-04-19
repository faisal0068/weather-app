let currentBg = 1;

function crossfadeBackground(newImageUrl) {
    const bg1 = document.getElementById('bg1');
    const bg2 = document.getElementById('bg2');

    if (currentBg === 1) {
        bg2.style.backgroundImage = `url('${newImageUrl}')`;
        bg2.style.opacity = 1;
        bg1.style.opacity = 0;
        currentBg = 2;
    } else {
        bg1.style.backgroundImage = `url('${newImageUrl}')`;
        bg1.style.opacity = 1;
        bg2.style.opacity = 0;
        currentBg = 1;
    }
}

// Animate forecast cards and handle dark mode
window.addEventListener('load', function() {
    // Crossfade background
    const bgImage = document.body.dataset.bgImage;
    crossfadeBackground(bgImage ? `/static/images/${bgImage}` : '/static/images/default.jpeg');

    // Animate forecast cards
    if (typeof gsap !== 'undefined') {
        gsap.from(".forecast-card", {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
    }

    // Dark mode toggle
    const toggleBtn = document.getElementById('toggle-theme');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const html = document.documentElement;
            html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
        });
    }

    // Detect location button
    const detectBtn = document.getElementById('detect-btn');
    if (detectBtn) {
        detectBtn.addEventListener('click', autoDetectLocation);
    }
});

function autoDetectLocation() {
    const spinner = document.getElementById('location-spinner');
    if (spinner) spinner.style.display = 'block';  // Show spinner if exists

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const response = await fetch('/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat, lon })
                });

                const data = await response.json();
                if (data.city) {
                    const cityInput = document.querySelector('input[name="city"]');
                    if (cityInput) {
                        cityInput.value = data.city;
                        document.getElementById('city-form').submit();
                    }
                } else {
                    alert('Unable to detect your city.');
                }
            } catch (error) {
                console.error('Error fetching location:', error);
                alert('Failed to detect location.');
            } finally {
                if (spinner) spinner.style.display = 'none';  // Hide spinner
            }
        }, (error) => {
            console.error('Geolocation error:', error.message);
            alert('Permission denied or error getting location.');
            if (spinner) spinner.style.display = 'none';
        });
    } else {
        alert('Geolocation is not supported by your device.');
        if (spinner) spinner.style.display = 'none';
    }
}
