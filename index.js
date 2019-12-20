console.log('test');

var scholar = require('google-scholar')

scholar.all('chair')
  .then(resultsObj => {
    console.log(resultsObj)
  });

