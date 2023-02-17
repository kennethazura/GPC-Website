document.addEventListener('DOMContentLoaded', function() {
  const oHeroTitle = u('.hero__title');
  const oTimeline = gsap.timeline();
  oTimeline.fromTo(['.hero__title', '.hero__description'], 2, { opacity: 0, x: 100 }, { opacity: 1, x: 0 });
  oTimeline.fromTo(['.hero__btn'], 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: Power2.ease });
});
