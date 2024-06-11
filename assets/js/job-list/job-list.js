document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oBrandJobCounter = u('.brand-jobs-counter');
  const oJobContainer = u('.job-list-container');
  const oBrandContainer = u('.brand-list-container');
  const oBrandHeadercontainer = u('.brand-header-container');
  const oBrandHeaderName = u('.brand-header__name');
  const oBrandWebsite = u('.brand-details__value.website');
  const oBrandIndustry = u('.brand-details__value.industry');
  const oBrandLocation = u('.brand-details__value.location');
  const oBrandDescription = u('.brand-details__description');
  const oBrandHeaderAboutBtn = u('.brand-header__btn.about');
  const oBrandHeaderJobsBtn = u('.brand-header__btn.jobs');
  const oBrandDetailscontainer = u('.brand-details-container');
  const oSearchFiltercontainer = u('.search-filters');
  const oTotalJobs = u('.total-jobs');
  const oCurrentPage = u('.page-number');
  const oPaginationContainer = u('.job-list-pagination');
  const oPreviousPage = u('.pagination-prev');
  const oNextPage = u('.pagination-next');
  const oPaginationPages = u('.pagination-pages');
  const oPageTotal = u('.total-pages');
  const oAllJobsFilter = u('.all-jobs-filter');
  const oAllCompaniesFilter = u('.all-companies-filter');
  const oCurrentBrandFilter = u('.current-brand-filter');
  const oSearchInputKeyword = u('#search__keyword');
  const oSearchInputLocation = u('#search__location');
  const oSearchInputSpecialization = u('#search__specialization');
  const oSearchBtn = u('.search-btn');
  const oPageType = u('.page-type');
  const oDocument = u(document);
  let currentScreenView = 'jobs';
  let JOB_LIST = [];
  let BRAND_LIST = [];
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

  function _setPagination(list, pageType) {
    oPaginationPages.html('');
    oPageType.text(pageType);
    oTotalJobs.text(list.length);
    const totalPages = (pageType === 'jobs') ? Math.ceil(list.length / 6) : Math.ceil(list.length / 14);
    const pageLimit = (pageType === 'jobs') ? 6 : 14;
    oCurrentPage.text(currentPage);
    oPageTotal.text(totalPages);
    let pageNumber = 1;
    for (let ctr = 0; ctr < list.length; ctr += pageLimit) {
      if (pageNumber === currentPage) oPaginationPages.append(`<span class="pagination-option active">${pageNumber}</span>`);
      else oPaginationPages.append(`<span class="pagination-option">${pageNumber}</span>`);
      pageNumber += 1;
    }
  }

  function _populateBrands(brands, startIndex) {
    oBrandContainer.html('');
    for (let ctr = startIndex; ctr < startIndex + 14; ctr += 1) {
      if (brands[ctr] === undefined) break;
      const oBrand = `<div id="${brands[ctr].Id}" class="brand-item"><h1 class="brand-name">${brands[ctr].Name}</h1></div>`;
      oBrandContainer.append(oBrand);
    }
  }

  function _populatejobs(jobs, startIndex) {
    oJobContainer.html('');
    const currentCompany = _getCookie('salesForceId');
    let jobButton = '';
    for (let ctr = startIndex; ctr < startIndex + 6; ctr += 1) {
      if (jobs[ctr] === undefined) break;
      if (jobs[ctr].Account__c === currentCompany) {
        jobButton = `<a href="/job-requirement/${jobs[ctr].Id}" target="_blank"><button class="job-apply-btn">Edit</button></a> <a href="/candidate-list/${jobs[ctr].Id}" target="_blank"><button class="job-apply-btn">View Applicants</button></a>`;
      } else {
        jobButton = `<a href="/job/${jobs[ctr].Id}" target="_blank"><button class="job-apply-btn">Apply</button></a>`;
      }
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
      ${jobButton}
  </div>`;
      oJobContainer.append(oJob);
    }
  }

  function _loadCompanyDetails(company, totalJobs) {
    oAllJobsFilter.removeClass('active');
    oBrandHeaderName.text(company.Name);
    const sCompanyWebsite = (company.Website) ? company.Website : 'N/A';
    const sCompanyWebsiteHTML = (company.Website) ? `: <a href="${sCompanyWebsite}" target="_blank">${sCompanyWebsite}</a>` : `: <span>${sCompanyWebsite}</span>`;
    oBrandWebsite.html(sCompanyWebsiteHTML);
    const sCompanyIndustry = (company.Industry) ? company.Industry : 'N/A';
    oBrandIndustry.text(`: ${sCompanyIndustry}`);
    let companyAddress = ``;
    let companyAddressPosition = 0;
    const companyAddressList = [company.ShippingAddress.street, company.ShippingAddress.city, company.ShippingAddress.state, company.ShippingAddress.stateCode, company.ShippingAddress.postalCode, company.ShippingAddress.country];
    for (let idx = 0; idx < companyAddressList.length; idx += 1) {
      if (companyAddressList[idx]) {
        companyAddress += (companyAddressPosition === 0) ? `${companyAddressList[idx]}` : `, ${companyAddressList[idx]}`;
        companyAddressPosition += 1;
      }
    }
    oBrandLocation.text(`: ${companyAddress}`);
    const sCompanyDescription = (company.Company_Description__c) ? company.Company_Description__c : 'N/A';
    oBrandDescription.text(sCompanyDescription);
    oBrandJobCounter.html(`<b>${totalJobs}</b> jobs in ${company.Name}`);
    oCurrentBrandFilter.addClass('active');
    oCurrentBrandFilter.text(`${company.Name}`);
  }

  function toggleNavButtons() {
    const totalPages = (currentScreenView === 'jobs') ? Math.ceil(JOB_LIST.length / 6) : Math.ceil(BRAND_LIST.length / 14);
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
    const pageLimit = (currentScreenView === 'jobs') ? 6 : 14;
    if (pageNumber) {
      currentIndex = (pageNumber === 1) ? 0 : pageLimit * (pageNumber - 1);
      currentPage = pageNumber;
    } else if (direction === 'next') {
      currentIndex += pageLimit;
      currentPage += 1;
    } else if (direction === 'prev') {
      currentIndex -= pageLimit;
      currentPage -= 1;
    }
    if (currentScreenView === 'jobs') {
      _populatejobs(JOB_LIST, currentIndex);
      _setPagination(JOB_LIST, 'jobs');
    } else {
      _populateBrands(BRAND_LIST, currentIndex);
      _setPagination(BRAND_LIST, 'brands');
    }

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
    let companyId = '';

    if (isUserCreated) companyId = salesForceId;
    else if (urlParams.get('company')) companyId = urlParams.get('company');

    showLoading();
    fetch(
      `${DOMAIN}${API_ROUTE}/job-list/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, salesForceId, accessToken, companyId, queryKeyword, queryLocation, querySpecialization,
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
          _setPagination(data.body.jobs, 'jobs');
          toggleNavButtons();
          if (companyId) _loadCompanyDetails(data.body.company, data.body.jobs.length);
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
          window.location.replace('/');
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function _loadPageState() {
    const urlParams = new URLSearchParams(window.location.search);
    const isMyJobList = urlParams.get('myJobs');
    const companyId = urlParams.get('company');

    oSearchFiltercontainer.addClass('active');

    if (isMyJobList || companyId) {
      oBrandHeadercontainer.addClass('active');
      oBrandDetailscontainer.addClass('active');
      oBrandHeaderAboutBtn.addClass('active');
    } else {
      oJobContainer.addClass('active');
      oPaginationContainer.addClass('active');
    }
  }

  function switchBrandView(sView) {
    if (sView === 'about') {
      oBrandDetailscontainer.addClass('active');
      oBrandHeaderAboutBtn.addClass('active');
      oJobContainer.removeClass('active');
      oPaginationContainer.removeClass('active');
      oBrandHeaderJobsBtn.removeClass('active');
      oBrandJobCounter.removeClass('active');
    } else {
      oJobContainer.addClass('active');
      oPaginationContainer.addClass('active');
      oBrandHeaderJobsBtn.addClass('active');
      oBrandJobCounter.addClass('active');
      oBrandDetailscontainer.removeClass('active');
      oBrandHeaderAboutBtn.removeClass('active');
    }
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

  function _loadAllCompanies() {
    const userId = _getCookie('userId');
    const salesForceId = _getCookie('salesForceId');
    const accessToken = _getCookie('accessToken');

    showLoading();
    fetch(
      `${DOMAIN}${API_ROUTE}/job-list/companies/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, salesForceId, accessToken,
        }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        hideLoading();
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          BRAND_LIST = data.body.companies;
          _populateBrands(data.body.companies, 0);
          _setPagination(data.body.companies, 'brands');
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
          window.location.replace('/');
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function _initEventListeners() {
    oDocument.on('click', '.pagination-option', function(eEvent) {
      changePage('click', parseInt(eEvent.target.innerHTML, 10));
    });
    oAllJobsFilter.on('click', function() {
      window.location.replace('/job-list');
    });
    oAllCompaniesFilter.on('click', function() {
      oAllCompaniesFilter.addClass('active');
      oBrandContainer.addClass('active');
      oJobContainer.removeClass('active');
      oPaginationContainer.addClass('active');
      oCurrentBrandFilter.removeClass('active');
      oAllJobsFilter.removeClass('active');
      oBrandHeadercontainer.removeClass('active');
      oBrandDetailscontainer.removeClass('active');
      oBrandJobCounter.removeClass('active');
      currentIndex = 0;
      currentPage = 1;
      currentScreenView = 'brands';
      toggleNavButtons();
      _loadAllCompanies();
      // Update pagination to brands;
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
    oBrandHeaderAboutBtn.on('click', () => {
      switchBrandView('about');
    });
    oBrandHeaderJobsBtn.on('click', () => {
      switchBrandView('jobs');
    });
    oDocument.on('click', '.brand-item', (event) => {
      const oTarget = event.target;
      let companyId = null;
      if (oTarget.classList.contains('brand-name')) {
        companyId = oTarget.parentNode.id;
        window.location.replace(`/job-list?company=${companyId}`);
      } else if (oTarget.classList.contains('brand-item')) {
        companyId = oTarget.id;
        window.location.replace(`/job-list?company=${companyId}`);
      }
    });
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _load();
    _loadPageState();
    _initEventListeners();
  }

  init();
});
