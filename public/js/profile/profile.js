document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oCandidateSteps = u('.candidate__step');
  const oProgressBar = u('.progress__bar');
  const oProgressBarValue = u('.progress__bar-value');
  const oCandidateStepsContents = u('.candidate__step-contents');
  const oCandidateStepsContent = u('.candidate__step-contents > div');
  const oFinishButton = u('.finish__btn');
  const oFinishField = u('.finish__field');
  const oHomeButton = u('.home-btn');
  const PROGRESS_BAR_VALUES = ['0%', '25%', '50%', '75%', '100%'];

  /** Candidate - Form Fields */
  const oFirstName = u('.information__first-name');
  const oLastName = u('.information__last-name');
  const oBirthDate = u('.information__birthdate');
  const oEmail = u('.information__email');
  const oAddress = u('.information__address');

  const oJobtitle = u('.current__title');
  const oCompany = u('.current__company');
  const oStartDate = u('.start__date');
  const oEndDate = u('.end__date');
  const oWorkExperience = u('.work__exp');

  const oRecoveryEmail = u('.acc__email');
  const oRecoveryPhone = u('.acc__number');

  /** Company - Form Fields */
  const oCompanyFirstName = u('.company__user-first-name');
  const oCompanyLastName = u('.company__user-last-name');
  const oCompanyName = u('.company__name');
  const oCompanyIndustry = u('.industry__title');
  const oCompanyAddress = u('.company__address');
  const oCompanyPhone = u('.company__phone');
  const oCompanyWebsite = u('.company__website');

  let PROFILE_TYPE;
  let isFinished = false;

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

  function goToStep(targetStep) {
    console.log(targetStep);
    oCandidateStepsContents.removeClass('step-1');
    oCandidateStepsContents.removeClass('step-2');
    oCandidateStepsContents.removeClass('step-3');
    oCandidateStepsContents.removeClass('step-4');
    oCandidateStepsContents.addClass(`step-${targetStep}`);

    oProgressBar.removeClass('step-1');
    oProgressBar.removeClass('step-2');
    oProgressBar.removeClass('step-3');
    oProgressBar.removeClass('step-4');
    oProgressBar.addClass(`step-${targetStep}`);

    oCandidateStepsContent.removeClass('active');
    oCandidateStepsContent.nodes[targetStep - 1].classList.add('active');

    oProgressBarValue.text(PROGRESS_BAR_VALUES[targetStep - 1]);

    for (let ctr = 0; ctr < targetStep - 1; ctr += 1) {
      oCandidateSteps.nodes[ctr].classList.add('complete');
    }
    for (let ctr = targetStep - 1; ctr < oCandidateSteps.length; ctr += 1) {
      oCandidateSteps.nodes[ctr].classList.remove('complete');
    }
  }

  function saveAPI() {
    const userId = _getCookie('userId');
    const profileBody = (PROFILE_TYPE === 'candidate') ? {
      userId,
      firstName: oFirstName.nodes[0].value,
      lastName: oLastName.nodes[0].value,
      dateOfBirth: oBirthDate.nodes[0].value,
      email: oEmail.nodes[0].value,
      address: oAddress.nodes[0].value,
      professionalInformation: JSON.stringify([{
        jobtTitle: oJobtitle.nodes[0].value,
        company: oCompany.nodes[0].value,
        startDate: oStartDate.nodes[0].value,
        endDate: oEndDate.nodes[0].value,
        experience: oWorkExperience.nodes[0].value,
      }]),
      recoveryEmail: oRecoveryEmail.nodes[0].value,
      recoveryPhone: oRecoveryPhone.nodes[0].value,
    } : {
      userId,
      firstName: oCompanyFirstName.nodes[0].value,
      lastName: oCompanyLastName.nodes[0].value,
      companyName: oCompanyName.nodes[0].value,
      industry: oCompanyIndustry.nodes[0].value,
      companyAddress: oCompanyAddress.nodes[0].value,
      companyPhone: oCompanyPhone.nodes[0].value,
      website: oCompanyWebsite.nodes[0].value,
    };

    fetch(
      `${DOMAIN}${API_ROUTE}/${PROFILE_TYPE}/save`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileBody),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success) {
          alert('Your changes have been saved');
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function saveProfile() {
    isFinished = true;
    saveAPI();
    if (PROFILE_TYPE === 'candidate') {
      oCandidateStepsContents.removeClass('step-1');
      oCandidateStepsContents.removeClass('step-2');
      oCandidateStepsContents.removeClass('step-3');
      oCandidateStepsContents.removeClass('step-4');
      oCandidateStepsContents.addClass('step-5');

      oProgressBar.removeClass('step-1');
      oProgressBar.removeClass('step-2');
      oProgressBar.removeClass('step-3');
      oProgressBar.removeClass('step-4');
      oProgressBar.addClass('step-5');

      oCandidateStepsContent.removeClass('active');
      oCandidateStepsContent.nodes[4].classList.add('active');

      oProgressBarValue.text(PROGRESS_BAR_VALUES[4]);

      for (let ctr = 0; ctr < oCandidateSteps.length; ctr += 1) {
        oCandidateSteps.nodes[ctr].classList.add('complete');
      }

      oFinishField.remove();
      oFinishButton.remove();
    } else if (PROFILE_TYPE === 'company') {
      alert('Error');
    }
  }

  function setProfileValues(profile, profileType) {
    if (profileType === 'candidate') {
      oFirstName.attr('value', profile.firstName || '');
      oLastName.attr('value', profile.lastName || '');
      oBirthDate.attr('value', profile.dateOfBirth || '');
      oEmail.attr('value', profile.email);
      oAddress.attr('value', profile.address || '');

      if (profile.professionalInformation) {
        profile.professionalInformation = JSON.parse(profile.professionalInformation);
        oJobtitle.attr('value', profile.professionalInformation[0].jobtTitle);
        oCompany.attr('value', profile.professionalInformation[0].company);
        oStartDate.attr('value', profile.professionalInformation[0].startDate);
        oEndDate.attr('value', profile.professionalInformation[0].endDate);
        oWorkExperience.attr('value', profile.professionalInformation[0].experience);
      }

      oRecoveryEmail.attr('value', profile.recoveryEmail || '');
      oRecoveryPhone.attr('value', profile.recoveryPhone || '');
    } else {
      oCompanyFirstName.attr('value', profile.firstName || '');
      oCompanyLastName.attr('value', profile.lastName || '');
      oCompanyName.attr('value', profile.companyName || '');
      oCompanyIndustry.attr('value', profile.industry || '');
      oCompanyAddress.attr('value', profile.companyAddress || '');
      oCompanyPhone.attr('value', profile.companyPhone || '');
      oCompanyWebsite.attr('value', profile.website || '');
    }
  }

  function loadProfile(profileType) {
    const userId = _getCookie('userId');
    const email = _getCookie('userEmail');

    fetch(
      `${DOMAIN}${API_ROUTE}/${profileType}/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success) {
          setProfileValues(data.body.profile, profileType);
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function initEventListeners() {
    oCandidateSteps.on('click', (eEvent) => {
      if (isFinished) return;
      let targetElement;
      if (eEvent.target.nodeName === 'SPAN') {
        targetElement = eEvent.target.parentElement;
      } else {
        targetElement = eEvent.target;
      }
      const targetStep = targetElement.classList[1].substr(targetElement.classList[1].length - 1);

      goToStep(targetStep);
    });
    oFinishButton.on('click', saveProfile);
    oHomeButton.on('click', function() { window.location.replace('/'); });
  }

  function init() {
    PROFILE_TYPE = (window.location.pathname === '/candidate-profile') ? 'candidate' : 'company';
    loadProfile(PROFILE_TYPE);
    oNavbar.addClass('navbar--white');
    initEventListeners();
  }

  init();
});
