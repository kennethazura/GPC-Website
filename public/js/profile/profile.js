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
  let WORK_HISTORY_ID;

  /** Candidate - Form Fields */
  const oFirstName = u('.information__first-name');
  const oLastName = u('.information__last-name');
  const oBirthDate = u('.information__birthdate');
  const oEmail = u('.information__email');
  const oAddressCity = u('.information__address.city');
  const oAddressCountry = u('.information__address.country');
  const oAddressPostalCode = u('.information__address.postal-code');
  const oAddressState = u('.information__address.state');
  const oAddressStreet = u('.information__address.street');

  const oJobtitle = u('.current__title');
  const oCompany = u('.current__company');
  const oStartDate = u('.start__date');
  const oEndDate = u('.end__date');
  const oWorkExperience = u('.work__exp');

  const oRecoveryEmail = u('.acc__email');
  const oRecoveryPhone = u('.acc__number');

  /** Company - Form Fields */
  const oCompanyForm = u('.companyinfo__field');
  const oCompanyFinishField = u('.company__finish-field');
  const oCompanyFinishBtn = u('.finish-btn__container');
  const oCompanyCompleteImg = u('.finish-img__field.company');
  const oCompanyName = u('.company__name');
  const oCompanyIndustry = u('.industry__title');
  const oCompanyAddress = u('.company__address');
  const oCompanyPhone = u('.company__phone');
  const oCompanyWebsite = u('.company__website');
  const oCompanyAddressCity = u('.company__address.city');
  const oCompanyAddressCountry = u('.company__address.country');
  const oCompanyAddressPostalCode = u('.company__address.postal-code');
  const oCompanyAddressState = u('.company__address.state');
  const oCompanyAddressStreet = u('.company__address.street');
  const oCompanyDescription = u('.company__description');

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

  function _removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, v === Object(v) ? _removeEmpty(v) : v]),
    );
  }

  function saveWorkHistoryAPI() {
    const salesForceId = _getCookie('salesForceId');
    const accessToken = _getCookie('accessToken');

    const workHistory = {
      accessToken,
      workHistoryId: WORK_HISTORY_ID,
      Contact__c: salesForceId,
      Company__c: oCompany.nodes[0].value,
      Job_Title__c: oJobtitle.nodes[0].value,
      Start_Date__c: oStartDate.nodes[0].value,
      End_Date__c: oEndDate.nodes[0].value,
      Description__c: oWorkExperience.nodes[0].value,
    };

    fetch(
      `${DOMAIN}${API_ROUTE}/${PROFILE_TYPE}/save-work-history`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workHistory),
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

  function saveAPI() {
    const salesForceId = _getCookie('salesForceId');
    const accessToken = _getCookie('accessToken');

    const profileBody = (PROFILE_TYPE === 'candidate') ? {
      salesForceId,
      accessToken,
      FirstName: oFirstName.nodes[0].value,
      LastName: oLastName.nodes[0].value,
      Birthdate: oBirthDate.nodes[0].value,
      Email: oEmail.nodes[0].value,
      MailingStreet: oAddressStreet.nodes[0].value,
      MailingCity: oAddressCity.nodes[0].value,
      MailingState: oAddressState.nodes[0].value,
      MailingPostalCode: oAddressPostalCode.nodes[0].value,
      MailingCountry: oAddressCountry.nodes[0].value,
      Personal_Email__c: oRecoveryEmail.nodes[0].value,
      HomePhone: oRecoveryPhone.nodes[0].value,
    } : {
      salesForceId,
      accessToken,
      Name: oCompanyName.nodes[0].value,
      Industry: oCompanyIndustry.nodes[0].value,
      Phone: oCompanyPhone.nodes[0].value,
      Website: oCompanyWebsite.nodes[0].value,
      BillingStreet: oCompanyAddressStreet.nodes[0].value,
      BillingCity: oCompanyAddressCity.nodes[0].value,
      BillingState: oCompanyAddressState.nodes[0].value,
      BillingPostalCode: oCompanyAddressPostalCode.nodes[0].value,
      BillingCountry: oCompanyAddressCountry.nodes[0].value,
      Company_Description__c: oCompanyDescription.nodes[0].value,
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
          if (PROFILE_TYPE === 'candidate') {
            saveWorkHistoryAPI();
          } else {
            oCompanyCompleteImg.addClass('finished');
            oCompanyForm.addClass('finished');
            oCompanyFinishField.addClass('finished');
            oCompanyFinishBtn.addClass('finished');
            window.scrollTo(0, 0);
            alert('Your changes have been saved');
          }
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
      // alert('Error');
    }
  }

  function setProfileValues(profile, profileType) {
    if (profileType === 'candidate') {
      oFirstName.attr('value', profile.FirstName || '');
      oLastName.attr('value', profile.LastName || '');
      oBirthDate.attr('value', profile.Birthdate || '');
      oEmail.attr('value', profile.Email);
      oAddressCity.attr('value', profile.MailingAddress.city || '');
      oAddressCountry.attr('value', profile.MailingAddress.country || '');
      oAddressPostalCode.attr('value', profile.MailingAddress.postalCode || '');
      oAddressState.attr('value', profile.MailingAddress.state || '');
      oAddressStreet.attr('value', profile.MailingAddress.street || '');

      oRecoveryEmail.attr('value', profile.Personal_Email__c || '');
      oRecoveryPhone.attr('value', profile.HomePhone || '');
    } else {
      oCompanyName.attr('value', profile.Name || '');
      oCompanyIndustry.attr('value', profile.Industry || '');
      oCompanyAddress.attr('value', profile.companyAddress || '');
      oCompanyPhone.attr('value', profile.Phone || '');
      oCompanyWebsite.attr('value', profile.Website || '');
      oCompanyAddressCity.attr('value', profile.BillingAddress.city || '');
      oCompanyAddressCountry.attr('value', profile.BillingAddress.country || '');
      oCompanyAddressPostalCode.attr('value', profile.BillingAddress.postalCode || '');
      oCompanyAddressState.attr('value', profile.BillingAddress.state || '');
      oCompanyAddressStreet.attr('value', profile.BillingAddress.street || '');
      oCompanyDescription.text(profile.Company_Description__c);
    }
  }

  function setProfileWorkHistory(workHistory) {
    if (workHistory.length > 0) {
      oJobtitle.attr('value', workHistory[0].Job_Title__c);
      oCompany.attr('value', workHistory[0].Company__c);
      oStartDate.attr('value', workHistory[0].Start_Date__c);
      oEndDate.attr('value', workHistory[0].End_Date__c);
      oWorkExperience.text(workHistory[0].Description__c);
    }
  }

  function loadProfile(profileType) {
    const userId = _getCookie('userId');
    const accessToken = _getCookie('accessToken');
    const salesForceId = _getCookie('salesForceId');

    fetch(
      `${DOMAIN}${API_ROUTE}/${profileType}/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, accessToken, salesForceId }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          setProfileValues(data.body.profile, profileType);
        } else if (data.body.errMessage) {
          alert('Error: ' + data.body.errCode);
          console.warn(data.body.errMessage);
          console.warn(data.body.consoleMessage);
        } else {
          console.warn('Unfortunately, an error occurred in the server');
        }
      });

    if (profileType === 'candidate') {
      fetch(
        `${DOMAIN}${API_ROUTE}/candidate-work-history/load`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, accessToken, salesForceId }),
        },
      ).then((oResponse) => oResponse.json())
        .then((data) => {
          if (data.success === 401) {
            window.location.replace('/');
          } else if (data.success) {
            if (data.body.candidateworkHistory.length > 0) {
              WORK_HISTORY_ID = data.body.candidateworkHistory[0].Id;
            }
            setProfileWorkHistory(data.body.candidateworkHistory);
          } else if (data.body.errMessage) {
            alert('Error: ' + data.body.errCode);
            console.warn(data.body.errMessage);
            console.warn(data.body.consoleMessage);
          } else {
            console.warn('Unfortunately, an error occurred in the server');
          }
        });
    }
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
