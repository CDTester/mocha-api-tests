import superagent from 'superagent';
import prefix from 'superagent-prefix';
import moment from 'moment';
import path from 'path';

interface apiConfig {
  baseUrl: string,
  headers?: object,
  authType?: string,
  auth?: string,
  cookies?: string[],
  responseType?: string,
  proxy?: object,
  timeout?: number,
  redirect: number
}

interface apiTest {
  request:{
    time: string,
    method: string,
    protocol?: string,
    port?: number,
    host?: string,
    path?: string,
    url: string,
    cookies: any,
    files?: any,
    body: any,
    formData: any,
    queries?: object,
    redirects?: any,
    maxRedirects: number,
    headers: any
  },
  response: {
    time: string,
    status: number,
    statusText: string|number,
    headers: any,
    buffered: boolean,
    redirects: string[],
    data: any,
    files: any
  }
}

/**
 * A base class for API helper
 */

export default class apiHelper {
  protected instance: object;
  protected baseUrl: string;
  public apiInstance: superagent.Agent;

  constructor (config:apiConfig) {
    this.baseUrl = config.baseUrl;
    this.apiInstance = superagent.agent().use(prefix(config.baseUrl));
    this.apiInstance.set('Content-Type', 'application/json').timeout(config.timeout || 1500).retry(0);

    if (config.authType !== undefined) {
      if (config.authType === 'basic' || config.authType === 'bearer') this.apiInstance.set('Authorisation', config.auth);
      else if (config.authType === 'x-api-key') this.apiInstance.set('X-API-Key', config.auth);
      else this.apiInstance.set('Authorisation', config.auth);
    }
    if (config.cookies !== undefined) this.apiInstance.set('Cookie', config.cookies);
    if (config.responseType !== undefined) this.apiInstance.set('Response', config.responseType);
    if (config.proxy !== undefined) this.apiInstance.auth['proxy'] = config.proxy;
    if (config.redirect !== undefined) this.apiInstance.redirects(config.redirect);
  }


  protected async mapReqResp (input: superagent.Request, inputOrig:object, output: superagent.Response, requestTime: string, responseTime: string): Promise<apiTest> {

    const request:apiTest['request'] = {
      time: requestTime,
      method: inputOrig['method'],
      headers: inputOrig['header'],
      cookies: inputOrig['cookies'],
      port: input.req['agent']['defaultPort'],
      url: inputOrig['url'],
      queries: inputOrig['_query'],
      body: inputOrig['_data'],
      formData: inputOrig['_formData'],
      maxRedirects: inputOrig['_maxRedirects'],
      redirects: { numberOfRedirects: input['_redirects'], redirectList: input['_redirectList'] },
      files: input['files']
    };

    const response:apiTest['response'] = {
      time: responseTime,
      headers: output.headers,
      buffered: output['buffered'],
      redirects: output.redirects,
      status: output.status,
      statusText: output['res']['statusMessage'],
      data: output.body,
      files: output.files
    };

    return { request, response };
  }


  /**
   * Send GET request
   * @param {string} endpoint end point to the base url 
   * @param {object} parameters Optional. parameters to be sent with the request 
   * @return {apiTest} An object containing config, request and response details
   */
  public async getRequest (endpoint: string, query?: object): Promise<apiTest> {
    const reqTime: string = moment().local().format('HH:mm:ss.SSS');
    let request: superagent.Request;
    let response: superagent.Response;

    try {
      request = this.apiInstance.get(`${this.baseUrl}/${endpoint}`);
      if (query) {
        for (const q in query) {
          request.query(`${q}=${query[q]}`);
        }
      }

      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
        return [key, value];
      }));

      response = await request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(request, reqOrig, response, reqTime, respTime);
    }
    catch (error) {
      if (error instanceof Error) console.error(`ERROR: GET Request - ${error.message}`);
      else console.error(`ERROR: GET Request - ${error}`);
      throw error;
    }
  }


  /**
   * Send POST request
   * @param {string} endpoint end point to the base url
   * @param {object} query Optional. parameters to be sent with the request 
   * @param {string} body end point to the base url
   * @param {string} file any attachments to be added to the request
   * @return {apiTest} An object containing config, request and response details
   */
  public async postRequest (endpoint: string, query?:object, body?: object|string|string[], file?:string[]): Promise<apiTest> {
    const reqTime: string = moment().local().format('HH:mm:ss.SSS');
    let request: superagent.Request;
    let response: superagent.Response;

    try {
      request = this.apiInstance.post(`${this.baseUrl}/${endpoint}`);
      if (query !== undefined) {
        for (const q in query) {
          request.query(`${q}=${query[q]}`);
        }
      }
      if (body !== undefined) {
        request.send(body);
      }
      if (file !== undefined) {
        const filePath = path.resolve(...file);
        request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
      }

      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
        return [key, value];
      }));

      response = await request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(request, reqOrig, response, reqTime, respTime);
    }
    catch (error) {
      if (error instanceof Error) console.error(`ERROR: POST Request - ${error.message}`);
      else console.error(`ERROR: POST Request - ${error}`);
      throw error;
    }
  }

  /**
   * Send PUT request
   * @param {string} endpoint end point to the base url
   * @param {object} query Optional. parameters to be sent with the request 
   * @param {string} body end point to the base url
   * @param {string} file any attachments to be added to the request
   * @return {apiTest} An object containing config, request and response details
   */
  public async putRequest (endpoint: string, query?:object, body?: object|string|string[], file?:string[]): Promise<apiTest> {
    const reqTime: string = moment().local().format('HH:mm:ss.SSS');
    let request: superagent.Request;
    let response: superagent.Response;

    try {
      request = this.apiInstance.put(`${this.baseUrl}/${endpoint}`);
      if (query !== undefined) {
        for (const q in query) {
          request.query(`${q}=${query[q]}`);
        }
      }
      if (body !== undefined) {
        request.send(body);
      }
      if (file !== undefined) {
        const filePath = path.resolve(...file);

        request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
      }

      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
        return [key, value];
      }));

      response = await request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(request, reqOrig, response, reqTime, respTime);
    }
    catch (error) {
      if (error instanceof Error) {
        console.error(`ERROR: POST Request - ${error.message}`);
      }
      else {
        console.error(`ERROR: POST Request - ${error}`);
      }
      throw error;
    }
  }

  /**
   * Send DELETE request
   * @param {string} endpoint end point to the base url
   * @param {object} query Optional. parameters to be sent with the request 
   * @param {string} body end point to the base url
   * @return {apiTest} An object containing config, request and response details
   */
  public async deleteRequest (endpoint: string, query?:object, body?: object|string|string[]): Promise<apiTest> {
    const reqTime: string = moment().local().format('HH:mm:ss.SSS');
    let request: superagent.Request;
    let response: superagent.Response;

    try {
      request = this.apiInstance.put(`${this.baseUrl}/${endpoint}`);
      if (query !== undefined) {
        for (const q in query) {
          request.query(`${q}=${query[q]}`);
        }
      }
      if (body !== undefined) {
        request.send(body);
      }

      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
        return [key, value];
      }));

      response = await request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(request, reqOrig, response, reqTime, respTime);
    }
    catch (error) {
      if (error instanceof Error) {
        console.error(`ERROR: POST Request - ${error.message}`);
      }
      else {
        console.error(`ERROR: POST Request - ${error}`);
      }
      throw error;
    }
  }
}