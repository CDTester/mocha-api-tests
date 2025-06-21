import envData from '../src/utils/loadEnvData';
import apiHelper from '../src/mocha-api-tests/apiHelper';
import { expect } from 'chai';
import { step } from 'mocha-steps';
import addContext from 'mochawesome/addContext';
import nock from 'nock';
import path from 'path';
const env = new envData('post.test.ts').getEnvData;

describe(`POST API test examples @api @post @smoke $JIRA-1235`, function () {

  step(`[201] Expect status to be 201`, async function () {
    const api:apiHelper = new apiHelper(env.apiPost.basic);
    const query = { apikey: 'pwd1234' };
    const body = { name: "Atlantis", coordinates: [42.35544, -71.05991] };

    // mock return
    nock(env.apiPost.basic.baseUrl)
      .post('/bodyandquery', body)
      .query(query)
      .reply(201, { message: "Location created successfully" }, { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" });

    const test = await api.postRequest('bodyandquery', query, body);

    addContext(this, { title: `[Request] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[Response] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(201)`,
        `expect(test.response.statusText, 'statusText is not as expected').to.equal('Created')`,
        `expect(test.response.data, 'reponse data is not as expected').to.nested.include({'message': 'Location created successfully'})`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(201);
    expect(test.response.statusText, 'statusText is not as expected').to.equal('Created');
    expect(test.response.data, 'reponse data is not as expected').to.nested.include({ message: 'Location created successfully' });
  });


  step(`[201] Expect response data to return data from attached file`, async function () {
    const api:apiHelper = new apiHelper(env.apiPost.basic);
    const query = { apikey: 'pwd1234' };
    const bodyReq = undefined;
    const file = ["test_data", "sample.json"];
    const filePath = path.resolve(...file);

    // mock return
    nock(env.apiPost.basic.baseUrl)
      .post('/attachedFile')
      .query(query)
      .replyWithFile(201, filePath, { 'Content-Type': 'application/json' });

    const test = await api.postRequest('attachedFile', query, bodyReq, ["test_data", "sample.json"]);

    addContext(this, { title: `[Request] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[Response] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [`expect(test.response.status, 'status is not as expected').to.equal(201)`]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(201);
  });


  step(`[200] Redirected to another URL`, async function () {
    const api:apiHelper = new apiHelper(env.apiPost.basic);
    const query = { apikey: 'pwd1234' };
    const body = { name: "Atlantis", coordinates: [42.35544, -71.05991] };

    // mock return
    nock(env.apiPost.basic.baseUrl)
      .post('/redirected', body)
      .query(query)
      .reply(302, undefined, { Location: 'http://redirected.request.com/new-path' });

    nock("http://redirected.request.com")
      .get('/new-path')
      .reply(200, { message: "Location created successfully" }, { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" });

    const test = await api.postRequest('redirected', query, body);

    addContext(this, { title: `[Request] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[Response] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(200)`,
        `expect(test.response.data, 'reponse data is not as expected').to.nested.include({'message': 'Location created successfully'})`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(200);
    expect(test.response.data, 'reponse data is not as expected').to.nested.include({ message: 'Location created successfully' });
  });


  step(`[302] Expect to be redirected `, async function () {
    const api:apiHelper = new apiHelper(env.apiPost.doNotRedirect);
    const query = { apikey: 'pwd1234' };
    const body = { name: "Atlantis", coordinates: [42.35544, -71.05991] };

    // mock return
    nock(env.apiPost.doNotRedirect.baseUrl)
      .post('/redirected', body)
      .query(query)
      .reply(302, undefined, { Location: 'http://redirected.request.com/new-path' });

    nock("http://redirected.request.com")
      .get('/new-path')
      .reply(200, { message: "Location created successfully" }, { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" });

    const test = await api.postRequest('redirected', query, body);

    addContext(this, { title: `[Request] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[Response] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(302)`,
        `expect(test.response.headers, 'reponse data is not as expected').to.nested.include({"location": "http://redirected.request.com/new-path"})`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(302);
    expect(test.response.headers, 'reponse data is not as expected').to.nested.include({ location: "http://redirected.request.com/new-path" });
  });

  step(`[400] Expect Bad Request when missing a param`, async function () {
    const api:apiHelper = new apiHelper(env.apiPost.basic);
    const query = { notKey: 'random' };
    const body = { name: "Atlantis", coordinates: [42.35544, -71.05991] };

    // mock return
    nock(env.apiPost.doNotRedirect.baseUrl)
      .post('/badRequest', body)
      .query(query)
      .reply(400, { message: "Bad Request: Missing required parameters apikey" }, { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" });

    const test = await api.postRequest('badRequest', query, body);

    addContext(this, { title: `[Request] sent at ${test.request.time}`, value: test.request });
    addContext(this, { title: `[Response] received at ${test.response.time}`, value: test.response });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(400)`,
        `expect(test.response.data, 'reponse data is not as expected').to.nested.include({ 'message': 'Bad Request: Missing required parameters apikey' })`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(400);
    expect(test.response.data, 'reponse data is not as expected').to.nested.include({ message: 'Bad Request: Missing required parameters apikey' });
  });


  step(`[405] Expect GET Method not allowed on a POST method`, async function () {
    const api:apiHelper = new apiHelper(env.apiPost.basic);
    const query = { notKey: 'random' };

    // mock return
    nock(env.apiPost.basic.baseUrl)
      .get('/wrongMethod')
      .query(query)
      .reply(405, { message: "Method Not Allowed" }, { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" });

    const test = await api.getRequest('wrongMethod', query);

    addContext(this, { title: `[ Request ] sent at ${test.request.time}`, value: JSON.stringify(test.request, null, 2) });
    addContext(this, { title: `[ Response ] received at ${test.response.time}`, value: JSON.stringify(test.response, null, 2) });

    // Show what assertion ins being executed in the test report
    addContext(this, {
      title: `[Assertions]`,
      value: [
        `expect(test.response.status, 'status is not as expected').to.equal(405)`,
        `expect(test.response.statusText, 'reponse data is not as expected').to.equal('Method Not Allowed')`
      ]
    });

    // Then run assertions after reporting
    expect(test.response.status, 'status is not as expected').to.equal(405);
    expect(test.response.statusText, 'reponse data is not as expected').to.equal('Method Not Allowed');
  });
});