// Navbar Scroll Effect

window.addEventListener("scroll", function () {

    const navbar =
        document.querySelector(".custom-navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
    }
    else {
        navbar.classList.remove("navbar-scrolled");
    }

});


// Scroll Animation

const fadeElements =
document.querySelectorAll(".fade-up");

const observer =
new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

}, {
    threshold:0.2
});

fadeElements.forEach((element)=>{
    observer.observe(element);
});

