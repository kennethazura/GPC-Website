document.addEventListener('DOMContentLoaded', function() {
  const oNavbar = u('.navbar');
  const oDocument = u(document);

  const oTimeline = gsap.timeline();
  oTimeline.fromTo(['.hero__title', '.hero__description'], 2, { opacity: 0, x: 100 }, { opacity: 1, x: 0 });
  oTimeline.fromTo(['.navbar'], 0.5, { opacity: 0 }, { opacity: 1 });
  oTimeline.fromTo(['.hero__btn'], 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: Power2.ease });

  function initEventListeners() {
    oDocument.on('scroll', function() {
      if (document.documentElement.scrollTop > 1) { oNavbar.addClass('navbar--white'); } else { oNavbar.removeClass('navbar--white'); }
    });
  }

  function init() {
    initEventListeners();
  }

  init();
});
