// Wesole Nutki - Main JavaScript Entry Point
// Preschool theme with animations and interactions

// Import GLightbox for full-screen image viewing
import GLightbox from 'glightbox';

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const scrollThreshold = 50;

  function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Initial check
  updateNavbar();

  // Listen for scroll events with throttling
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ============================================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================================
function initScrollAnimations() {
  // Elements to animate on scroll
  const animatedElements = document.querySelectorAll(
    '.gallery-card, .gallery-item, .testimonial-card'
  );

  if (animatedElements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Set initial state
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered animation delay
        const delay = index * 100;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);

        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe elements
  animatedElements.forEach(el => observer.observe(el));
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-number');

  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target') || counter.textContent, 10);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  };

  // Create observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

// ============================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Skip if it's just '#' or a Bootstrap collapse/tab toggle
      if (targetId === '#' || this.hasAttribute('data-bs-toggle')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Get navbar height for offset
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, null, targetId);
      }
    });
  });
}

// ============================================================
// MOBILE MENU - Enhanced Navigation with Collapsible Nested Menus
// ============================================================
function initMobileMenu() {
  const navbarCollapse = document.querySelector('.mobile-nav-collapse');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuCloseBtn = document.querySelector('.mobile-menu-close');

  if (!navbarCollapse || !menuToggle) return;

  // Toggle menu visibility
  const toggleMenu = (show) => {
    if (show) {
      navbarCollapse.classList.add('show');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-menu-open');
    } else {
      navbarCollapse.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-menu-open');
      closeAllSubmenus();
    }
  };

  // Handle menu toggle button click
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navbarCollapse.classList.contains('show');
    toggleMenu(!isOpen);
  });

  // Handle mobile menu close button click
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu(false);
      // Return focus to menu toggle button
      menuToggle.focus();
    });
  }

  // Handle mobile dropdown toggles (collapsible nested menus)
  const mobileDropdowns = navbarCollapse.querySelectorAll('.mobile-dropdown');

  // Setup dropdown behavior
  function setupMobileDropdowns() {
    mobileDropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const submenu = dropdown.querySelector('.mobile-submenu');
      const arrow = dropdown.querySelector('.dropdown-arrow');

      if (!toggle || !submenu) return;

      // Remove existing click listeners by cloning and replacing
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);

      // Handle click for dropdown toggle
      newToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = submenu.classList.contains('show');
        closeAllSubmenus();

        // Pointer hover may already have opened a desktop menu before click.
        // Keep it open on desktop; on touch layouts a second tap collapses it.
        if (!isOpen || window.innerWidth >= 1120) {
          submenu.classList.add('show');
          dropdown.classList.add('show');
          newToggle.setAttribute('aria-expanded', 'true');
          if (arrow) {
            const svg = arrow.querySelector('svg');
            if (svg) svg.style.transform = 'rotate(180deg)';
          }
        }
      });
    });
  }

  // Initial setup
  setupMobileDropdowns();

  // Close menu when clicking on regular nav links (not dropdowns)
  const navLinks = navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1120 && navbarCollapse.classList.contains('show')) {
        toggleMenu(false);
      }
    });
  });

  // Close menu when clicking on submenu items
  const dropdownItems = navbarCollapse.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 1120 && navbarCollapse.classList.contains('show')) {
        toggleMenu(false);
      }
    });
  });

  // Close all submenus helper function
  function closeAllSubmenus() {
    mobileDropdowns.forEach(dd => {
      const sub = dd.querySelector('.mobile-submenu');
      const tog = dd.querySelector('.dropdown-toggle');
      const arr = dd.querySelector('.dropdown-arrow svg');

      if (sub) sub.classList.remove('show');
      dd.classList.remove('show');
      if (tog) tog.setAttribute('aria-expanded', 'false');
      if (arr) arr.style.transform = '';
    });
  }

  // Handle escape key to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
      toggleMenu(false);
    }
  });

  // Handle window resize - close mobile menu when switching to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1120 && navbarCollapse.classList.contains('show')) {
        toggleMenu(false);
      }
      // Re-setup dropdowns when viewport changes
      setupMobileDropdowns();
    }, 250);
  });

  // Handle clicks outside the menu to close it
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 1120 &&
        navbarCollapse.classList.contains('show') &&
        !navbarCollapse.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Desktop dropdown hover behavior
  if (window.innerWidth >= 1120) {
    mobileDropdowns.forEach(dropdown => {
      const submenu = dropdown.querySelector('.dropdown-menu');
      if (!submenu) return;

      dropdown.addEventListener('mouseenter', () => {
        submenu.classList.add('show');
        dropdown.classList.add('show');
      });

      dropdown.addEventListener('mouseleave', () => {
        submenu.classList.remove('show');
        dropdown.classList.remove('show');
      });
    });
  }
}

// ============================================================
// GALLERY LIGHTBOX (GLightbox Integration)
// ============================================================
function initGalleryLightbox() {
  const galleryContainer = document.querySelector('[data-gallery-lightbox]');

  if (!galleryContainer) return;

  // Initialize GLightbox with custom configuration
  const lightbox = GLightbox({
    // Selector for gallery items
    selector: '.glightbox',

    // Touch navigation (swipe support)
    touchNavigation: true,

    // Keyboard navigation
    keyboardNavigation: true,

    // Close on outside click
    closeOnOutsideClick: true,

    // Start at specific position (auto)
    startAt: 0,

    // Loop through images
    loop: true,

    // Auto-play slides (disabled by default)
    autoplayVideos: false,

    // Touch follow rate for better swipe experience
    touchFollowAxis: true,

    // Zoom support (requires zoomable class or data-zoomable)
    zoomable: true,

    // Draggable option
    draggable: true,
    dragToleranceX: 40,
    dragToleranceY: 65,

    // Preload nearby slides for smooth navigation
    preload: true,

    // Open and close effects
    openEffect: 'zoom',
    closeEffect: 'zoom',
    slideEffect: 'slide',

    // More text for descriptions
    moreText: '...',
    moreLength: 60,

    // CSS classes for custom styling
    cssEf498: {
      fade: { in: 'fadeIn', out: 'fadeOut' },
      zoom: { in: 'zoomIn', out: 'zoomOut' },
      slide: { in: 'slideInRight', out: 'slideOutLeft' }
    },

    // SVG icons for navigation (custom preschool-friendly icons with ARIA labels)
    svg: {
      close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" aria-label="Close gallery"><title>Close gallery</title><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>',
      prev: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16" aria-label="Previous image"><title>Previous image</title><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>',
      next: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16" aria-label="Next image"><title>Next image</title><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>'
    },

    // Lightbox skin customization
    skin: 'wesole-nutki-lightbox',

    // Accessibility
    descPosition: 'bottom',

    // Callbacks for custom behavior
    onOpen: () => {
      document.body.classList.add('glightbox-open');

      // Enhance close button with explicit accessibility attributes
      setTimeout(() => {
        const closeBtn = document.querySelector('.gclose');
        if (closeBtn) {
          // Add explicit ARIA label for screen readers
          closeBtn.setAttribute('aria-label', 'Close image gallery');
          closeBtn.setAttribute('role', 'button');
          closeBtn.setAttribute('data-testid', 'lightbox-close-button');
          closeBtn.setAttribute('title', 'Close (ESC)');

          // Ensure keyboard focus is possible
          if (!closeBtn.hasAttribute('tabindex')) {
            closeBtn.setAttribute('tabindex', '0');
          }
        }
      }, 100);
    },
    onClose: () => {
      document.body.classList.remove('glightbox-open');
    }
  });

  // Make lightbox instance available globally for potential extensions
  window.galleryLightbox = lightbox;
}

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
function initBackToTop() {
  // Create button if it doesn't exist
  let backToTop = document.querySelector('.back-to-top');

  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
      </svg>
    `;
    document.body.appendChild(backToTop);

    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      .back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--music-orange, #a94316);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 8px 20px rgba(169, 67, 22, 0.35);
        z-index: 1000;
      }
      .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      .back-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
      }
    `;
    document.head.appendChild(style);
  }

  // Show/hide button based on scroll position
  const toggleBackToTop = () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  // Throttle scroll event
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        toggleBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Scroll to top on click
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================================
// RESPONSIVE IMAGE LOADING HANDLER
// ============================================================
function initResponsiveImages() {
  const images = document.querySelectorAll('.responsive-image-main');

  if (images.length === 0) return;

  images.forEach(img => {
    // If image is already loaded (cached)
    if (img.complete) {
      img.classList.add('loaded');
      img.setAttribute('complete', 'true');
    } else {
      // Add load event listener
      img.addEventListener('load', function() {
        this.classList.add('loaded');
        this.setAttribute('complete', 'true');
      });
    }

    // Error handling is already done via onerror attribute in HTML
    // but we can add additional logging if needed
    img.addEventListener('error', function() {
      console.warn('Image failed to load:', this.src);
    });
  });
}

// ============================================================
// NEWS IMAGE FALLBACK HANDLER
// ============================================================
function initNewsImageFallback() {
  const newsImages = document.querySelectorAll('.news-card-image');

  if (newsImages.length === 0) return;

  newsImages.forEach(img => {
    // Handle already failed images (for cached 404s)
    if (img.complete && img.naturalHeight === 0) {
      const wrapper = img.parentElement;
      if (wrapper && wrapper.classList.contains('card-img-wrapper')) {
        wrapper.classList.add('image-error');
      }
    }

    // Add error event listener for runtime failures
    img.addEventListener('error', function() {
      const wrapper = this.parentElement;
      if (wrapper && wrapper.classList.contains('card-img-wrapper')) {
        wrapper.classList.add('image-error');
      }
      console.warn('News image failed to load:', this.src);
    });

    // Handle successful loads to ensure error state is removed if image loads later
    img.addEventListener('load', function() {
      const wrapper = this.parentElement;
      if (wrapper && wrapper.classList.contains('card-img-wrapper')) {
        wrapper.classList.remove('image-error');
      }
    });

  });
}

// ============================================================
// LANGUAGE PICKER STATE SYNCHRONIZATION
// ============================================================
function initLanguagePickerSync() {
  const languageSwitchers = document.querySelectorAll('.language-switcher');

  if (languageSwitchers.length === 0) return;

  // Function to detect current language from URL path
  function detectLanguageFromURL() {
    const path = window.location.pathname;

    // Match language code in URL path (e.g., /pl/, /en/, or /wesole_nutki/pl/)
    const langMatch = path.match(/\/(pl|en)\//);

    if (langMatch) {
      return langMatch[1];
    }

    // Default to Polish if no language detected
    return 'pl';
  }

  // Function to update active language state in all pickers
  function updateLanguagePickerState() {
    const currentLang = detectLanguageFromURL();

    languageSwitchers.forEach(switcher => {
      const langButtons = switcher.querySelectorAll('.lang-btn');

      langButtons.forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');

        if (btnLang === currentLang) {
          // Make this button active - just add the class, don't change DOM structure
          btn.classList.add('active');
          btn.setAttribute('aria-current', 'true');
        } else {
          // Make this button inactive
          btn.classList.remove('active');
          btn.removeAttribute('aria-current');
        }
      });

      // Update data-current-lang attribute on the container
      switcher.setAttribute('data-current-lang', currentLang);
    });
  }

  // Initial sync on page load (defensive - Hugo should already render correctly)
  updateLanguagePickerState();

  // Listen for browser navigation (back/forward buttons)
  window.addEventListener('popstate', function() {
    // Small delay to ensure URL is updated
    setTimeout(updateLanguagePickerState, 50);
  });
}

// ============================================================
// INITIALIZE ALL FEATURES
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize custom features
  initNavbarScroll();
  initScrollAnimations();
  initCounterAnimation();
  initSmoothScroll();
  initMobileMenu();
  initGalleryLightbox();
  initBackToTop();
  initResponsiveImages();
  initNewsImageFallback();
  initLanguagePickerSync();

  // Add loaded class for any CSS transitions
  document.body.classList.add('loaded');
});
