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
      const oJob = `<div class="job-item">
      <div class="job-header">
          <div class="job-details">
              <h2 class="job-title">${jobs[ctr].Name || 'Job Title'}</h1>
              <h3 class="company-name">${jobs[ctr].CompanyName || 'Company Name'}</h2>
              <h3 class="company-location">${jobs[ctr].CompanyLocation || 'Company Location'}</h3>
              <h3 class="salary-range">${jobs[ctr].SalaryRange || 'Salary Range'}</h3>
          </div>
          <img class="company-logo">
      </div>
      <div class="job-description">
      ${jobs[ctr].JobDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
      </div>
      <button class="job-apply-btn">Apply</button>
  </div>`;
      oJobContainer.append(oJob);
    }
  }

  function _load() {
    const userId = _getCookie('userId');
    const salesForceId = _getCookie('salesForceId');
    const accessToken = _getCookie('accessToken');
    fetch(
      `${DOMAIN}${API_ROUTE}/job-list/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, salesForceId, accessToken }),
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
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _load();
    _initEventListeners();
  }

  init();
});
