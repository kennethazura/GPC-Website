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
          console.log(data);
          _setCookie('userId', data.body.userId);
          _setCookie('userEmail', data.body.email);
          window.location.reload();
        } else if (data.body.errMessage) {
          alert(data.body.errMessage);
        } else {
          alert('Unfortunately, an error occurred in the server');
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
    oPostSignUpLaterBtn.on('click', hideSignUp);
    oPostSignUpSkipBtn.on('click', hideSignUp);
    oSignUpEmailSubmit.on('click', signUp);
    oLogInBtn.on('click', doLogIn);
  }

  initEventListeners();
});
