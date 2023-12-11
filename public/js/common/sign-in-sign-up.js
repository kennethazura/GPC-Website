document.addEventListener('DOMContentLoaded', function() {
  const oNavbarSignUp = u('.navbar__sign-up-btn');
  const oNavbarSignIn = u('.navbar__login-btn');
  const oBackdrop = u('.sign-in-sign-up__backdrop');
  const oSignIn = u('.sign-in');
  const oSignInBtn = u('.sign-in-btn');
  const oSignUpEmailBtn = u('.sign-up__e-mail-btn');
  const oSignUpEmailForm = u('.sign-up__e-mail-container');
  const oSignUpDisclaimer = u('.sign-up__disclaimer');

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
    oSignUpEmailForm.removeClass('active');
    oSignUpEmailBtn.removeClass('hidden');
    oSignUpDisclaimer.removeClass('active');
  }

  function initEventListeners() {
    oNavbarSignUp.on('click', showSignUp);
    oNavbarSignIn.on('click', showSignIn);
    oBackdrop.on('click', hideSignUp);
    oSignInBtn.on('click', showSignIn);
    oSignUpEmailBtn.on('click', showEmailForm);
  }

  initEventListeners();
});
