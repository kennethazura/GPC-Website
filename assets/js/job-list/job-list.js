document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oJobContainer = u('.job-list-container');
  const oBrandContainer = u('.brand-list-container');
  const oTotalJobs = u('.total-jobs');
  const oCurrentPage = u('.page-number');
  const oPageTotal = u('.total-pages');
  const oAllJobsFilter = u('.all-jobs-filter');
  const oAllCompaniesFilter = u('.all-companies-filter');
  const oSearchInputKeyword = u('#search__keyword');
  const oSearchInputLocation = u('#search__location');
  const oSearchInputSpecialization = u('#search__specialization');
  const oSearchBtn = u('.search-btn');
  const oDocument = u(document);

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

  function _populatejobs(jobs) {
    oTotalJobs.text(jobs.length);
    oPageTotal.text(Math.ceil(jobs.length / 6));
    for (let ctr = 0; ctr < 6; ctr += 1) {
      if (jobs[ctr] === undefined) break;
      const salary = `$${jobs[ctr].Budget__c}`;
      const oJob = `<div class="job-item">
      <div class="job-header">
          <div class="job-details">
              <a href="/job/${jobs[ctr].Id}" target="_blank" class="job-title">${jobs[ctr].Category__c || 'Job Title'}</a>
              <h3 class="company-name">${jobs[ctr].Account__r.Name || 'Company Name'}</h3>
              <h3 class="company-location">Available Positions: ${jobs[ctr].Slots__c || '--'}</h3>
              <h3 class="salary-range">${salary || '--'}</h3>
          </div>
          <img class="company-logo">
      </div>
      <div class="job-description">
      ${jobs[ctr].Description__c || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
      </div>
      <a href="/job/${jobs[ctr].Id}" target="_blank"><button class="job-apply-btn">Apply</button></a>
  </div>`;
      oJobContainer.append(oJob);
    }
  }

  function _load() {
    const userId = _getCookie('userId');
    const salesForceId = _getCookie('salesForceId');
    const accessToken = _getCookie('accessToken');
    const urlParams = new URLSearchParams(window.location.search);
    const isUserCreated = urlParams.get('myJobs');
    const queryKeyword = urlParams.get('keyword');
    const queryLocation = urlParams.get('location');
    const querySpecialization = urlParams.get('specialization');
    oSearchInputKeyword.nodes[0].value = queryKeyword;
    oSearchInputLocation.nodes[0].value = queryLocation;
    oSearchInputSpecialization.nodes[0].value = queryLocation;

    fetch(
      `${DOMAIN}${API_ROUTE}/job-list/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, salesForceId, accessToken, isUserCreated, queryKeyword, queryLocation, querySpecialization,
        }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          _populatejobs(data.body.jobs);
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function search() {
    const sKeyword = oSearchInputKeyword.nodes[0].value;
    const sLocation = oSearchInputLocation.nodes[0].value;
    const sSpecialization = oSearchInputSpecialization.nodes[0].value;
    let searchQuery = '/job-list?';
    if (sKeyword !== '') searchQuery += `keyword=${sKeyword}&`;
    if (sLocation !== '') searchQuery += `location=${sLocation}&`;
    if (sSpecialization !== '') searchQuery += `specialization=${sSpecialization}`;
    window.location.replace(searchQuery);
  }

  function _initEventListeners() {
    oDocument.on('click', '.send-offer-btn', function(eEvent) {
      alert('Your request has been sent through');
    });
    oAllJobsFilter.on('click', function() {
      oAllJobsFilter.addClass('active');
      oJobContainer.addClass('active');
      oBrandContainer.removeClass('active');
      oAllCompaniesFilter.removeClass('active');
    });
    oAllCompaniesFilter.on('click', function() {
      oAllCompaniesFilter.addClass('active');
      oBrandContainer.addClass('active');
      oJobContainer.removeClass('active');
      oAllJobsFilter.removeClass('active');
    });
    oSearchBtn.on('click', search);
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _load();
    _initEventListeners();
  }

  init();
});
