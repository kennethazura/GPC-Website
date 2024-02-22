document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oCandidateContainer = u('.candidate-list-container');
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

  function _load() {
    const userId = _getCookie('userId');
    fetch(
      `${DOMAIN}${API_ROUTE}/candidate-list/load`,
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
          _populateCandidates(data.body.candidates);
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
