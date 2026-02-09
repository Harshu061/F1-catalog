/* ============================= */
/* SCROLL ANIMATION HANDLER */
/* ============================= */

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add visible class and keep it - don't unobserve
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with scroll animation classes
document.addEventListener('DOMContentLoaded', () => {
  const scrollElements = document.querySelectorAll(
    '.scroll-fade-up, .scroll-slide-left, .scroll-slide-right, .scroll-scale'
  );

  scrollElements.forEach(element => {
    scrollObserver.observe(element);
  });

  // Also observe driver cards added dynamically
  const observer = new MutationObserver(() => {
    const newElements = document.querySelectorAll(
      '.scroll-fade-up:not(.visible), .scroll-slide-left:not(.visible), .scroll-slide-right:not(.visible), .scroll-scale:not(.visible)'
    );
    newElements.forEach(element => {
      scrollObserver.observe(element);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});