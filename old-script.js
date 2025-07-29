const landingPage = document.querySelector('.landing-page');
const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      // Random size, position, and animation duration
      let size = Math.random() * 0.5 + '%';
      star.style.width = size;
      star.style.height = size;
      star.style.top = Math.random() * 100 + 'vh';
      star.style.left = Math.random() * 100 + 'vw';
      star.style.animationDuration = `${Math.random() * 10 + 5}s, ${Math.random() * 13 + 1}s`;
      
      landingPage.appendChild(star);
}

document.addEventListener('DOMContentLoaded', () => {
  // Get the input and label elements
  const emailLabel = document.querySelector('label[for="email"]');
  const emailInput = document.getElementById('email');

  // Remove the elements from the DOM if they exist
  if (emailLabel) {
      emailLabel.remove();
  }
  if (emailInput) {
      emailInput.remove();
  }
});

// NAVIGATION ANIMATION

const navLink = document.querySelectorAll('.breakpoint');
navLink.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    const targetSection = document.getElementById(this.getAttribute('href').slice(1)); // Get target section element by ID
    const scrollY = targetSection.offsetTop; 
      window.scrollTo({
      top: scrollY,
      behavior: 'smooth' 
    });
  });
});

// SCROLL ANIMATION

function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  var windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Calculate the position where the element should start appearing (half of the element's height)
  var appearancePosition = windowHeight - (element.clientHeight / 0.55);

  // Check if the element's top position is less than or equal to the appearancePosition
  return rect.top <= appearancePosition;
}

function animateScrollElements() {
  var scrollAnimations = document.querySelectorAll('.scroll-animation');
  for (var i = 0; i < scrollAnimations.length; i++) {
    var element = scrollAnimations[i];
    if (isElementInViewport(element)) {
      element.classList.add('show');
    } else {
      element.classList.remove('show'); // Reset the animation state when element is not in viewport
    }
  }
}

window.addEventListener('scroll', animateScrollElements);

animateScrollElements();

// SCROLL ANUMATION FOR BIGGER ELEMENTS

function isElementInViewportTwo(element) {
  var rect = element.getBoundingClientRect();
  var windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Calculate the position where the element should start appearing (half of the element's height)
  var appearancePosition = windowHeight - (element.clientHeight / 1.4);

  // Check if the element's top position is less than or equal to the appearancePosition
  return rect.top <= appearancePosition;
}

function animateScrollElementsTwo() {
  var scrollAnimations = document.querySelectorAll('.scroll-animation-two');
  for (var i = 0; i < scrollAnimations.length; i++) {
    var element = scrollAnimations[i];
    if (isElementInViewportTwo(element)) {
      element.classList.add('show');
    } else {
      element.classList.remove('show'); // Reset the animation state when element is not in viewport
    }
  }
}

window.addEventListener('scroll', animateScrollElementsTwo);

animateScrollElementsTwo();

// SCROLL ANUMATION FOR SLOWEST ELEMENTS


function isElementInViewportThree(element) {
  var rect = element.getBoundingClientRect();
  var windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Calculate the position where the element should start appearing (half of the element's height)
  var appearancePosition = windowHeight - (element.clientHeight / 0.55);

  // Check if the element's top position is less than or equal to the appearancePosition
  return rect.top <= appearancePosition;
}

function animateScrollElementsThree() {
  var scrollAnimations = document.querySelectorAll('.scroll-animation-three');
  for (var i = 0; i < scrollAnimations.length; i++) {
    var element = scrollAnimations[i];
    if (isElementInViewportThree(element)) {
      element.classList.add('show');
    } else {
      element.classList.remove('show'); // Reset the animation state when element is not in viewport
    }
  }
}

window.addEventListener('scroll', animateScrollElementsThree);

animateScrollElementsThree();

// DEX FORM SUBMISSION

// const prices = {
//   "24 hours": { "1-3": 3000, "4-6": 2000, "7-10": 1500 },
//   "48 hours": { "1-3": 6000, "4-6": 5000, "7-10": 4000 },
// };

const trendDurationSelect = document.getElementById("duration-dropdown");
const chainSelect = document.getElementById("chain-dropdown");
const priceInput = document.getElementById("price");
let button = document.getElementById('submitButton');
let overlay = document.getElementById('overlay');

function updatePrice() {
  const duration = trendDurationSelect.value;
  const chain = chainSelect.value;
  
let price = '';
  if ((chain === "BSC" || chain === "SOL") && duration === "24 hours") {
    price = '$2400';
  } else if ((chain === "BSC" || chain === "SOL") && duration === "48 hours") {
    price = '$3400';
  } else if (chain === "ETH" && duration === "24 hours") {
    price = '$3000';
  } else if (chain === "ETH" && duration === "48 hours") {
    price = '$4700';
  } else if ((chain === "TRON" || chain === "Others") && duration === "24 hours") {
    price = '$1700';
  } else if ((chain === "TRON" || chain === "Others") && duration === "48 hours") {
    price = '$2500';
  }

  priceInput.value = price;
}

  chainSelect.addEventListener("change", updatePrice);
  trendDurationSelect.addEventListener("change", updatePrice);


function sendMail() { 
  const form = document.getElementById('form');

  if (!form.checkValidity()) {
      form.reportValidity(); // Triggers the native HTML5 validation messages
      return; // Stop if any required fields are missing
  }
  
  overlay.style.display = 'flex';
  button.disabled = true;

  let params = {
      name: document.getElementById('name').value,
      contract: document.getElementById('contact').value,
      chain: chainSelect.value,
      link: document.getElementById('dx-link').value,
      trendDuration: trendDurationSelect.value,
      price: priceInput.value,
  };

  emailjs.send("service_hvqf4yt", "template_x1jr3qa", params)
      .then(() => {
          button.textContent = 'form has been submitted successfully!'  
          button.style.backgroundColor = '#106d7f';
          button.style.color = '#ffffff';

          clearForm();

          setTimeout(() => {
            window.location.href = "https://t.me/marstrendings";
          }, 2000)
        
        })

      .catch((error) => {
          alert('There was an error sending your form. Please try again later.');
          console.error("EmailJS Error:", error);
      })
      .finally(() => {
          // Hide loading message and re-enable the submit button after the request completes
          overlay.style.display = 'none';
          button.disabled = false;
  });
}

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('chain-dropdown').value = '';
  trendDurationSelect.value = '';
  priceInput.value = '';
  document.getElementById('dx-link').value = '';
}

// async function fetchCryptoData() {
//   try {
//       const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
//       const cryptos = await response.json();

//       const marqueeContent = document.querySelector(".marquee-content");
      
//       marqueeContent.innerHTML = ""; // Clear any existing content

//       cryptos.forEach((crypto, index) => {
//           const rank = index + 1; // Rank starts from 1
//           const cryptoItem = document.createElement("div");
//           cryptoItem.classList.add("crypto-item");
//           cryptoItem.innerHTML = `
//               <span>#${rank}</span>
//               <img src="${crypto.image}" alt="${crypto.name} logo">
//               <span>${crypto.name}: <span class="crypto-price">$${crypto.current_price.toLocaleString()}</span></span>
//           `;
//           marqueeContent.appendChild(cryptoItem);
//       });
//   } catch (error) {
//       console.error("Error fetching data:", error);
//   }
// }

// // Initial fetch
// fetchCryptoData();
