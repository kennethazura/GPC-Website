document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oCompanyName = u('.name__field');
  const oValidDate = u('.date__field');
  const oSignature = u('.signature');
  const oCurrentDate = u('.current__date');
  const oNextBtn = u('.progress__btn');
  const oProgressBar = u('.progress__bar');
  const oProgressValue = u('.progress__value');

  let step = 0;

  oNavbar.addClass('navbar--white');

  oNextBtn.on('click', function(event) {
    if (step === 4) {
      return;
    }
    step += 1;
    oProgressValue.text(4 - step);
    if (step === 1) {
      oProgressBar.addClass('step-1');
      oCompanyName.nodes[0].focus();
    } else if (step === 2) {
      oProgressBar.addClass('step-2');
      oValidDate.nodes[0].focus();
    } else if (step === 3) {
      oProgressBar.addClass('step-3');
      oSignature.nodes[0].focus();
    } else if (step === 4) {
      oProgressBar.addClass('step-4');
      oCurrentDate.nodes[0].focus();
    }
  });
});
