import Lenis from 'lenis';

export let lenis: Lenis | null = null;

export function initMotion(): void {
  Object.assign(window, { __motionInit: true });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduced.matches) {
    document.documentElement.classList.add('motion-ready');
    lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      autoToggle: true,
      anchors: { offset: -72 },
      smoothWheel: true,
    });
  }

  initReveal(reduced);

  reduced.addEventListener('change', event => {
    if (event.matches) {
      lenis?.destroy();
      lenis = null;
      document.documentElement.classList.remove('motion-ready');
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
        element.classList.add('is-in', 'is-settled');
      });
    }
  });
}

function initReveal(motion: MediaQueryList): void {
  if (motion.matches || !('IntersectionObserver' in window)) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
      element.classList.add('is-in', 'is-settled');
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      element.classList.add('is-in');
      observer.unobserve(element);
      const settle = (event: TransitionEvent) => {
        if (event.target !== element || event.propertyName !== 'opacity') return;
        element.classList.add('is-settled');
        element.removeEventListener('transitionend', settle);
      };
      element.addEventListener('transitionend', settle);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => observer.observe(element));
}
