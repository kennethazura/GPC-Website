document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const iDeviceWidth = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
  const sDevice = (iDeviceWidth >= 1024) ? 'pc' : 'mobile';
  const oBody = u('body');
  const oNavbar = u('.navbar');
  const oNavbarMenuBtn = u('.navbar__burger-btn');
  const oQualificationHeader = u('.qualifications__header');
  const oHeroTitle = u('.hero__title');
  const oHeroDescription = u('.hero__description');
  const oJobResponsibilities = u('.responsibilities__container--pc');
  const oJobQualifications = u('.qualifications__container--pc');
  let oResponsibilitiesSwiper;
  let oQualificationSwiper;

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

  function _cleanUp() {
    if (sDevice === 'mobile') {
      oQualificationHeader.html('Qualifications<br>/Requirements');
    }
  }

  function initSwipers() {
    oResponsibilitiesSwiper = new Swiper('.responsibilities__container .swiper', {
      direction: 'horizontal',
      speed: 1000,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.responsibilities__container .swiper-pagination',
        clickable: true,
      },
    });

    oQualificationSwiper = new Swiper('.qualifications__container .swiper', {
      direction: 'horizontal',
      speed: 1000,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.qualifications__container .swiper-pagination',
        clickable: true,
      },
    });
  }

  function initEventListeners() {
    oNavbarMenuBtn.on('click', function() { oNavbar.toggleClass('active'); oBody.toggleClass('no-scroll'); });
    if (sDevice === 'mobile') {
      if (oResponsibilitiesSwiper !== undefined) {
        oResponsibilitiesSwiper.on('touchMove', function() { oQualificationSwiper.autoplay.stop(); });
        oResponsibilitiesSwiper.on('touchEnd', function() { oQualificationSwiper.autoplay.start(); });
      }

      if (oQualificationSwiper !== undefined) {
        oQualificationSwiper.on('touchMove', function() { oQualificationSwiper.autoplay.stop(); });
        oQualificationSwiper.on('touchEnd', function() { oQualificationSwiper.autoplay.start(); });
      }
    }
  }
  function _getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  function jobData(details) {
    const responsibilities = details.Responsibilities__c.split("<li>");
    const qualifications = details.Candidate_Qualifications__c.split("<li>");
    oHeroTitle.text(details.Category__c);
    oHeroDescription.html(details.Description__c);
    console.log(details.Responsibilities__c.split("<li>"));
    for (let ctr = 1; ctr < responsibilities.length; ctr += 1) {
      oJobResponsibilities.append(`<div class="responsibilities__item">
<div src="" class="responsibilities__icon"></div>
<p class="responsibilities__text">${responsibilities[ctr]}</p>
</div>`);
    }
    for (let ctr = 1; ctr < qualifications.length; ctr += 1) {
      oJobQualifications.append(`<div class="qualifications__item"
        <div class="qualifications__item"></div>
        <p class="qualifications__text"><img class="qualifications__icon"/></img>${qualifications[ctr]}</p>
    </div>`);
    }
    console.log(details);
  }

  function _load() {
    const accessToken = _getCookie('accessToken');
    const salesForceId = _getCookie('salesForceId');
    const jobId = window.location.pathname.split("/")[2];

    fetch(
      `${DOMAIN}${API_ROUTE}/job-details`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId, accessToken, salesForceId,
        }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          jobData(data.body.job);
        } else if (data.body.errMessage) {
          alert('Error: ' + data.body.errCode);
          console.warn(data.body.errMessage);
          console.warn(data.body.consoleMessage);
        } else {
          console.warn('Unfortunately, an error occurred in the server');
        }
      });
  }

  function init() {
    // const oHeroTimeline = gsap.timeline();
    // oHeroTimeline.fromTo(['.navbar'], 0.5, { opacity: 0 }, { opacity: 1, onComplete: function() {
    //   oNavbar.addClass('navbar--white'); // then only replace with blue div with new height and width
    // }});
    oNavbar.addClass('navbar--white');
    if (sDevice === 'mobile') {
      _cleanUp();
      initSwipers();
    }
    _load();
    initEventListeners();
  }

  init();
});
