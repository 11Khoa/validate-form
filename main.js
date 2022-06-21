document.addEventListener('DOMContentLoaded', function () {
    mouseCursor = document.querySelector('.cursor');
    links = document.querySelectorAll('form');
    window.addEventListener('mousemove', cursor);
    function cursor(e) {
        gsap.to(mouseCursor, 0.4, {
            x: e.clientX,
            y: e.clientY
        });
    }
    links.forEach(link => {
        link.addEventListener("mouseleave", () => {
            mouseCursor.classList.remove("link-grow");
            gsap.to(mouseCursor, 0.4, {
                scale: 0
            });
        });
        link.addEventListener("mouseover", () => {
            mouseCursor.classList.add("link-grow");
            gsap.to(mouseCursor, 0.4, {
                scale: 3
            });
        });
    });
})