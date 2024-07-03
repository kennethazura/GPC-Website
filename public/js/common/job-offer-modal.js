document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oDocument = u(document);
  const oBackdrop = u('.job-offer__backdrop');
  const oJobOfferDetails = u('.job-offer .step-1');
  const oJobOfferNextBtn = u('.job-offer .step-1 .job-offer__btn');
  const oJobOfferACHDetails = u('.job-offer .step-2');
  const oJobOfferFinalizeBtn = u('.job-offer .step-2 .job-offer__btn');
  const oJobOfferSalary = u('.job-offer__salary');
  const oJobOfferStartDate = u('.job-offer__start-date');
  const oJobOfferStartTime = u('.job-offer__start-time');
  const oJobOfferEndTime = u('.job-offer__end-time');
  const oJobOfferTimezone = u('.job-offer__timezone');
  const oJobOfferFirstName = u('.job-offer__ach-first-name');
  const oJobOfferLastName = u('.job-offer__ach-last-name');
  const oJobOfferRoutingNo = u('.job-offer__ach-routing-no');
  const oJobOfferAccountingNo = u('.job-offer__ach-accounting-no');
  const oJobOfferTransactionAmount = u('.job-offer__transaction-amount');
  let CANDIDATE_ID = null;

  function _setCookie(cname, cvalue, exdays = 1) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

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

  function showACHDetails() {
    u('.job-offer__backdrop').addClass('active');
    u('.job-offer').addClass('active');
    oJobOfferDetails.removeClass('active');
  }

  function showJobDetails(eEvent) {
    CANDIDATE_ID = eEvent.target.dataset.id;
    showACHDetails();
    oJobOfferDetails.addClass('active');
  }

  function hideModal() {
    u('.job-offer__backdrop').removeClass('active');
    u('.job-offer').removeClass('active');
    oJobOfferACHDetails.removeClass('complete');
  }

  function sendJobOffer() {
    const jobId = window.location.pathname.split("/")[2];
    const accessToken = _getCookie('accessToken');

    const API_PAYLOAD = {
      accountId: CANDIDATE_ID,
      accessToken,
      jobId,
      salary: oJobOfferSalary.nodes[0].value,
      startDate: oJobOfferStartDate.nodes[0].value,
      startTime: oJobOfferStartTime.nodes[0].value,
      endTime: oJobOfferEndTime.nodes[0].value,
      timezone: oJobOfferTimezone.nodes[0].value,
      firstName: oJobOfferFirstName.nodes[0].value,
      lastName: oJobOfferLastName.nodes[0].value,
      routingNo: oJobOfferRoutingNo.nodes[0].value,
      accountingNo: oJobOfferAccountingNo.nodes[0].value,
      transactionAmount: oJobOfferTransactionAmount.nodes[0].value,
      status: 'Not Started',
    };

    showLoading();
    fetch(
      `${DOMAIN}${API_ROUTE}/job-application/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(API_PAYLOAD),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        hideLoading();
        if (data.success) {
          alert('Your offer has been sent');
          window.location.reload();
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function initEventListeners() {
    oDocument.on('click', '.send-offer-btn', function(eEvent) {
      showJobDetails(eEvent);
    });
    oBackdrop.on('click', hideModal);
    oJobOfferNextBtn.on('click', showACHDetails);
    oJobOfferFinalizeBtn.on('click', sendJobOffer);
  }

  function init() {
    // if (_getCookie('userId') !== '' && window.location.pathname === '/') {
    //   window.location.replace('/search');
    // }
    initEventListeners();
  }

  init();
});
