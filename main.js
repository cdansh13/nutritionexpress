document.addEventListener('DOMContentLoaded', () => {
  // Page loader with reduced delay
  const loader = document.querySelector('.loader');
  
  // Wait for all resources to load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove loader from DOM after transition completes
      loader.addEventListener('transitionend', () => {
        loader.style.display = 'none';
      });
    }, 500); // Reduced from 1000ms to 500ms
  });
  
  // Initialize particles background
  initParticles();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize stat counters
  initStatCounters();
  
  // Initialize testimonial slider if on the home page
  if (document.querySelector('.testimonial-slider')) {
    initTestimonialSlider();
  }
  
  // Initialize newsletter form
  initNewsletterForm();
});

// Particles background
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // Call once on init
  setCanvasSize();
  
  // Update canvas size on window resize
  window.addEventListener('resize', setCanvasSize);
  
  // Particle settings
  const particleCount = 50;
  const particleColor = 'rgba(42, 58, 251, 0.2)';
  const particles = [];
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
  
  // Animate particles
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor.replace('0.2', p.opacity);
      ctx.fill();
      
      // Move particles
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Bounce off edges
      if (p.x + p.radius > canvas.width || p.x - p.radius < 0) {
        p.speedX = -p.speedX;
      }
      
      if (p.y + p.radius > canvas.height || p.y - p.radius < 0) {
        p.speedY = -p.speedY;
      }
    }
    
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();
}

// Scroll-triggered animations
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealOnScroll = () => {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  };
  
  // Initial check
  revealOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', revealOnScroll);
}

// Stat counter animation
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  
  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const duration = 2000; // ms
    const increment = target / (duration / 16); // 60fps approx
    
    counter.classList.add('counting');
    
    const updateCounter = () => {
      count += increment;
      counter.innerText = Math.ceil(count);
      
      if (count < target) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };
    
    updateCounter();
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Testimonial slider
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const dots = document.querySelectorAll('.dot');
  
  let currentIndex = 0;
  const slideWidth = 100; // percentage
  
  // Set initial position
  track.style.transform = `translateX(0%)`;
  
  // Update slider position
  const updateSlider = () => {
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };
  
  // Next slide
  const nextSlide = () => {
    if (currentIndex >= slides.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateSlider();
  };
  
  // Previous slide
  const prevSlide = () => {
    if (currentIndex <= 0) {
      currentIndex = slides.length - 1;
    } else {
      currentIndex--;
    }
    updateSlider();
  };
  
  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Click on dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
  });
  
  // Auto-slide every 5 seconds
  let slideInterval = setInterval(nextSlide, 5000);
  
  // Pause auto-slide on hover
  track.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  track.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });
}

// Newsletter form submission
function initNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!email) {
        // Show error
        return;
      }
      
      // Simulate form submission
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Simulate API call
      setTimeout(() => {
        // Reset form
        emailInput.value = '';
        submitBtn.textContent = 'Sent!';
        
        // Add success message
        const successMsg = document.createElement('p');
        successMsg.textContent = 'Thank you for subscribing! Check your email for the discount code.';
        successMsg.style.color = 'var(--color-success)';
        successMsg.style.marginTop = 'var(--space-1)';
        successMsg.style.fontWeight = 'var(--font-weight-bold)';
        
        newsletterForm.appendChild(successMsg);
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          
          // Fade out success message
          successMsg.style.opacity = '0';
          successMsg.style.transition = 'opacity 0.5s ease';
          
          setTimeout(() => {
            successMsg.remove();
          }, 500);
        }, 3000);
      }, 1500);
    });
  }
}