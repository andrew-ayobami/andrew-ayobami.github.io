const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.header-bar');
    const navLinks = document.querySelectorAll('.header-bar .nav-list');
  
    burger.addEventListener('click', () => {
      // Toggle
      nav.classList.toggle('openNav');
      // Links animation
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = '';
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.4}s`;
        }
      });
  
      // Burger animation
      burger.classList.toggle('toggle');
    });
  }
  
  navSlide();

// Switch theme/add to local storage
// const body = document.body;
// const themeToggleBtn = selectElement('#theme-toggle-btn');
// const currentTheme = localStorage.getItem('currentTheme');

// // Check to see if there is a theme preference in local Storage, if so add the ligt theme to the body
// if (currentTheme) {
//     body.classList.add('light-theme');
// }

// themeToggleBtn.addEventListener('click', function () {
//     // Add light theme on click
//     body.classList.toggle('light-theme');

//     // If the body has the class of light theme then add it to local Storage, if not remove it
//     if (body.classList.contains('light-theme')) {
//         localStorage.setItem('currentTheme', 'themeActive');
//     } else {
//         localStorage.removeItem('currentTheme');
//     }
// });

// Swiper
const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        700: {
          slidesPerView: 2
        },
        1200: {
            slidesPerView: 3
        }
    }   
});