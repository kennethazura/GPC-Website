document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');

  const oTabs = u('.tabs__container .tab');
  const oContentContainer = u('.content__container');

  function switchTab(eEvent) {
    const oTargetTab = eEvent.target.parentElement;
    const sTarget = eEvent.target.id;
    if (oTargetTab.classList.contains('active')) return;
    oTabs.removeClass('active');
    oTargetTab.classList.add('active');
    oContentContainer.removeClass('payment', 'balance', 'history');
    oContentContainer.addClass(sTarget);
  }

  function _initEventListeners() {
    oTabs.on('click', (eEvent) => {
      switchTab(eEvent);
    });
  }

  function _init() {
    oNavbar.addClass('navbar--white');
    _initEventListeners();
  }

  _init();
});
