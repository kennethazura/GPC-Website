document.addEventListener('DOMContentLoaded', function() {
  const oNavbar = u('.navbar');
  const oDocument = u(document);
  const oNavButtons = u('.navbar__link');
  const oFooterLinks = u('.footer__link');
  const oScrollMagicController = new ScrollMagic.Controller();
  const oAnimationStatus = {
    heroSection: false,
    jobCategories: false,
  };

  const oHeroSwiper = new Swiper('.swiper', {
    direction: 'horizontal',
    speed: 1000,
    autoplay: {
      delay: 7000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  function _runHeroAnimation() {
    const oHeroTimeline = gsap.timeline();
    oHeroTimeline.fromTo(['.hero__title', '.hero__description'], 2, { opacity: 0, x: 100 }, { opacity: 1, x: 0 });
    oHeroTimeline.fromTo(['.navbar'], 0.5, { opacity: 0 }, { opacity: 1 });
    oHeroTimeline.fromTo(['.hero__btn', '.swiper-pagination'], 1, { opacity: 0 }, { opacity: 1 });

    return oHeroTimeline;
  }

  function _runJobCategoriesAnimation() {
    const oJobCatTimeline = gsap.timeline();
    oJobCatTimeline.fromTo(['.job-categories__header'], 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    oJobCatTimeline.fromTo(['.job-item', '.job-categories__button'], 1.5, { opacity: 0, y: 500, pointerEvents: 'none' }, {
      opacity: 1, y: 0, stagger: 0.25,
    }).set(['.job-item', '.job-categories__button'], { pointerEvents: 'unset' });

    return oJobCatTimeline;
  }

  const oHeroScene = new ScrollMagic.Scene({
    triggerElement: '.hero.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--hero')
    .on('enter', function() {
      if (oAnimationStatus.heroSection === false && document.documentElement.scrollTop < 550) {
        oAnimationStatus.heroSection = true;
        _runHeroAnimation();
      }
      oHeroSwiper.autoplay.start();
    })
    .on('leave', function() {
      oHeroSwiper.autoplay.stop();
    })
    .addTo(oScrollMagicController);

  const oJobCategoriesScene = new ScrollMagic.Scene({
    triggerElement: '.job-categories.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--job-categories')
    .on('enter', function() {
      if (oAnimationStatus.jobCategories === false) {
        oAnimationStatus.jobCategories = true;
        _runJobCategoriesAnimation();
      }
    })
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
    oHeroSwiper.on('touchMove', function() { oHeroSwiper.autoplay.stop(); });
    oHeroSwiper.on('touchEnd', function() { oHeroSwiper.autoplay.start(); });
  }

  function _cleanUp() {
    const oJobtitles = u('.job-item__title').nodes;
    for (let i = 0; i < oJobtitles.length; i += 1) {
      if (oJobtitles[i].innerHTML === 'Staff Accountant/Bookkeeper') {
        const aString = oJobtitles[i].innerHTML.split('/');
        oJobtitles[i].innerHTML = aString[0] + '/<br>' + aString[1];
      }
      if (oJobtitles[i].innerHTML === 'Controller') {
        u(oJobtitles[i]).siblings('.job-item__icon').addClass('controller');
      }
    }
  }

  function init() {
    initEventListeners();
    toggleNavbarState();
    _cleanUp();
  }

  init();
});
