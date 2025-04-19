let currentBg = 1; // start with bg1

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

window.onload = function() {
    const defaultImage = "{{ url_for('static', filename='images/default.jpeg') }}";
    crossfadeBackground(defaultImage);

    gsap.from(".forecast-card", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Dark Mode Toggle
    document.getElementById('toggle-theme').addEventListener('click', function() {
        const html = document.documentElement;
        html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    });
};
