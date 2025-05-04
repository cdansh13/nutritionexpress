document.addEventListener('DOMContentLoaded', () => {
  // Wait for images to load
  const images = document.querySelectorAll('img');
  let imagesLoaded = 0;
  
  // Initialize animations once all images are loaded
  const onImageLoad = () => {
    imagesLoaded++;
    if (imagesLoaded === images.length) {
      initAnimations();
    }
  };
  
  // Check if all images are loaded
  images.forEach(image => {
    if (image.complete) {
      onImageLoad();
    } else {
      image.addEventListener('load', onImageLoad);
      image.addEventListener('error', onImageLoad); // Handle error case
    }
  });
  
  // If no images, initialize animations immediately
  if (images.length === 0) {
    initAnimations();
  }
});

// Main animation initialization
function initAnimations() {
  // Hero animations
  animateHero();
  
  // Parallax effects
  initParallax();
  
  // Product hover effects
  initProductHoverEffects();
  
  // Text scramble effect for dynamic text
  initTextScramble();
  
  // Initialize mouse follower effect
  initMouseFollower();
}

// Hero section animations
function animateHero() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  const productContainer = document.querySelector('.product-container');
  
  // Add floating animation to product image
  if (productContainer) {
    productContainer.classList.add('floating');
    
    // Add 3D tilt effect on mouse move
    heroSection.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return; // Disable on mobile
      
      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
      
      productContainer.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    // Reset on mouse leave
    heroSection.addEventListener('mouseleave', () => {
      productContainer.style.transform = 'perspective(1000px) rotateY(-15deg)';
    });
  }
}

// Parallax scrolling effect
function initParallax() {
  if (window.innerWidth <= 768) return; // Disable on mobile
  
  const parallaxElements = document.querySelectorAll('.hero-image, .highlight-image');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top + scrollY;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Only apply parallax if element is in viewport
      if (scrollY + windowHeight > elementTop && scrollY < elementTop + elementHeight) {
        const parallaxValue = (scrollY - (elementTop - windowHeight)) * 0.1;
        element.style.transform = `translateY(${parallaxValue}px)`;
      }
    });
  });
}

// Product hover effects
function initProductHoverEffects() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const image = card.querySelector('img');
    
    card.addEventListener('mouseenter', () => {
      // Scale up image
      if (image) {
        image.style.transform = 'scale(1.1)';
      }
      
      // Add glow effect
      card.classList.add('product-glowing');
    });
    
    card.addEventListener('mouseleave', () => {
      if (image) {
        image.style.transform = '';
      }
      
      card.classList.remove('product-glowing');
    });
  });
}

// Text scramble effect for dynamic text elements
function initTextScramble() {
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    
    update() {
      let output = '';
      let complete = 0;
      
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="scramble-text">${char}</span>`;
        } else {
          output += from;
        }
      }
      
      this.el.innerHTML = output;
      
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }
  
  // Apply effect to elements with data-scramble attribute
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  
  scrambleElements.forEach(el => {
    const originalText = el.textContent;
    const scramble = new TextScramble(el);
    
    // Initial scramble
    setTimeout(() => {
      scramble.setText(originalText);
    }, 500 + Math.random() * 1000);
    
    // Re-scramble on hover
    el.addEventListener('mouseenter', () => {
      scramble.setText(originalText);
    });
  });
}

// Mouse follower effect
function initMouseFollower() {
  if (window.innerWidth <= 768) return; // Disable on mobile
  
  // Create follower element
  const follower = document.createElement('div');
  follower.className = 'mouse-follower';
  follower.style.cssText = `
    position: fixed;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(42, 58, 251, 0.2);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
    backdrop-filter: blur(2px);
    mix-blend-mode: exclusion;
    opacity: 0;
  `;
  
  document.body.appendChild(follower);
  
  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    follower.style.opacity = '1';
    follower.style.left = `${e.clientX}px`;
    follower.style.top = `${e.clientY}px`;
  });
  
  // Expand on clickable elements
  const interactiveElements = document.querySelectorAll('a, button, .product-card, .benefit-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      follower.style.backgroundColor = 'rgba(42, 58, 251, 0.1)';
    });
    
    el.addEventListener('mouseleave', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.backgroundColor = 'rgba(42, 58, 251, 0.2)';
    });
  });
  
  // Hide when mouse leaves the window
  document.addEventListener('mouseleave', () => {
    follower.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    follower.style.opacity = '1';
  });
}

// Advanced scroll effects
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // Parallax effect for background particles
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    particleCanvas.style.transform = `translateY(${scrollY * 0.1}px)`;
  }
  
  // Fade out hero section as user scrolls down
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const heroHeight = heroSection.offsetHeight;
    const opacity = 1 - Math.min(1, scrollY / heroHeight);
    
    heroSection.style.opacity = Math.max(opacity, 0.2);
  }
});