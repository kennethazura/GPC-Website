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
  const oAddWorkButton = u('.add__btn');
  const PROGRESS_BAR_VALUES = ['0%', '25%', '50%', '75%', '100%'];
  let workHistory = [];
  const workHistoryToDelete = [];
  let isNewAccount = false;

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

  const oTermsCheckbox = u('.check__terms');
  const oPrivacyCheckbox = u('.check__privacy');

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

  function _deleteCookie(cname, path, domain) {
    if (_getCookie(cname)) {
      document.cookie = cname + '='
        + ((path) ? ';path=' + path : '')
        + ((domain) ? ';domain=' + domain : '')
        + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  }

  function _setCookie(cname, cvalue, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
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
      if (ctr + 1 < oCandidateSteps.length) {
        oCandidateSteps.nodes[ctr + 1].classList.remove('active');
      }
    }
  }

  function _removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, v === Object(v) ? _removeEmpty(v) : v]),
    );
  }

  function saveWorkHistoryAPI(newSalesForceId) {
    const salesForceId = (newSalesForceId) || _getCookie('salesForceId');
    const accessToken = _getCookie('accessToken');

    const workHistoryPayload = {
      accessToken,
      Contact__c: salesForceId,
      workHistory,
      workHistoryToDelete,
    };

    fetch(
      `${DOMAIN}${API_ROUTE}/${PROFILE_TYPE}/save-work-history`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workHistoryPayload),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success) {
          if (isNewAccount) {
            window.location.replace('/search');
          }
          alert('Your changes have been saved');
          window.location.reload();
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
    const userId = _getCookie('userId');
    const email = _getCookie('registrationEmail');
    const password = _getCookie('registrationPassword');

    const profileBody = (PROFILE_TYPE === 'candidate') ? {
      salesForceId,
      accessToken,
      isNewAccount,
      FirstName: oFirstName.nodes[0].value,
      LastName: oLastName.nodes[0].value,
      Birthdate: oBirthDate.nodes[0].value,
      Email: oEmail.nodes[0].value,
      MailingStreet: oAddressStreet.nodes[0].value,
      MailingCity: oAddressCity.nodes[0].value,
      MailingState: oAddressState.nodes[0].value,
      MailingPostalCode: oAddressPostalCode.nodes[0].value,
      MailingCountry: oAddressCountry.nodes[0].value,
      HomePhone: oRecoveryPhone.nodes[0].value,
    } : {
      salesForceId,
      accessToken,
      isNewAccount,
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
      Email: (isNewAccount) ? _getCookie('registrationEmail') : null,
    };

    showLoading();
    if (isNewAccount) {
      fetch(
        `${DOMAIN}${API_ROUTE}/register-salesforce`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, email, accountType: PROFILE_TYPE, accessToken, password, profileBody,
          }),
        },
      ).then((oResponse) => oResponse.json())
        .then((registrationData) => {
          hideLoading();
          _deleteCookie('registrationEmail');
          _deleteCookie('registrationPassword');
          if (registrationData.success) {
            _setCookie('accountType', PROFILE_TYPE);
            _setCookie('userId', registrationData.body.userId);
            _setCookie('userEmail', registrationData.body.email);
            _setCookie('salesForceId', registrationData.body.salesForceId);
            if (PROFILE_TYPE === 'candidate') {
              saveWorkHistoryAPI(registrationData.body.salesForceId);
            } else {
              window.location.replace('/search');
            }
          } else if (registrationData.body.errMessage) {
            window.location.replace('/');
            alert('Error: ' + registrationData.body.errCode);
            console.warn(registrationData.body.errMessage);
            console.warn(registrationData.body.consoleMessage);
          } else {
            console.warn('Unfortunately, an error occurred in the server');
          }
        });
    } else {
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
          hideLoading();
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
              window.location.reload();
            }
          } else if (data.body.errMessage) {
            alert(data.body.errMessage);
          } else {
            alert('Unfortunately, an error occurred in the server');
          }
        });
    }
  }

  function hasNull(target) {
    // eslint-disable-next-line no-restricted-syntax
    for (const member in target) {
      if (!target[member]) return true;
    }

    return false;
  }

  function _validateCandidate() {
    let hasError = false;

    const profile = {
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
    };

    const workExperience = [];

    const workExperiences = u('.professional__form');

    for (let idx = 0; idx < workExperiences.nodes.length; idx += 1) {
      const formData = Object.fromEntries(new FormData(workExperiences.nodes[idx]));
      if (hasNull(formData)) {
        hasError = true;
        break;
      }
      workExperience.push({
        Id: workExperiences.nodes[idx].dataset.id,
        Company__c: formData['info-company'],
        Job_Title__c: formData['current-title'],
        Start_Date__c: formData['info-start-date'],
        End_Date__c: formData['info-end-date'],
        Description__c: formData['info-workexp'],
      });
    }

    workHistory = workExperience;

    return (hasError) || hasNull(profile);
  }

  function _validateCompany() {
    const company = {
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

    return hasNull(company);
  }

  function _validateFields(candidateType) {
    let hasError = false;

    if (candidateType === 'candidate') hasError = _validateCandidate();
    else hasError = _validateCompany();

    if (hasError) {
      alert('Please make sure all fields have been filled in correctly');
    } else if (!oPrivacyCheckbox.nodes[0].checked && !oTermsCheckbox.nodes[0].checked) {
      hasError = true;
      alert('Please make sure to read and accept our Terms & Conditions and Privacy Policy');
    }

    return hasError;
  }

  function saveProfile() {
    if (_validateFields(PROFILE_TYPE)) {
      return;
    }

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
      window.scrollTo(0, 0);
    } else if (PROFILE_TYPE === 'company') {
      // alert('Error');
    }
  }

  function setProfileValues(profile, profileType) {
    if (profileType === 'candidate') {
      oFirstName.attr('value', profile.FirstName || '');
      oLastName.attr('value', profile.LastName || '');
      oBirthDate.attr('value', profile.Birthdate || '');
      oEmail.attr('value', profile.Email || _getCookie('registrationEmail'));
      oAddressCity.attr('value', (profile.MailingAddress) ? profile.MailingAddress.city : '');
      oAddressCountry.attr('value', (profile.MailingAddress) ? profile.MailingAddress.country : '');
      oAddressPostalCode.attr('value', (profile.MailingAddress) ? profile.MailingAddress.postalCode : '');
      oAddressState.attr('value', (profile.MailingAddress) ? profile.MailingAddress.state : '');
      oAddressStreet.attr('value', (profile.MailingAddress) ? profile.MailingAddress.street : '');

      oRecoveryEmail.attr('value', profile.Email || _getCookie('registrationEmail'));
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

  function addWorkExperience(data) {
    const workFormsContainer = u('.form-container');
    const workForm = `<form class="professional__form" data-id="${data.Id || ''}">
    <div class="professional__form-header">
    <p>Additional Work History</p>
    <svg class="delete-work-history-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
    </div>
    <input class="current__title" type="text" name="current-title" placeholder="Job Title" value="${data.Job_Title__c || ''}"/>
    <!-- <select class="current__title" name="current-title">
        <option value="" disabled selected hidden>Current Job Title</option>
        <option value="title1">Job 1</option>
        <option value="title2">Job 2</option>
        <option value="title3">Job 3</option>
    </select> -->
<input class="current__company" type="text" name="info-company" placeholder="Company" value="${data.Company__c || ''}"/>
<input class="start__date" type="text" name="info-start-date" placeholder="Start Date" value="${data.Start_Date__c || ''}"/>
<input class="end__date" type="text" name="info-end-date" placeholder="End Date" value="${data.End_Date__c || ''}"/>
<textarea class="work__exp" name="info-workexp" placeholder="Add Work Experience" maxlength="10000">${data.Description__c || ''}</textarea>
</form>`;
    workFormsContainer.append(workForm);
  }

  function setProfileWorkHistory(loadedWorkHistory) {
    if (!loadedWorkHistory) {
      return;
    }
    if (loadedWorkHistory.length > 0) {
      u('.professional__form').attr('data-id', loadedWorkHistory[0].Id);
      oJobtitle.attr('value', loadedWorkHistory[0].Job_Title__c || '');
      oCompany.attr('value', loadedWorkHistory[0].Company__c || '');
      oStartDate.attr('value', loadedWorkHistory[0].Start_Date__c || '');
      oEndDate.attr('value', loadedWorkHistory[0].End_Date__c || '');
      oWorkExperience.text(loadedWorkHistory[0].Description__c || '');
    }
    if (loadedWorkHistory.length > 1) {
      for (let idx = 1; idx < loadedWorkHistory.length; idx += 1) {
        addWorkExperience(loadedWorkHistory[idx]);
      }
    }
  }

  function loadProfile(profileType) {
    const userId = _getCookie('userId');
    const accessToken = _getCookie('accessToken');
    const salesForceId = _getCookie('salesForceId');

    showLoading();
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
        hideLoading();
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          if (data.body.isNew) {
            isNewAccount = true;
            setProfileValues(data.body.profile, profileType);
          }
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
          hideLoading();
          if (data.success === 401) {
            window.location.replace('/');
          } else if (data.success) {
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

  function toggleFinishButton() {
    if (oPrivacyCheckbox.nodes[0].checked && oTermsCheckbox.nodes[0].checked) {
      oFinishButton.removeClass('disabled');
    } else {
      oFinishButton.addClass('disabled');
    }
  }

  function deleteWorkHistory(eEvent) {
    const oTarget = (eEvent.target.classList.contains('delete-work-history-btn')) ? eEvent.target : eEvent.target.parentElement;
    const targetWorkForm = oTarget.parentElement.parentElement;
    workHistoryToDelete.push(targetWorkForm.dataset.id);
    targetWorkForm.remove();
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
      targetElement.classList.add('active');

      goToStep(targetStep);
    });
    oAddWorkButton.on('click', addWorkExperience);
    oFinishButton.on('click', saveProfile);
    oHomeButton.on('click', function() { window.location.replace('/'); });
    u(document).on('click', (eEvent) => {
      const { target } = eEvent;
      if (target.classList.contains('check__terms') || target.classList.contains('check__privacy')) {
        toggleFinishButton();
      }

      if (target.classList.contains('delete-work-history-btn') || target.parentElement.classList.contains('delete-work-history-btn')) {
        deleteWorkHistory(eEvent);
      }

      if (target.classList.contains('start__date') || target.classList.contains('end__date')) {
        if (target.type === 'text') {
          target.type = 'date';
          target.showPicker();
        }
      }
    });
  }

  function init() {
    PROFILE_TYPE = (window.location.pathname === '/candidate-profile') ? 'candidate' : 'company';
    loadProfile(PROFILE_TYPE);
    oNavbar.addClass('navbar--white');
    initEventListeners();
  }

  init();
});
