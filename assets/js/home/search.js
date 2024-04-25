document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oTalentSearch = u('.resume__search');
  const oJobSearch = u('.job__search');
  const oSearchBtn = u('.search-btn');
  const oJobHeader = u('.job__header > h2');
  const oSearchField = u('.search-field');

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

  function loadSearchTexts() {
    const sAccountType = _getCookie('accountType');
    const sHeaderText = (sAccountType === 'candidate') ? `I am looking for <b style="font-family: MonserattBold, sans-serif;">WORK?</b>` : `I am looking to hire <b style="font-family: MonserattBold, sans-serif;">TALENT?</b>`;
    const sSearchPlaceholder = (sAccountType === 'candidate') ? 'Search Jobs' : 'Search Worker Résumés';
    oJobHeader.html(sHeaderText);
    oSearchField.attr('placeholder', sSearchPlaceholder);
  }

  function _initEventListeners() {
    oSearchBtn.on('click', function() {
      window.location.replace('/job-list');
    });

    oTalentSearch.on('keyup', function(event) {
      if (event.key === 'Enter') {
        window.location.replace('/candidate-list?q=' + oTalentSearch.nodes[0].value);
      }
    });
    oJobSearch.on('keyup', function(event) {
      if (event.key === 'Enter') {
        window.location.replace('/job-list?q=' + oJobSearch.nodes[0].value);
      }
    });
  }

  function _init() {
    _initEventListeners();
    loadSearchTexts();
  }

  _init();
});
