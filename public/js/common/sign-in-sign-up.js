document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbarSignUp = u('.navbar__sign-up-btn');
  const oNavbarSignIn = u('.navbar__login-btn');
  const oBackdrop = u('.sign-in-sign-up__backdrop');
  const oSignIn = u('.sign-in');
  const oSignUp = u('.sign-up');
  const oSignInBtn = u('.sign-in-btn');
  const oLogInBtn = u('.sign-in__e-mail-container button');
  const oSignUpBtn = u('.sign-up-btn');
  const oSignUpEmailBtn = u('.sign-up__e-mail-btn');
  const oSignUpEmailSubmit = u('.sign-up__e-mail-container button');
  const oSignUpEmailForm = u('.sign-up__e-mail-container');
  const oSignInEmail = u('.sign-in__e-mail');
  const oSignInPassword = u('.sign-in__password');
  const oSignUpEmail = u('.sign-up__e-mail');
  const oSignUpPassword = u('.sign-up__password');
  const oSignUpConfirmPassword = u('.sign-up__confirm-password');
  const oSignUpDisclaimer = u('.sign-up__disclaimer');
  const oPostSignUpLaterBtn = u('.post-sign-up__later-btn');
  const oPostSignUpSkipBtn = u('.post-sign-up__skip-btn');
  const oPostSignUpRegisterCompany = u('.register-company-btn');
  const oPostSignUpRegisterCandidate = u('.register-candidate-btn');

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

  function showSignUp() {
    u('.sign-in-sign-up__backdrop').addClass('active');
    u('.sign-in-sign-up').addClass('active');
    oSignIn.removeClass('active');
  }

  function showSignIn() {
    showSignUp();
    oSignIn.addClass('active');
  }

  function showEmailForm() {
    oSignUpEmailForm.addClass('active');
    oSignUpEmailBtn.addClass('hidden');
    oSignUpDisclaimer.addClass('active');
  }

  function hideSignUp() {
    u('.sign-in-sign-up__backdrop').removeClass('active');
    u('.sign-in-sign-up').removeClass('active');
    oSignUp.removeClass('complete');
    oSignUpEmailForm.removeClass('active');
    oSignUpEmailBtn.removeClass('hidden');
    oSignUpDisclaimer.removeClass('active');
    window.location.reload();
  }

  function goToPostSignUp() {
    oSignUp.addClass('complete');
  }

  function signUp() {
    const sEmail = oSignUpEmail.nodes[0].value;
    const sPassword = oSignUpPassword.nodes[0].value;
    const sConfirmPassword = oSignUpConfirmPassword.nodes[0].value;
    if (sPassword !== sConfirmPassword) {
      alert('Passwords do not match');
    } else {
      fetch(
        `${DOMAIN}${API_ROUTE}/sign-up`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: sEmail, password: sPassword }),
        },
      ).then((oResponse) => oResponse.json())
        .then((data) => {
          if (data.success) {
            _setCookie('userId', data.body.userId);
            _setCookie('userEmail', sEmail);
            goToPostSignUp();
          } else if (data.body.errMessage) {
            alert(data.body.errMessage);
          } else {
            alert('Unfortunately, an error occurred in the server');
          }
        });
    }
  }

  function doLogIn() {
    const sUserInputEmail = oSignInEmail.nodes[0].value;
    const sUserInputPass = oSignInPassword.nodes[0].value;

    fetch(
      `${DOMAIN}${API_ROUTE}/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: sUserInputEmail, password: sUserInputPass }),
      },
    ).then((oResponse) => oResponse.json())
      .then((data) => {
        if (data.success) {
          _setCookie('userId', data.body.userId);
          _setCookie('userEmail', data.body.email);
          _setCookie('accountType', data.body.accountType);
          _setCookie('salesForceId', data.body.salesForceId);
          window.location.replace('/search');
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
        } else {
          alert('Unfortunately, an error occurred in the server');
        }
      });
  }

  function finalizeRegistartion(accountType) {
    const redirectPage = (accountType === 'candidate') ? '/candidate-profile' : 'company-profile';
    const userId = _getCookie('userId');
    const email = _getCookie('userEmail');
    const accessToken = _getCookie('accessToken');
    fetch(
      `${DOMAIN}${API_ROUTE}/register-salesforce`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, email, accountType, accessToken,
        }),
      },
    ).then((oResponse) => oResponse.json())
      .then((registrationData) => {
        if (registrationData.success) {
          _setCookie('accountType', accountType);
          _setCookie('salesForceId', registrationData.body.salesForceId);
          window.location.replace(redirectPage);
        } else if (registrationData.body.errMessage) {
          alert('Error: ' + registrationData.body.errCode);
          console.warn(registrationData.body.errMessage);
          console.warn(registrationData.body.consoleMessage);
        } else {
          console.warn('Unfortunately, an error occurred in the server');
        }
      });
  }

  function initEventListeners() {
    oNavbarSignUp.on('click', showSignUp);
    oNavbarSignIn.on('click', showSignIn);
    oBackdrop.on('click', hideSignUp);
    oSignInBtn.on('click', showSignIn);
    oSignUpBtn.on('click', showSignUp);
    oSignUpEmailBtn.on('click', showEmailForm);
    oSignUpEmailSubmit.on('click', signUp);
    oPostSignUpRegisterCompany.on('click', () => { finalizeRegistartion('company'); });
    oPostSignUpRegisterCandidate.on('click', () => { finalizeRegistartion('candidate'); });
    oSignUpConfirmPassword.on('keyup', (event) => {
      if (event.keyCode === 13) {
        signUp();
      }
    });
    oLogInBtn.on('click', doLogIn);
    oSignInEmail.on('keyup', (event) => {
      if (event.keyCode === 13) {
        doLogIn();
      }
    });
    oSignInPassword.on('keyup', (event) => {
      if (event.keyCode === 13) {
        doLogIn();
      }
    });
  }

  function init() {
    if (_getCookie('userId') !== '' && window.location.pathname === '/') {
      window.location.replace('/search');
    }
    initEventListeners();
  }

  init();
});
