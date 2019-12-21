console.log('test');

import * as htmldom from 'htmldom';
import * as request from 'request';

request.get('https://scholar.google.nl/scholar?scilib=1&hl=nl&as_sdt=0,5', (error, response, body) => {
  //const htmlInput = htmldom(body);
  console.log(body);
});