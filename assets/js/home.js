document.addEventListener('DOMContentLoaded', function() {
  const oNavbar = u('.navbar');
  const oDocument = u(document);
  const oNavButtons = u('.navbar__link');
  const oFooterLinks = u('.footer__link');
  const oScrollMagicController = new ScrollMagic.Controller();
  const aScrollAnchors = ['hero-section', 'how-section', 'why-section', 'job-categories-section', 'pricing-section'];

  function _runHeroAnimation() {
    const oHeroTimeline = gsap.timeline();
    oHeroTimeline.fromTo(['.hero__title', '.hero__description'], 2, { opacity: 0, x: 100 }, { opacity: 1, x: 0 });
    oHeroTimeline.fromTo(['.navbar'], 0.5, { opacity: 0 }, { opacity: 1 });
    oHeroTimeline.fromTo(['.hero__btn'], 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });

    return oHeroTimeline;
  }

  function _runJobCategoriesAnimation() {
    const oJobCatTimeline = gsap.timeline();
    oJobCatTimeline.fromTo(['.job-categories__header'], 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    oJobCatTimeline.fromTo(['.job-item'], 1.5, { opacity: 0, y: 500 }, {
      opacity: 1, y: 0, stagger: 0.25,
    });

    return oJobCatTimeline;
  }

  const oHeroScene = new ScrollMagic.Scene({
    triggerElement: '.hero.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--hero')
    // .setTween(_runHeroAnimation())
    .addTo(oScrollMagicController);

  const oJobCategoriesScene = new ScrollMagic.Scene({
    triggerElement: '.job-categories.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--job-categories')
    // .setTween(_runJobCategoriesAnimation())
    .addTo(oScrollMagicController);

  const oHowGPCWorksScene = new ScrollMagic.Scene({
    triggerElement: '.how-gpc-works.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--how-gpc-works')
  // .setTween(_runJobCategoriesAnimation())
    .addTo(oScrollMagicController);

  const oWhyGPCWorksScene = new ScrollMagic.Scene({
    triggerElement: '.why-gpc.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--why-gpc')
    // .setTween(_runJobCategoriesAnimation())
    .addTo(oScrollMagicController);

  function _isTopOfPage() {
    return document.documentElement.scrollTop < 1;
  }

  function toggleNavbarState() {
    if (_isTopOfPage() === false) { oNavbar.addClass('navbar--white'); oNavbar.nodes[0].style.opacity = '1'; } else { oNavbar.removeClass('navbar--white'); }
  }

  function scrollToSection(eEvent) {
    eEvent.preventDefault();
    const sTargetSection = eEvent.target.href.substr(eEvent.target.href.indexOf('#') + 1);
    u('#' + sTargetSection).scroll();
  }

  function initEventListeners() {
    oDocument.on('scroll', toggleNavbarState);
    oNavButtons.on('click', function(eEvent) { scrollToSection(eEvent); });
    oFooterLinks.on('click', function(eEvent) { scrollToSection(eEvent); });
  }

  function init() {
    initEventListeners();
    toggleNavbarState();
    _runHeroAnimation();
    _runJobCategoriesAnimation();
  }

  init();
});
