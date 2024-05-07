document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oCandidateContainer = u('.candidate-list-container');
  const oDocument = u(document);
  const oPaginationPages = u('.pagination-pages');
  const oPreviousPage = u('.pagination-prev');
  const oNextPage = u('.pagination-next');
  let CANDIDATE_LIST = [];
  const currentIndex = 0;
  const currentPage = 1;

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

  function _populateCandidates(candidates) {
    for (let ctr = 0; ctr < 4; ctr += 1) {
      if (candidates[ctr] === undefined) break;
      const oJobDetails = (candidates[ctr].professionalInformation) ? JSON.parse(candidates[ctr].professionalInformation) : [{ jobTitle: null }];
      const oCandidate = `<div class="candidate">
        <img class="candidate-image" />
        <div class="candidate-details">
            <span class="candidate-name">${candidates[ctr].firstName || 'John'} ${candidates[ctr].lastName || 'Doe'}</span>
            <span class="candidate-position">${oJobDetails[0].jobTitle || 'Job Title Placeholder'}</span>
        </div>
        <button class="send-offer-btn">SEND JOB OFFER</button>
      </div>`;
      oCandidateContainer.append(oCandidate);
    }
  }

  function _setPagination(candidates) {
    oPaginationPages.html('');
    let pageNumber = 1;
    for (let ctr = 0; ctr < candidates.length; ctr += 4) {
      if (pageNumber === currentPage) oPaginationPages.append(`<span class="pagination-option active">${pageNumber}</span>`);
      else oPaginationPages.append(`<span class="pagination-option">${pageNumber}</span>`);
      pageNumber += 1;
    }
  }

  function toggleNavButtons() {
    const totalPages = Math.ceil(CANDIDATE_LIST.length / 4);
    oPreviousPage.removeClass('disabled');
    oNextPage.removeClass('disabled');
    if (currentPage === 1) {
      oPreviousPage.addClass('disabled');
    }
    if (currentPage === totalPages) {
      oNextPage.addClass('disabled');
    }
  }

  function _load() {
    const userId = _getCookie('userId');
    const salesForceId = _getCookie('salesForceId');
    const accessToken = _getCookie('accessToken');
    const jobId = window.location.pathname.split("/")[2];

    showLoading();
    fetch(
      `${DOMAIN}${API_ROUTE}/candidate-list/load`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, salesForceId, jobId, accessToken,
        }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        hideLoading();
        if (data.success === 401) {
          window.location.replace('/');
        } else if (data.success) {
          CANDIDATE_LIST = data.body.candidates;
          _populateCandidates(data.body.candidates);
          _setPagination(data.body.candidates);
          toggleNavButtons();
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function _initEventListeners() {
    oDocument.on('click', '.send-offer-btn', function(eEvent) {
      alert('Congratulations on finding new talent!');
    });
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _load();
    _initEventListeners();
  }

  init();
});
