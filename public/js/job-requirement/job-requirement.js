document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oJobSummaryCounter = u('.job-summary-counter__current');
  const oJobDescriptionInput = u('.form__job-description');
  const oJobDescriptionList = u('.job-description__list');
  const oAddJobDescriptionBtn = u('.job-description__add-btn');
  const oQualificationsInput = u('.form__job-qualifications');
  const oQualificationsList = u('.job-qualifications__list');
  const oAddQualificationsBtn = u('.job-qualifications__add-btn');
  const oSaveBtn = u('.form__submit-btn');
  const aJobDescriptions = [];
  const aQualifications = [];

  /** Job Requirements - Form Fields */

  const oPositionName = u('.form__position-name');
  const oJobSummary = u('.form__job-summary');
  const oWorkingHours = u('.working-hours-dropdown');
  const oStartDate = u('.working-hours__date-picker');

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

  function updateJobSummaryCounter() {
    if (oJobSummary.nodes[0].value.length > 600) {
      oJobSummary.nodes[0].value = oJobSummary.nodes[0].value.slice(0, 600);
    }
    oJobSummaryCounter.text(oJobSummary.nodes[0].value.length);
  }

  function addJobDescriptionBullet(description = '') {
    const sJobDescription = (description !== '') ? description : oJobDescriptionInput.nodes[0].value;
    if (sJobDescription === '') return;
    aJobDescriptions.push(sJobDescription);
    const oBullet = `<div class="job-description__bullet">
        <span>${sJobDescription}</span>
        <svg class="job-description__minus-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
        </svg>
      </div>`;
    oJobDescriptionList.append(oBullet);
    oJobDescriptionInput.nodes[0].value = '';
  }

  function addQualificationsBullet(qualification) {
    const sQualification = (qualification !== '') ? qualification : oQualificationsInput.nodes[0].value;
    if (sQualification === '') return;
    aQualifications.push(sQualification);
    const oBullet = `<div class="job-qualifications__bullet">
        <span>${sQualification}</span>
        <svg class="job-qualifications__minus-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
        </svg>
      </div> `;
    oQualificationsList.append(oBullet);
    oQualificationsInput.nodes[0].value = '';
  }

  function removeBulletPoint(eEvent) {
    const oTarget = eEvent.target;
    if (oTarget.classList.contains('job-description__minus-btn') || oTarget.classList.contains('job-qualifications__minus-btn')) {
      const value = oTarget.parentElement.querySelector('span').innerText;
      let arrayIndex = -1;

      if (oTarget.classList.contains('job-description__minus-btn')) {
        arrayIndex = aJobDescriptions.indexOf(value);
        aJobDescriptions.splice(arrayIndex, 1);
      } else if (oTarget.classList.contains('job-qualifications__minus-btn')) {
        arrayIndex = aQualifications.indexOf(value);
        aQualifications.splice(aJobDescriptions, 1);
      }

      oTarget.parentElement.remove();
    }
  }

  function setJobDetails(jobDetails) {
    oPositionName.attr('value', jobDetails.positionName || '');
    oJobSummary.text(jobDetails.jobSummary || '');
    oWorkingHours.nodes[0].value = jobDetails.workingHours || '';
    oStartDate.text(jobDetails.startDate || '');

    const oJobDescription = jobDetails.jobDescription.split(',');
    const oJobQualifications = jobDetails.qualifications.split(',');
    for (let ctr = 0; ctr < oJobDescription.length; ctr += 1) {
      addJobDescriptionBullet(oJobDescription[ctr]);
    }
    for (let ctr = 0; ctr < oJobQualifications.length; ctr += 1) {
      addQualificationsBullet(oJobQualifications[ctr]);
    }
  }

  function _saveProfile() {
    const userId = _getCookie('userId');
    const jobRequirementBody = {
      userId,
      positionName: oPositionName.nodes[0].value,
      jobSummary: oJobSummary.nodes[0].value,
      workingHours: oWorkingHours.nodes[0].value,
      startDate: oStartDate.nodes[0].value,
      jobDescription: aJobDescriptions.toString(),
      qualifications: aQualifications.toString(),
    };

    fetch(
      `${DOMAIN}${API_ROUTE}/job-requirement/save`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobRequirementBody),
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

  function _load() {
    const userId = _getCookie('userId');

    fetch(
      `${DOMAIN}${API_ROUTE}/job-requirement/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          if (data.body) setJobDetails(data.body.jobDetails);
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
          window.location.replace('/company-profile');
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function _initEventListeners() {
    oJobSummary.on('keyup', updateJobSummaryCounter);
    oAddJobDescriptionBtn.on('click', () => { addJobDescriptionBullet(''); });
    oAddQualificationsBtn.on('click', () => { addQualificationsBullet(''); });
    oSaveBtn.on('click', _saveProfile);
    document.addEventListener('click', removeBulletPoint);
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _load();
    _initEventListeners();
  }

  init();
});
