document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oUserContainer = u('.user-container');
  const oUserDropdown = u('.user-dropdown');
  const oSignUpBtn = u('.navbar__sign-up-btn');
  const oLogInBtn = u('.navbar__login-btn');
  const oDropdownIcon = u('.user-container__dropdown-icon');
  const oUserName = u('.user-container__name');
  const oLogOutBtn = u('.logout-btn');

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

  function _getAccessToken() {
    fetch(
      `${DOMAIN}${API_ROUTE}/get-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success) {
          _setCookie('accessToken', data.body.access_token);
        } else if (data.body.errMessage) {
          console.warn(data.body.errMessage);
        } else {
          console.warn('Unfortunately, an error occurred in the server');
        }
      });
  }

  function _checkUserSession() {
    const sLoggedInUser = _getCookie('userEmail');
    const sUserId = _getCookie('userId');
    const sAccessToken = _getCookie('accessToken');
    oUserName.text(sLoggedInUser);

    if (!sAccessToken) {
      console.log('get token');
      _getAccessToken(sUserId);
    }

    return sLoggedInUser !== '';
  }

  function hideSignInBtns() {
    oSignUpBtn.addClass('hidden');
    oLogInBtn.addClass('hidden');
  }

  function hideUserContainer() {
    oUserContainer.addClass('hidden');
  }

  function toggleUserDropdown() {
    oUserDropdown.toggleClass('active');
    oDropdownIcon.toggleClass('active');
  }

  function doLogOut() {
    _deleteCookie('userId');
    _deleteCookie('userEmail');
    _deleteCookie('accountType');
    _deleteCookie('accessToken');
    _deleteCookie('salesForceId');
    window.location.replace('/');
  }

  function loadNavbarState(hasSession = false) {
    if (hasSession) {
      hideSignInBtns();
    } else {
      hideUserContainer();
    }
  }

  function _initEventListeners() {
    oUserContainer.on('click', toggleUserDropdown);
    oLogOutBtn.on('click', doLogOut);
  }

  function init() {
    const hasSession = _checkUserSession();
    loadNavbarState(hasSession);
    _initEventListeners();
  }

  init();
});
