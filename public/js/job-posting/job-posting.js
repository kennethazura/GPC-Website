document.addEventListener('DOMContentLoaded', function() {
    const oNavbar = u('.navbar');
    // const oDocument = u(document);
    // const oNavButtons = u('.navbar__link');
    // const oFooterLinks = u('.footer__link');
    // const oScrollMagicController = new ScrollMagic.Controller();
    // const oAnimationStatus = {
    //   heroSection: false,
    //   howSection: false,
    //   whySection: false,
    //   jobCategories: false,
    // };
  
    // const oHeroSwiper = new Swiper('.swiper', {
    //   direction: 'horizontal',
    //   speed: 1000,
    //   autoplay: {
    //     delay: 7000,
    //     disableOnInteraction: false,
    //   },
    //   pagination: {
    //     el: '.swiper-pagination',
    //     clickable: true,
    //   },
    // });
  
    // function _runHeroAnimation() {
    //   const oHeroTimeline = gsap.timeline();
    //   oHeroTimeline.fromTo(['.hero__title', '.hero__description'], 2, { opacity: 0, x: 100 }, { opacity: 1, x: 0 });
    //   oHeroTimeline.fromTo(['.navbar'], 0.5, { opacity: 0 }, { opacity: 1 });
    //   oHeroTimeline.fromTo(['.hero__btn', '.swiper-pagination'], 1, { opacity: 0 }, { opacity: 1 });
  
    //   return oHeroTimeline;
    // }
  
    // function _runHowSectionAnimation() {
    //   const oHowSectionTimeline = gsap.timeline();
    //   oHowSectionTimeline.fromTo('.how__header', 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    //   oHowSectionTimeline.fromTo('.step__body', 1, { opacity: 0, x: -250 }, { opacity: 1, x: 0, stagger: 0.5 });
  
    //   return oHowSectionTimeline;
    // }
  
    // function _runWhySectionAnimation() {
    //   const oWhySectionTimeline = gsap.timeline();
    //   oWhySectionTimeline.fromTo('.why__header', 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    //   oWhySectionTimeline.fromTo('.why__item', 0.5, { opacity: 0, scale: 0.5 }, {
    //     opacity: 1, scale: 1, stagger: 0.25, ease: 'back.out(1.7)',
    //   });
  
    //   return oWhySectionTimeline;
    // }
  
    // function _runJobCategoriesAnimation() {
    //   const oJobCatTimeline = gsap.timeline();
    //   oJobCatTimeline.fromTo(['.job-categories__header'], 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    //   oJobCatTimeline.fromTo(['.job-item', '.job-categories__button'], 0.5, { opacity: 0, scale: 0.5, pointerEvents: 'none' }, {
    //     opacity: 1, scale: 1, stagger: 0.2,
    //   }).set(['.job-item', '.job-categories__button'], { pointerEvents: 'unset' });
  
    //   return oJobCatTimeline;
    // }
  
    // function _isScrollPositionCorrect(iSectionNumber) {
    //   return document.documentElement.scrollTop < window.screen.height * iSectionNumber - (window.screen.height * 0.5);
    // }
  
    // const oHeroScene = new ScrollMagic.Scene({
    //   triggerElement: '.hero.section',
    //   duration: 1000,
    // }).setClassToggle('.navbar', 'section--hero')
    //   .on('enter', function() {
    //     if (oAnimationStatus.heroSection === false && _isScrollPositionCorrect(1)) {
    //       oAnimationStatus.heroSection = true;
    //       _runHeroAnimation();
    //     }
    //     oHeroSwiper.autoplay.start();
    //   })
    //   .on('leave', function() {
    //     oHeroSwiper.autoplay.stop();
    //   })
    //   .addTo(oScrollMagicController);
  
    // const oHowSectionWorksScene = new ScrollMagic.Scene({
    //   triggerElement: '.how-gpc-works.section',
    //   duration: 1000,
    // }).setClassToggle('.navbar', 'section--how-gpc-works')
    //   .on('enter', function() {
    //     if (oAnimationStatus.howSection === false && _isScrollPositionCorrect(2)) {
    //       oAnimationStatus.howSection = true;
    //       _runHowSectionAnimation();
    //     }
    //   })
    //   .addTo(oScrollMagicController);
  
    // const oWhyGPCWorksScene = new ScrollMagic.Scene({
    //   triggerElement: '.why-gpc.section',
    //   duration: 1000,
    // }).setClassToggle('.navbar', 'section--why-gpc')
    //   .on('enter', function() {
    //     if (oAnimationStatus.whySection === false && _isScrollPositionCorrect(3)) {
    //       oAnimationStatus.whySection = true;
    //       _runWhySectionAnimation();
    //     }
    //   })
    //   .addTo(oScrollMagicController);
  
    // const oJobCategoriesScene = new ScrollMagic.Scene({
    //   triggerElement: '.job-categories.section',
    //   duration: 2000,
    // }).setClassToggle('.navbar', 'section--job-categories')
    //   .on('enter', function() {
    //     if (oAnimationStatus.jobCategories === false && _isScrollPositionCorrect(5)) {
    //       oAnimationStatus.jobCategories = true;
    //       _runJobCategoriesAnimation();
    //     }
    //   })
    //   .addTo(oScrollMagicController);
  
    // function _isTopOfPage() {
    //   return document.documentElement.scrollTop < 1;
    // }
  
    // function toggleNavbarState() {
    //   if (_isTopOfPage() === false) { oNavbar.addClass('navbar--white'); oNavbar.nodes[0].style.opacity = '1'; } else { oNavbar.removeClass('navbar--white'); }
    // }
  
    // function scrollToSection(eEvent) {
    //   eEvent.preventDefault();
    //   const sTargetSection = eEvent.target.href.substr(eEvent.target.href.indexOf('#') + 1);
    //   u('#' + sTargetSection).scroll();
    // }
  
    // function initEventListeners() {
    //   oDocument.on('scroll', toggleNavbarState);
    //   oNavButtons.on('click', function(eEvent) { scrollToSection(eEvent); });
    //   oFooterLinks.on('click', function(eEvent) { scrollToSection(eEvent); });
    //   oHeroSwiper.on('touchMove', function() { oHeroSwiper.autoplay.stop(); });
    //   oHeroSwiper.on('touchEnd', function() { oHeroSwiper.autoplay.start(); });
    // }
  
    function init() {
      const oHeroTimeline = gsap.timeline();
      oHeroTimeline.fromTo(['.navbar'], 0.5, { opacity: 0 }, { opacity: 1, onComplete: function() {
        oNavbar.addClass('navbar--white'); // then only replace with blue div with new height and width
      }});
    }
  
    init();
  });
  