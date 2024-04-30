document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oJobContainer = u('.job-list-container');
  const oBrandContainer = u('.brand-list-container');
  const oTotalJobs = u('.total-jobs');
  const oCurrentPage = u('.page-number');
  const oPreviousPage = u('.pagination-prev');
  const oNextPage = u('.pagination-next');
  const oPaginationPages = u('.pagination-pages');
  const oPageTotal = u('.total-pages');
  const oAllJobsFilter = u('.all-jobs-filter');
  const oAllCompaniesFilter = u('.all-companies-filter');
  const oSearchInputKeyword = u('#search__keyword');
  const oSearchInputLocation = u('#search__location');
  const oSearchInputSpecialization = u('#search__specialization');
  const oSearchBtn = u('.search-btn');
  const oDocument = u(document);
  let JOB_LIST = [];
  let currentIndex = 0;
  let currentPage = 1;

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

  function _setPagination(jobs) {
    oPaginationPages.html('');
    oTotalJobs.text(jobs.length);
    const totalPages = Math.ceil(jobs.length / 6);
    oCurrentPage.text(currentPage);
    oPageTotal.text(totalPages);
    let pageNumber = 1;
    for (let ctr = 1; ctr < jobs.length; ctr += 6) {
      if (pageNumber === currentPage) oPaginationPages.append(`<span class="pagination-option active">${pageNumber}</span>`);
      else oPaginationPages.append(`<span class="pagination-option">${pageNumber}</span>`);
      pageNumber += 1;
    }
  }

  function _populatejobs(jobs, startIndex) {
    oJobContainer.html('');
    for (let ctr = startIndex; ctr < startIndex + 6; ctr += 1) {
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

  function toggleNavButtons() {
    const totalPages = Math.ceil(JOB_LIST.length / 6);
    oPreviousPage.removeClass('disabled');
    oNextPage.removeClass('disabled');
    if (currentPage === 1) {
      oPreviousPage.addClass('disabled');
    }
    if (currentPage === totalPages) {
      oNextPage.addClass('disabled');
    }
  }

  function changePage(direction, pageNumber = null) {
    if (pageNumber) {
      currentIndex = (pageNumber === 1) ? 0 : 6 * (pageNumber - 1);
      currentPage = pageNumber;
    } else if (direction === 'next') {
      currentIndex += 6;
      currentPage += 1;
    } else if (direction === 'prev') {
      currentIndex -= 6;
      currentPage -= 1;
    }
    _populatejobs(JOB_LIST, currentIndex);
    _setPagination(JOB_LIST);
    toggleNavButtons();
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

    showLoading();
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
        hideLoading();
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          JOB_LIST = data.body.jobs;
          _populatejobs(data.body.jobs, 0);
          _setPagination(data.body.jobs);
          toggleNavButtons();
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
    oDocument.on('click', '.pagination-option', function(eEvent) {
      changePage('click', parseInt(eEvent.target.innerHTML, 10));
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
    oPreviousPage.on('click', (eEvent) => {
      if (eEvent.target.parentNode.classList.contains('disabled') || eEvent.target.classList.contains('disabled')) return;
      changePage('prev');
    });
    oNextPage.on('click', (eEvent) => {
      if (eEvent.target.parentNode.classList.contains('disabled') || eEvent.target.classList.contains('disabled')) return;
      changePage('next');
    });
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _load();
    _initEventListeners();
  }

  init();
});
