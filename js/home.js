// NAVIGATION BAR SLIDER
      
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

// NAVIGATION DROPDOWN MENU 

const dropDownFunc = () => {
  const arrow = document.querySelector('.arrow-svg'); 
  const dropDownMenu = document.querySelector('.dropdown');
  const page = document.querySelector('.landing-page');
  
  arrow.addEventListener('click', () => {
    dropDownMenu.classList.toggle('dropdown-toggle');

    page.addEventListener('click', () => {
      dropDownMenu.classList.remove('dropdown-toggle')
    })
  })
}

dropDownFunc();

// TESTIMONIALS CAROUSEL SWIPER EFFECT

let swiper = new Swiper(".slide-content", {
  slidesPerView: 2,
  spaceBetween: 30,
  loop: true,
  centerSlide: 'true',
  fade: 'true',
  grabCursor: 'true',
  pagination: {
    el: ".container2 .swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".container2 .swiper-button-next",
    prevEl: ".container2 .swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
  },
});

// BRAND LOGOS CAROUSEL EFFECT

let imgSwiper = new Swiper(".slide-img-content", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: false,
  centerSlide: 'false',
  fade: 'true',
  grabCursor: 'true',
  pagination: {
    el: ".container1 .swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".container1 .swiper-button-next",
    prevEl: ".container1 .swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
    520: {
      slidesPerView: 3,
    },
    700: {
      slidesPerView: 4,
    },
    1000: {
      slidesPerView: 5,
    },
  },
});

// FORM SUBMISSION SMTP
const sendEmail = () => {
  const form = document.querySelector('.newsletter');
  const response = 'Thank you for signing up!';


  form.innerHTML = response
} 


