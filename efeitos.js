(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = [...document.querySelectorAll(
    '.hero-copy, .hero-media, .section-head, .services-grid article, .about-media, .section-copy, .steps article, .location-copy, .location-photo'
  )];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach(element => element.classList.add('in-view'));
    return;
  }

  elements.forEach((element, index) => {
    element.classList.add('reveal-item');
    const inGrid = element.closest('.services-grid, .steps, .faq-list');
    const direction = inGrid
      ? 'reveal-from-bottom'
      : (index % 3 === 0 ? 'reveal-from-left' : index % 3 === 1 ? 'reveal-from-bottom' : 'reveal-from-right');
    element.classList.add(direction);
    element.style.setProperty('--reveal-delay', inGrid ? `${(index % 3) * 70}ms` : '0ms');
  });

  document.documentElement.classList.add('reveal-ready');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: .06, rootMargin: '0px 0px -2% 0px' });

  elements.forEach(element => observer.observe(element));

  let scheduled = false;
  const revealPassedElements = () => {
    scheduled = false;
    elements.forEach(element => {
      if (element.classList.contains('in-view')) return;
      if (element.getBoundingClientRect().top < window.innerHeight * 1.08) {
        element.classList.add('in-view');
        observer.unobserve(element);
      }
    });
  };
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(revealPassedElements);
  }, { passive: true });
  revealPassedElements();
})();
