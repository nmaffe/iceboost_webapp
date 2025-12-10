// js/fullscreen.js

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById('fullscreen-btn');

    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            btn.textContent = "\u292B";   // exit icon
        } else {
            document.exitFullscreen();
            btn.textContent = "\u2922";   // enter icon
        }
    });
});
