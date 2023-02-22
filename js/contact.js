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


// FORM SUBMISSION SMTP FOR ENQUIRIES


const sendMessageEmail = () => {
  const form = document.querySelector('.contact-form');
  const response = 'Form submitted. Please check your mail for a response';
 
  form.innerHTML = response

} 