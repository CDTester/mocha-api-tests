import envData from '../src/utils/loadEnvData';
import apiHelper from '../src/mocha-api-tests/apiHelper';
import { expect } from 'chai';
import { step } from 'mocha-steps';
import addContext from 'mochawesome/addContext';

const env = new envData('get.test.ts').getEnvData;

describe(`GET API test examples @api @get @smoke $JIRA-1234`, function () {

  step(`[200] Expect status to be 200`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.basic);

    const test = await api.getRequest(`shows/82`);

    addContext(this, { title: `[Request] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[Response] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(200)`,
        `expect(test.response.statusText, 'StatusText is not as expected').to.equal('OK')`,
        `expect(test.response.data, 'reponse data is not as expected').to.not.be.empty`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(200);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('OK');
    expect(test.response.data, 'reponse data is not as expected').to.not.be.empty;

  });

  step(`[200] Expect response data to not be empty when Get request is called with params`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.basic);

    const test = await api.getRequest(`search/shows`, { q: 'The Expanse' });

    addContext(this, { title: `[ Request ] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[ Response ] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(200)`,
        `expect(test.response.statusText, 'StatusText is not as expected').to.equal('OK')`,
        `expect(test.response.data, 'reponse data is not as expected').to.not.be.empty`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(200);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('OK');
    expect(test.response.data, 'reponse data is not as expected').to.not.be.empty;

  });


  step(`[400] Expect bad request message to say 'Missing required parameters: q'`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.basic);

    const test = await api.getRequest(`search/shows`, { wrongParam: 'Lost' });

    addContext(this, { title: `[ Request ] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[ Response ] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(400)`,
        `expect(test.response.statusText, 'StatusText is not as expected').to.equal('Bad Request')`,
        `expect(test.response.data.message, 'error message is not as expected').to.equal('Missing required parameters: q')`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(400);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('Bad Request');
    expect(test.response.data.message, 'error message is not as expected').to.equal('Missing required parameters: q');
  });

  step(`[401] Expect Unauthorized StatusText when basic Auth is incorrect`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.appXApiKeyAuthIncorrect);

    const test = await api.getRequest('me');

    addContext(this, { title: `[ Request ] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[ Response ] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(401)`,
        `expect(test.response.statusText, 'StatusText is not as expected').to.equal('Unauthorized')`,
        `expect(test.response.data, 'reponse data is not as expected').to.not.be.empty`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(401);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('Unauthorized');
    expect(test.response.data, 'reponse data is not as expected').to.not.be.empty;
  });


  step(`[403] Expect GET Method to be Forbidden`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.appForbidden);

    const test = await api.getRequest('user');

    addContext(this, { title: `[ Request ] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[ Response ] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(403)`,
        `expect(test.response.statusText, 'StatusText is not as expected').to.equal('Forbidden')`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(403);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('Forbidden');
  });


  step(`[405] Expect POST Method not allowed on a GET method`, async function () {
    const api:apiHelper = new apiHelper(env.apiGet.appNotPost);

    const test = await api.postRequest('');

    addContext(this, { title: `[ Request ] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[ Response ] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(405)`,
        `expect(test.response.statusText, 'StatusText is not as expected').to.equal('Method Not Allowed')`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(405);
    expect(test.response.statusText, 'StatusText is not as expected').to.equal('Method Not Allowed');
  });

});
