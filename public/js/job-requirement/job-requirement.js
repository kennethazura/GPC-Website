document.addEventListener('DOMContentLoaded', function() {
  const oNavbar = u('.navbar');
  const oJobSummary = u('.form__job-summary');
  const oJobSummaryCounter = u('.job-summary-counter__current');
  const oJobDescriptionInput = u('.form__job-description');
  const oJobDescriptionList = u('.job-description__list');
  const oAddJobDescriptionBtn = u('.job-description__add-btn');
  const oQualificationsInput = u('.form__job-qualifications');
  const oQualificationsList = u('.job-qualifications__list');
  const oAddQualificationsBtn = u('.job-qualifications__add-btn');

  function updateJobSummaryCounter() {
    if (oJobSummary.nodes[0].value.length > 600) {
      oJobSummary.nodes[0].value = oJobSummary.nodes[0].value.slice(0, 600);
    }
    oJobSummaryCounter.text(oJobSummary.nodes[0].value.length);
  }

  function addJobDescriptionBullet() {
    const sJobDescription = oJobDescriptionInput.nodes[0].value;
    if (sJobDescription === '') return;
    const oBullet = `<div class="job-description__bullet">
        <span>${sJobDescription}</span>
        <svg class="job-description__minus-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
        </svg>
      </div>`;
    oJobDescriptionList.append(oBullet);
    oJobDescriptionInput.nodes[0].value = '';
  }

  function addQualificationsBullet() {
    const sQualification = oQualificationsInput.nodes[0].value;
    if (sQualification === '') return;
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
      oTarget.parentElement.remove();
    }
  }

  function _initEventListeners() {
    oJobSummary.on('keyup', updateJobSummaryCounter);
    oAddJobDescriptionBtn.on('click', addJobDescriptionBullet);
    oAddQualificationsBtn.on('click', addQualificationsBullet);
    document.addEventListener('click', removeBulletPoint);
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _initEventListeners();
  }

  init();
});
