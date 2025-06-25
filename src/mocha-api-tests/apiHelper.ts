const superagent = require('superagent');
import type * as superagentTypes from 'superagent';
const moment = require('moment');
const path = require('path');

export interface apiConfig {
  baseUrl: string,
  headers: object,
  authType: string,
  auth: string,
  cookies: string[],
  responseType: string,
  proxy: object,
  timeout: number,
  redirect: number,
  config: string,
  accept: string;
  cacheControl: string,
  connection: string

}

export interface apiTest {
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
  protected auth: string;
  protected authType: string;
  protected headers: object
  protected cookies: string[];
  protected redirect: number;
  protected timeout: number;
  protected proxy: any;
  protected responseType: string
  protected accept: string;
  protected cacheControl: string;
  protected connection: string;

  constructor (config:apiConfig) {
    this.baseUrl = config.baseUrl;
    this.auth = config.auth;
    this.authType = config.authType;
    this.headers = config.headers;
    this.cookies = config.cookies;
    this.redirect = config.redirect;
    this.timeout = config.timeout;
    this.proxy = config.proxy;
    this.responseType = config.responseType;
    this.accept = config.accept;
    this.cacheControl = config.cacheControl;
    this.connection = config.connection;

  }

  protected async mapReqResp (input: superagentTypes.Request, inputOrig:object, output: superagentTypes.Response, requestTime: string, responseTime: string): Promise<apiTest> {

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
    let request: superagentTypes.Request;
    let response: superagentTypes.Response;

    try {
      request = superagent.get(`${this.baseUrl}/${endpoint}`);
      if (query) {
        for (const q in query) {
          request.query(`${q}=${query[q]}`);
        }
      }
      request.set('Content-Type', 'application/json').timeout(this.timeout || 1500).retry(0);
      if (this.authType !== undefined) {
        if (this.authType === 'basic') request.set('Authorization', `Basic ${this.auth}`);
        else if (this.authType === 'bearer') request.set('Authorization', `Bearer ${this.auth}`);
        else if (this.authType === 'x-api-key') request.set('X-API-Key', this.auth);
        else request.set('Authorization', this.auth);
      }
      if (this.cookies !== undefined) request.set('Cookie', this.cookies);
      if (this.responseType !== undefined) request.set('Response', this.responseType);
      if (this.proxy !== undefined) request.auth['proxy'] = this.proxy;
      if (this.redirect !== undefined) request.redirects(this.redirect);
      if (this.accept !== undefined) request.set('Accept', this.accept);
      if (this.connection !== undefined) request.set('Connection', this.connection);
      if (this.cacheControl !== undefined) request.set('Cache Control', this.cacheControl);

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
    let request: superagentTypes.Request;
    let response: superagentTypes.Response;

    try {
      request = superagent.post(`${this.baseUrl}/${endpoint}`);
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
      if (this.authType !== undefined) {
        if (this.authType === 'basic') request.set('Authorization', `Basic ${this.auth}`);
        else if (this.authType === 'bearer') request.set('Authorization', `Bearer ${this.auth}`);
        else if (this.authType === 'x-api-key') request.set('X-API-Key', this.auth);
        else request.set('Authorization', this.auth);
      }
      if (this.cookies !== undefined) request.set('Cookie', this.cookies);
      if (this.responseType !== undefined) request.set('Response', this.responseType);
      if (this.proxy !== undefined) request.auth['proxy'] = this.proxy;
      if (this.redirect !== undefined) request.redirects(this.redirect);
      if (this.accept !== undefined) request.set('Accept', this.accept);
      if (this.connection !== undefined) request.set('Connection', this.connection);
      if (this.cacheControl !== undefined) request.set('Cache Control', this.cacheControl);

      
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
    let request: superagentTypes.Request;
    let response: superagentTypes.Response;

    try {
      request = superagent.put(`${this.baseUrl}/${endpoint}`);
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
      if (file !== undefined) {
        const filePath = path.resolve(...file);
        request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
      }
      if (this.authType !== undefined) {
        if (this.authType === 'basic') request.set('Authorization', `Basic ${this.auth}`);
        else if (this.authType === 'bearer') request.set('Authorization', `Bearer ${this.auth}`);
        else if (this.authType === 'x-api-key') request.set('X-API-Key', this.auth);
        else request.set('Authorization', this.auth);
      }
      if (this.cookies !== undefined) request.set('Cookie', this.cookies);
      if (this.responseType !== undefined) request.set('Response', this.responseType);
      if (this.proxy !== undefined) request.auth['proxy'] = this.proxy;
      if (this.redirect !== undefined) request.redirects(this.redirect);
      if (this.accept !== undefined) request.set('Accept', this.accept);
      if (this.connection !== undefined) request.set('Connection', this.connection);
      if (this.cacheControl !== undefined) request.set('Cache Control', this.cacheControl);
      
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
    let request: superagentTypes.Request;
    let response: superagentTypes.Response;

    try {
      request = superagent.put(`${this.baseUrl}/${endpoint}`);
      if (query !== undefined) {
        for (const q in query) {
          request.query(`${q}=${query[q]}`);
        }
      }
      if (body !== undefined) {
        request.send(body);
      }
      if (this.authType !== undefined) {
        if (this.authType === 'basic') request.set('Authorization', `Basic ${this.auth}`);
        else if (this.authType === 'bearer') request.set('Authorization', `Bearer ${this.auth}`);
        else if (this.authType === 'x-api-key') request.set('X-API-Key', this.auth);
        else request.set('Authorization', this.auth);
      }
      if (this.cookies !== undefined) request.set('Cookie', this.cookies);
      if (this.responseType !== undefined) request.set('Response', this.responseType);
      if (this.proxy !== undefined) request.auth['proxy'] = this.proxy;
      if (this.redirect !== undefined) request.redirects(this.redirect);
      if (this.accept !== undefined) request.set('Accept', this.accept);
      if (this.connection !== undefined) request.set('Connection', this.connection);
      if (this.cacheControl !== undefined) request.set('Cache Control', this.cacheControl);
      
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