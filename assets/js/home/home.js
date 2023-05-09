document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oDocument = u(document);
  const oBody = u('body');
  const oNavButtons = u('.navbar__link');
  const oNavButtonsMobile = u('.navbar-menu__link');
  const oFooterLinks = u('.footer__link');
  const oNavbarMenuBtn = u('.navbar__burger-btn');
  const oScrollMagicController = new ScrollMagic.Controller();
  const oJobCategoriesList = u('.job-categories__list');
  const oLoadMoreJobsBtn = u('.job-categories__button');
  const iDeviceWidth = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
  const sDevice = (iDeviceWidth >= 1024) ? 'pc' : 'mobile';
  const iTotalAvailableJobs = 9;
  let iLoadedJobs = 3;
  let oWhySwiper;
  const oAnimationStatus = {
    heroSection: false,
    howSection: false,
    whySection: false,
    jobCategories: false,
    pricetc: false,
  };

  const oHeroSwiper = new Swiper('#hero-section .swiper', {
    direction: 'horizontal',
    speed: 1000,
    autoplay: {
      delay: 7000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '#hero-section .swiper-pagination',
      clickable: true,
    },
  });

  if (sDevice === 'mobile') {
    oWhySwiper = new Swiper('#why-section .swiper', {
      direction: 'horizontal',
      speed: 1000,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '#why-section .swiper-pagination',
        clickable: true,
      },
    });
  }

  function _runHeroAnimation() {
    const oHeroTimeline = gsap.timeline();
    oHeroTimeline.fromTo(['.hero__title', '.hero__description'], 2, { opacity: 0, x: 100 }, { opacity: 1, x: 0 });
    oHeroTimeline.fromTo(['.navbar'], 0.5, { opacity: 0 }, { opacity: 1 });
    oHeroTimeline.fromTo(['.hero__btn', '.swiper-pagination'], 1, { opacity: 0 }, { opacity: 1 });

    return oHeroTimeline;
  }

  function _runHowSectionAnimation() {
    const oHowSectionTimeline = gsap.timeline();
    oHowSectionTimeline.fromTo('.how__header', 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    oHowSectionTimeline.fromTo('.step__body', 1, { opacity: 0, x: -250 }, { opacity: 1, x: 0, stagger: 0.5 });

    return oHowSectionTimeline;
  }

  function _runWhySectionAnimation() {
    const oWhySectionTimeline = gsap.timeline();
    oWhySectionTimeline.fromTo('.why__header', 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    oWhySectionTimeline.fromTo('.why__item', 0.5, { opacity: 0, scale: 0.5 }, {
      opacity: 1, scale: 1, stagger: 0.25, ease: 'back.out(1.7)',
    });

    return oWhySectionTimeline;
  }

  function _runJobCategoriesAnimation() {
    const oJobCatTimeline = gsap.timeline();
    oJobCatTimeline.fromTo(['.job-categories__header'], 1, { opacity: 0, y: 50 }, { opacity: 1, y: 0 });
    oJobCatTimeline.fromTo(['.job-item'], 0.5, { opacity: 0, scale: 0.5, pointerEvents: 'none' }, {
      opacity: 1, scale: 1, stagger: 0.2,
    }).set(['.job-item'], { pointerEvents: 'unset' });

    return oJobCatTimeline;
  }

  function _isScrollPositionCorrect(iSectionNumber) {
    return document.documentElement.scrollTop < window.screen.height * iSectionNumber - (window.screen.height * 0.5);
  }

  const oHeroScene = new ScrollMagic.Scene({
    triggerElement: '.hero.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--hero')
    .on('enter', function() {
      if (oAnimationStatus.heroSection === false && _isScrollPositionCorrect(1)) {
        oAnimationStatus.heroSection = true;
        // _runHeroAnimation();
      }
      oHeroSwiper.autoplay.start();
    })
    .on('leave', function() {
      oHeroSwiper.autoplay.stop();
    })
    .addTo(oScrollMagicController);

  const oHowSectionWorksScene = new ScrollMagic.Scene({
    triggerElement: '.how-gpc-works.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--how-gpc-works')
    .on('enter', function() {
      if (oAnimationStatus.howSection === false && _isScrollPositionCorrect(2)) {
        oAnimationStatus.howSection = true;
        // _runHowSectionAnimation();
      }
    })
    .addTo(oScrollMagicController);

  const oWhyGPCWorksScene = new ScrollMagic.Scene({
    triggerElement: '.why-gpc.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--why-gpc')
    .on('enter', function() {
      if (oAnimationStatus.whySection === false && _isScrollPositionCorrect(3)) {
        oAnimationStatus.whySection = true;
        // _runWhySectionAnimation();
      }
    })
    .addTo(oScrollMagicController);

  const oJobCategoriesScene = new ScrollMagic.Scene({
    triggerElement: '.job-categories.section',
    duration: 1500,
  }).setClassToggle('.navbar', 'section--job-categories')
    .on('enter', function() {
      if (oAnimationStatus.jobCategories === false && _isScrollPositionCorrect(5)) {
        oAnimationStatus.jobCategories = true;
        // _runJobCategoriesAnimation();
      }
    })
    .addTo(oScrollMagicController);

  const oPriceTermsandConditionScene = new ScrollMagic.Scene({
    triggerElement: '.price-tc.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--price-tc')
    .on('enter', function() {
      if (oAnimationStatus.pricetc === false && _isScrollPositionCorrect(6)) {
        oAnimationStatus.pricetc = true;
        // _runJobCategoriesAnimation();
      }
    })
    .addTo(oScrollMagicController);

  const oContactUsScene = new ScrollMagic.Scene({
    triggerElement: '.contact-us.section',
    duration: 1000,
  }).setClassToggle('.navbar', 'section--contact-us')
    .on('enter', function() {
      if (oAnimationStatus.pricetc === false && _isScrollPositionCorrect(6)) {
        // oAnimationStatus.pricetc = true;
        // _runJobCategoriesAnimation();
      }
    })
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

  /**
   * Creates a Job item card to be appended to the job categories list
   *
   * @param {String} sJobTitle - Job title
   * @param {String} sJobDescription - Job short description
   * @param {URL} sJobIconLink - Job icon image link
   * @param {URL} sJobRedirectLink - Redirect link when clicking on the job item
   * @returns DOM
   */
  function _createJobItem(sJobTitle, sJobDescription, sJobIconLink, sJobRedirectLink) {
    const oJobItem = `<a href="${sJobRedirectLink}">
        <div class="job-item">
          <img src="${sJobIconLink}" class="job-item__icon"/>
          <h3 class="job-item__title">${sJobTitle}</h3>
          <img class="job-item__expand-icon"/>
          <p class="job-item__description job-item__description--pc">${sJobDescription}</p>
        </div>
        <div class="job-item__description-container job-item__description--mobile">
          <p class="job-item__description">${sJobDescription}</p>
          <p class="job-item__link">Read More</p>
        </div>
      </a>`;

    oJobCategoriesList.append(oJobItem);
  }

  function toggleActiveJobCategory(eEvent) {
    eEvent.preventDefault();
    const oTarget = u(eEvent.target);
    const sCurrentState = (oTarget.hasClass('active')) ? 'open' : 'close';
    u('.job-item').removeClass('active');
    if (sCurrentState === 'open') oTarget.removeClass('active');
    else oTarget.addClass('active');
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

  async function loadJobCategories(iStart, iCount) {
    const oResponse = await fetch(`${DOMAIN}${API_ROUTE}/job-categories?start=${iStart}&count=${iCount}`);
    return oResponse.json();
  }

  async function initJobCategories() {
    const aJobCategories = (sDevice === 'pc') ? await loadJobCategories(0, 9) : await loadJobCategories(0, 3);
    const iLength = aJobCategories.length;
    for (let iCnt = 0; iCnt < iLength; iCnt += 1) {
      _createJobItem(aJobCategories[iCnt].jobTitle, aJobCategories[iCnt].jobDescription, aJobCategories[iCnt].jobIcon, aJobCategories[iCnt].link);
    }
  }

  async function loadMoreJobs() {
    const aJobCategories = await loadJobCategories(iLoadedJobs, 3);
    const iLength = aJobCategories.length;
    iLoadedJobs += 3;
    if (iLoadedJobs >= iTotalAvailableJobs) oLoadMoreJobsBtn.nodes[0].style.display = 'none';
    for (let iCnt = 0; iCnt < iLength; iCnt += 1) {
      _createJobItem(aJobCategories[iCnt].jobTitle, aJobCategories[iCnt].jobDescription, aJobCategories[iCnt].jobIcon, aJobCategories[iCnt].link);
    }
  }

  function initEventListeners() {
    oDocument.on('scroll', toggleNavbarState);
    oNavButtons.on('click', function(eEvent) { scrollToSection(eEvent); });
    oFooterLinks.on('click', function(eEvent) { scrollToSection(eEvent); });
    oNavbarMenuBtn.on('click', function() { oNavbar.toggleClass('active'); oBody.toggleClass('no-scroll'); });
    oHeroSwiper.on('touchMove', function() { oHeroSwiper.autoplay.stop(); });
    oHeroSwiper.on('touchEnd', function() { oHeroSwiper.autoplay.start(); });
    if (sDevice === 'mobile') {
      if (oWhySwiper !== undefined) {
        oWhySwiper.on('touchMove', function() { oHeroSwiper.autoplay.stop(); });
        oWhySwiper.on('touchEnd', function() { oHeroSwiper.autoplay.start(); });
      }
      oJobCategoriesList.on('click', function(eEvent) {
        if (u(eEvent.target).hasClass('job-item')) toggleActiveJobCategory(eEvent);
      });
    }
    oLoadMoreJobsBtn.on('click', loadMoreJobs);
    oNavButtonsMobile.on('click', function(eEvent) {
      eEvent.preventDefault();
      oNavbar.removeClass('active');
      oBody.removeClass('no-scroll');
      setTimeout(function() {
        scrollToSection(eEvent);
      }, 300);
    });
  }

  async function init() {
    toggleNavbarState();
    await initJobCategories();
    initEventListeners();
    _cleanUp();
  }

  init();
});
