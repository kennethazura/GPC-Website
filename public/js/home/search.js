document.addEventListener('DOMContentLoaded', function() {
  const DOMAIN = u('#domain').nodes[0].value;
  const API_ROUTE = u('#api-route').nodes[0].value;
  const oNavbar = u('.navbar');
  const oTalentSearch = u('.resume__search');
  const oJobSearch = u('.job__search');

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
});
