document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;
  
  // Create mobile overlay
  const mobileOverlay = document.createElement('div');
  mobileOverlay.classList.add('mobile-overlay');
  body.appendChild(mobileOverlay);
  
  // Handle scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Prevent body scrolling when menu is open
    if (body.classList.contains('menu-open')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }
  
  // Close mobile menu when clicking outside
  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    mobileOverlay.classList.remove('active');
    body.classList.remove('menu-open');
    body.style.overflow = '';
  }
  
  // Initialize nav links hover effect
  function initNavLinksEffect() {
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    navLinksItems.forEach(link => {
      link.addEventListener('mouseenter', () => {
        navLinksItems.forEach(item => {
          if (item !== link) {
            item.style.opacity = '0.5';
          }
        });
      });
      
      link.addEventListener('mouseleave', () => {
        navLinksItems.forEach(item => {
          item.style.opacity = '1';
        });
      });
    });
  }
  
  // Handle smooth scrolling for anchor links
  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          closeMobileMenu();
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const headerOffset = 80;
          
          window.scrollTo({
            top: offsetTop - headerOffset,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // Page transition effect for navigation between pages
  function initPageTransitions() {
    const pageLinks = document.querySelectorAll('a:not([href^="#"])');
    
    pageLinks.forEach(link => {
      // Skip external links or same page links
      if (link.getAttribute('target') === '_blank' || !link.getAttribute('href').endsWith('.html')) {
        return;
      }
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetHref = this.getAttribute('href');
        
        // Create transition overlay
        const transitionOverlay = document.createElement('div');
        transitionOverlay.classList.add('page-transition');
        body.appendChild(transitionOverlay);
        
        setTimeout(() => {
          transitionOverlay.classList.add('active');
          
          setTimeout(() => {
            window.location.href = targetHref;
          }, 600);
        }, 10);
      });
    });
    
    // Handle the transition when page loads
    if (document.referrer) {
      const transitionOverlay = document.createElement('div');
      transitionOverlay.classList.add('page-transition');
      transitionOverlay.classList.add('active');
      body.appendChild(transitionOverlay);
      
      setTimeout(() => {
        transitionOverlay.classList.add('exit');
        
        setTimeout(() => {
          transitionOverlay.remove();
        }, 600);
      }, 10);
    }
  }
  
  // Event listeners
  window.addEventListener('scroll', handleScroll);
  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);
  
  // Initialize functions
  handleScroll(); // Check scroll position on load
  initNavLinksEffect();
  initSmoothScrolling();
  initPageTransitions();
  
  // Handle nav links click on mobile
  const navLinkItems = document.querySelectorAll('.nav-links a');
  navLinkItems.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 820) {
        closeMobileMenu();
      }
    });
  });
  
  // Floating animation for navbar
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (lastScrollY > 100) {
          navbar.style.transform = `translateY(${Math.min(10, lastScrollY / 50)}px)`;
        } else {
          navbar.style.transform = 'translateY(0)';
        }
        ticking = false;
      });
      
      ticking = true;
    }
  });
});