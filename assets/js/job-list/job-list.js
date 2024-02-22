document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oJobContainer = u('.job-list-container');
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
    for (let ctr = 0; ctr < 4; ctr += 1) {
      if (jobs[ctr] === undefined) break;
      const oJob = `<div class="job">
          <img class="job-image" />
          <div class="job-details">
              <span class="job-name">${jobs[ctr].positionName || 'Sample Job'}</span>
              <span class="company-name">${jobs[ctr].companyName || 'Sample Company'}</span>
          </div>
          <button class="send-offer-btn">APPLY</button>
        </div>`;
      oJobContainer.append(oJob);
    }
  }

  function _load() {
    const userId = _getCookie('userId');
    fetch(
      `${DOMAIN}${API_ROUTE}/job-list/load`,
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
          console.log(data.body.jobs);
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
  }

  function init() {
    oNavbar.addClass('navbar--white');
    _load();
    _initEventListeners();
  }

  init();
});
