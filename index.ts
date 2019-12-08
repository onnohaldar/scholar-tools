console.log('test');

let scholar = require('google-scholar')

scholar.all('explainability of adm')
  .then(resultsObj => {
    console.log(resultsObj)
  });

