// ArmsWatch Enhanced JavaScript
class ArmsWatch {
  constructor() {
    this.dataset = [];
    this.currentPage = 'overview';
    this.sortDescending = true;
    this.isLoading = true;
    
    // Initialize the application
    this.init();
  }

  async init() {
    // Show loading screen
    this.showLoadingScreen();
    
    // Load data
    await this.loadData();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize components
    this.initializeComponents();
    
    // Hide loading screen and show content
    this.hideLoadingScreen();
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
    
    if (mainContent) {
      mainContent.style.opacity = '0';
    }
  }

  async hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  
  // Add a small delay to ensure DOM is ready
  await this.delay(500);
  
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.visibility = 'hidden';
    loadingScreen.classList.add('hidden');
  }
  
  if (mainContent) {
    mainContent.style.opacity = '1';
    mainContent.classList.add('loaded');
  }
  
  this.isLoading = false;
  
  // Start entrance animations
  setTimeout(() => {
    this.animatePageEntrance();
  }, 600);
}

  async loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    this.dataset = data.filter(item => ['US', 'China', 'UK'].includes(item.country));
    this.dataset.sort((a, b) => (b.year || 0) - (a.year || 0));
    
    console.log('Data loaded successfully:', this.dataset.length, 'items');
  } catch (error) {
    console.warn('Failed to load data.json, using fallback data:', error);
    this.dataset = this.getFallbackData();
  }
}

  getFallbackData() {
    return [
      {
        id: "us-sample-2024",
        project: "AI Defense Initiative",
        year: 2024,
        country: "US",
        actors: ["Department of Defense", "Google", "Microsoft"],
        vendor_model: ["Google AI", "Azure AI"],
        use_case: "Autonomous defense systems",
        status: "Active",
        confidence: "high",
        tags: ["defense", "autonomous", "ai-systems"],
        summary: "Major AI defense initiative implementing autonomous systems across military branches.",
        description: "A comprehensive program to integrate AI-powered autonomous systems into various military applications, focusing on defensive capabilities and strategic planning support.",
        sources: [
          {
            title: "DOD announces new AI initiative",
            url: "https://example.com",
            type: "official"
          }
        ]
      }
    ];
  }

  setupEventListeners() {
    // Navigation
    this.setupNavigation();
    
    // Search and filters
    this.setupSearchAndFilters();
    
    // Modal
    this.setupModal();
    
    // Mobile navigation
    this.setupMobileNavigation();
    
    // Scroll effects
    this.setupScrollEffects();
    
    // Country cards
    this.setupCountryCards();
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const backButtons = document.querySelectorAll('.back-btn');
    const heroButtons = document.querySelectorAll('[data-page]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
          this.navigateToPage(page);
        }
      });
    });
    
    backButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const page = button.dataset.page || 'overview';
        this.navigateToPage(page);
      });
    });
    
    heroButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const page = button.dataset.page;
        if (page) {
          this.navigateToPage(page);
        }
      });
    });
    
    // Explore button
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        this.scrollToFeatured();
      });
    }
  }

  setupSearchAndFilters() {
    const countries = ['us', 'china', 'uk'];
    
    countries.forEach(country => {
      const searchInput = document.getElementById(`${country}Search`);
      const yearFilter = document.getElementById(`${country}YearFilter`);
      const sortBtn = document.getElementById(`${country}SortBtn`);
      
      if (searchInput) {
        searchInput.addEventListener('input', this.debounce((e) => {
          this.filterCountryData(country);
        }, 300));
      }
      
      if (yearFilter) {
        yearFilter.addEventListener('change', () => {
          this.filterCountryData(country);
        });
      }
      
      if (sortBtn) {
        sortBtn.addEventListener('click', () => {
          this.toggleSort(country);
        });
      }
    });
  }

  setupModal() {
    const modal = document.getElementById('incidentModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    if (modalOverlay) {
      modalOverlay.addEventListener('click', () => {
        this.closeModal();
      });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
        this.closeModal();
      }
    });
  }

  setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      
      // Close mobile menu when clicking a nav link
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }
  }

  setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', this.throttle(() => {
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }, 16));
  }

  setupCountryCards() {
    const countryCards = document.querySelectorAll('.country-card');
    
    countryCards.forEach(card => {
      card.addEventListener('click', () => {
        const page = card.dataset.page;
        if (page) {
          this.navigateToPage(page);
        }
      });
    });
  }

  initializeComponents() {
    this.updateOverviewStats();
    this.renderFeaturedIncidents();
    this.updateCountryCounts();
    this.populateYearFilters();
  }

  navigateToPage(pageName) {
    if (this.isLoading) return;
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageName) {
        link.classList.add('active');
      }
    });
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageName;
      
      // Load page-specific content
      if (pageName === 'us' || pageName === 'china' || pageName === 'uk') {
        this.loadCountryPage(pageName);
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Animate page entrance
      setTimeout(() => {
        this.animatePageEntrance();
      }, 100);
    }
  }

  loadCountryPage(country) {
    const countryData = this.dataset.filter(item => 
      item.country.toLowerCase() === country.toLowerCase() ||
      (country === 'us' && item.country === 'US')
    );
    
    this.renderCountryIncidents(country, countryData);
  }

  renderCountryIncidents(country, data) {
    const container = document.getElementById(`${country}Incidents`);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No incidents found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      `;
      return;
    }
    
    data.forEach((incident, index) => {
      const card = this.createIncidentCard(incident, index);
      container.appendChild(card);
    });
  }

  createIncidentCard(incident, index = 0) {
    const card = document.createElement('div');
    card.className = 'incident-card slide-up';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const flagIcon = this.getCountryIcon(incident.country);
    const tags = (incident.tags || []).slice(0, 3);
    
    card.innerHTML = `
      <div class="incident-header">
        <h3 class="incident-title">${this.escapeHtml(incident.project)}</h3>
        <div class="incident-year">${incident.year}</div>
      </div>
      <p class="incident-summary">${this.escapeHtml(incident.summary)}</p>
      <div class="incident-footer">
        <div class="incident-tags">
          ${tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
        </div>
        <button class="view-btn" data-incident-id="${incident.id}">
          <i class="fas fa-eye"></i>
          <span>View Details</span>
        </button>
      </div>
    `;
    
    // Add click handler for view button
    const viewBtn = card.querySelector('.view-btn');
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showModal(incident);
    });
    
    return card;
  }

  renderFeaturedIncidents() {
    const container = document.getElementById('featuredGrid');
    if (!container) return;
    
    // Get most recent incidents (up to 6)
    const featured = this.dataset
      .sort((a, b) => (b.year || 0) - (a.year || 0))
      .slice(0, 6);
    
    container.innerHTML = '';
    
    featured.forEach((incident, index) => {
      const card = this.createIncidentCard(incident, index);
      card.classList.add('featured-card');
      container.appendChild(card);
    });
  }

  updateOverviewStats() {
    const totalIncidents = document.getElementById('totalIncidents');
    const latestYear = document.getElementById('latestYear');
    
    if (totalIncidents) {
      this.animateCounter(totalIncidents, this.dataset.length);
    }
    
    if (latestYear && this.dataset.length > 0) {
      const maxYear = Math.max(...this.dataset.map(item => item.year || 2024));
      this.animateCounter(latestYear, maxYear);
    }
  }

  updateCountryCounts() {
    const countries = ['us', 'china', 'uk'];
    
    countries.forEach(country => {
      const countElement = document.getElementById(`${country}Count`);
      if (countElement) {
        const count = this.dataset.filter(item => 
          item.country.toLowerCase() === country.toLowerCase() ||
          (country === 'us' && item.country === 'US')
        ).length;
        
        this.animateCounter(countElement, count);
      }
    });
  }

  populateYearFilters() {
    const years = [...new Set(this.dataset.map(item => item.year))].sort((a, b) => b - a);
    const countries = ['us', 'china', 'uk'];
    
    countries.forEach(country => {
      const select = document.getElementById(`${country}YearFilter`);
      if (select) {
        // Clear existing options except "All Years"
        while (select.children.length > 1) {
          select.removeChild(select.lastChild);
        }
        
        years.forEach(year => {
          const option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          select.appendChild(option);
        });
      }
    });
  }

  filterCountryData(country) {
    const searchInput = document.getElementById(`${country}Search`);
    const yearFilter = document.getElementById(`${country}YearFilter`);
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedYear = yearFilter ? yearFilter.value : '';
    
    let filteredData = this.dataset.filter(item => 
      item.country.toLowerCase() === country.toLowerCase() ||
      (country === 'us' && item.country === 'US')
    );
    
    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(item => {
        const searchableText = [
          item.project,
          item.summary,
          item.description,
          ...(item.tags || []),
          ...(item.actors || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
      });
    }
    
    // Apply year filter
    if (selectedYear) {
      filteredData = filteredData.filter(item => item.year == selectedYear);
    }
    
    this.renderCountryIncidents(country, filteredData);
  }

  toggleSort(country) {
    const sortBtn = document.getElementById(`${country}SortBtn`);
    const icon = sortBtn ? sortBtn.querySelector('i') : null;
    
    this.sortDescending = !this.sortDescending;
    
    if (icon) {
      icon.className = this.sortDescending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up';
    }
    
    // Re-filter with new sort order
    this.filterCountryData(country);
  }

  showModal(incident) {
    const modal = document.getElementById('incidentModal');
    if (!modal) return;
    
    // Populate modal content
    this.populateModalContent(incident);
    
    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus on close button for accessibility
    setTimeout(() => {
      const closeBtn = document.getElementById('modalClose');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  populateModalContent(incident) {
    // Title and meta
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalFlag = document.getElementById('modalFlag');
    const modalCountry = document.getElementById('modalCountry');
    const modalYear = document.getElementById('modalYear');
    const modalUseCase = document.getElementById('modalUseCase');
    
    if (modalTitle) modalTitle.textContent = incident.project;
    if (modalCountry) modalCountry.textContent = incident.country;
    if (modalYear) modalYear.textContent = incident.year;
    if (modalUseCase) modalUseCase.textContent = incident.use_case || 'Military AI Application';
    
    if (modalFlag) {
      const icon = modalFlag.querySelector('i');
      if (icon) {
        icon.className = this.getCountryIcon(incident.country);
      }
    }
    
    // Summary and description
    const modalSummary = document.getElementById('modalSummary');
    const modalDescription = document.getElementById('modalDescription');
    
    if (modalSummary) modalSummary.textContent = incident.summary;
    if (modalDescription) modalDescription.textContent = incident.description;
    
    // Actors
    const actorsList = document.getElementById('actorsList');
    if (actorsList && incident.actors) {
      actorsList.innerHTML = '';
      incident.actors.forEach(actor => {
        const span = document.createElement('span');
        span.className = 'actor-tag';
        span.textContent = actor;
        actorsList.appendChild(span);
      });
    }
    
    // Tags
    const tagsList = document.getElementById('tagsList');
    if (tagsList && incident.tags) {
      tagsList.innerHTML = '';
      incident.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'modal-tag';
        span.textContent = tag;
        tagsList.appendChild(span);
      });
    }
    
    // Sources
    const sourcesList = document.getElementById('sourcesList');
    if (sourcesList && incident.sources) {
      sourcesList.innerHTML = '';
      incident.sources.forEach(source => {
        const link = document.createElement('a');
        link.className = 'source-link';
        link.href = source.url || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        link.innerHTML = `
          <div class="source-icon">
            <i class="fas fa-external-link-alt"></i>
          </div>
          <div class="source-content">
            <h5>${this.escapeHtml(source.title)}</h5>
            <span class="source-type">${this.escapeHtml(source.type || 'source')}</span>
          </div>
        `;
        
        sourcesList.appendChild(link);
      });
    }
    
    // Confidence
    const modalConfidence = document.getElementById('modalConfidence');
    if (modalConfidence) {
      modalConfidence.textContent = (incident.confidence || 'medium').toUpperCase();
    }
  }

  closeModal() {
    const modal = document.getElementById('incidentModal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  scrollToFeatured() {
    const featuredSection = document.querySelector('.featured-section');
    if (featuredSection) {
      featuredSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  animatePageEntrance() {
    const animatableElements = document.querySelectorAll('.slide-up, .fade-in, .scale-in');
    
    animatableElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
      element.classList.add('animate');
    });
  }

  animateCounter(element, target, duration = 1500) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= target) || 
        (increment < 0 && current <= target)
      ) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  getCountryIcon(country) {
    const icons = {
      'US': 'fas fa-flag-usa',
      'China': 'fas fa-flag',
      'UK': 'fas fa-crown'
    };
    return icons[country] || 'fas fa-flag';
  }

  escapeHtml(text) {
    if (!text && text !== 0) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Intersection Observer for scroll animations
class ScrollAnimations {
  constructor() {
    this.setupObserver();
  }

  setupObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe elements when they're added to the DOM
    this.observeElements();
  }

  observeElements() {
    const animatableElements = document.querySelectorAll(
      '.slide-up:not(.animate), .fade-in:not(.animate), .scale-in:not(.animate), .country-card, .incident-card, .about-section'
    );
    
    animatableElements.forEach(element => {
      this.observer.observe(element);
    });
  }

  refresh() {
    this.observeElements();
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main app
  window.armsWatch = new ArmsWatch();
  
  // Initialize scroll animations
  window.scrollAnimations = new ScrollAnimations();
  
  // Refresh animations when new content is loaded
  const originalRenderMethod = window.armsWatch.renderCountryIncidents;
  window.armsWatch.renderCountryIncidents = function(...args) {
    originalRenderMethod.apply(this, args);
    // Refresh scroll animations for new content
    setTimeout(() => {
      window.scrollAnimations.refresh();
    }, 100);
  };
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is hidden
    document.body.classList.add('paused');
  } else {
    // Resume animations when page is visible
    document.body.classList.remove('paused');
  }
});

// Handle resize events
window.addEventListener('resize', () => {
  // Refresh scroll animations on resize
  if (window.scrollAnimations) {
    setTimeout(() => {
      window.scrollAnimations.refresh();
    }, 250);
  }
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register service worker if available
    // navigator.serviceWorker.register('/sw.js');
  });
}