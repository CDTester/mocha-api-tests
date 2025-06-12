import envData from '../src/utils/loadEnvData';
import apiHelper from '../src/mocha-api-tests/apiHelper';
import { expect } from 'chai';
import { step } from 'mocha-steps';
import addContext from 'mochawesome/addContext';

let show = 'lost';

const env = new envData('api_get.test.ts').getEnvData;

describe(`API test @api @smoke $JIRA-1234`, function () {

  before(`get env data`, async function () {
    addContext(this, {
      title: `env Data`,
      value: env
    })
    //console.log(process.env)
  });


  step(`Get request`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.basic);
    addContext(this, {
      title: `[API Config]`,
      value: JSON.stringify(env.apiGet.basic, null, 2)
    });

    let test = await api.getRequest(`shows/82`);
    addContext(this, {
      title: `[Request] sent at ${test.request.time}`,
      value: JSON.stringify(test.request, null, 2)
    });
    addContext(this, {
      title: `[Response] received at ${test.response.time}`,
      value: JSON.stringify(test.response, null, 2)
    });
    expect(test.response.status, 'status is not as expected').to.equal(200);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('OK');
    expect(test.response.data, 'reponse data is not as expected').to.not.be.empty

  });

  step(`Get request with params`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.basic);
    addContext(this, {
      title: `[ API Config ]`,
      value: JSON.stringify(env.apiGet.basic, null, 2)
    });

    let test = await api.getRequest(`search/shows`, {q: show});
    addContext(this, {
      title: `[ Request ] sent at ${test.request.time}`,
      value: JSON.stringify(test.request, null, 2)
    });
    addContext(this, {
      title: `[ Response ] received at ${test.response.time}`,
      value: JSON.stringify(test.response, null, 2)
    });
    expect(test.response.status, 'status is not as expected').to.equal(200);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('OK');
    expect(test.response.data, 'reponse data is not as expected').to.not.be.empty

  });


});
