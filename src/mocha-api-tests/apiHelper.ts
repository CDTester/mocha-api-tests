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
  private baseUrl: string;
  private auth: string;
  private authType: string;
  private headers: object
  private cookies: string[];
  private redirect: number;
  private timeout: number;
  private proxy: any;
  private responseType: string
  private accept: string;
  private cacheControl: string;
  private connection: string;
  private request: superagentTypes.Request;
  private response: superagentTypes.Response;
  

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
    this.request = superagent.requestBase();
  }

  private async mapReqResp (inputOrig:object, requestTime: string, responseTime: string): Promise<apiTest> {
    const request:apiTest['request'] = {
      time: requestTime,
      method: inputOrig['method'],
      headers: inputOrig['header'],
      cookies: inputOrig['cookies'],
      port: this.request.req['agent']['defaultPort'],
      url: inputOrig['url'],
      queries: inputOrig['_query'],
      body: inputOrig['_data'],
      formData: inputOrig['_formData'],
      maxRedirects: inputOrig['_maxRedirects'],
      redirects: { 
        numberOfRedirects: this.request['_redirects'], 
        redirectList: this.request['_redirectList'] 
      },
      files: this.request['files']
    };

    const response:apiTest['response'] = {
      time: responseTime,
      headers: this.response.headers,
      buffered: this.response['buffered'],
      redirects: this.response.redirects,
      status: this.response.status,
      statusText: this.response['res']['statusMessage'],
      data: this.response.body,
      files: this.response.files
    };

    return { request, response };
  }

  private setAuth() {
    if (this.authType !== undefined) {
      if (this.authType === 'basic') this.request.set('Authorization', `Basic ${this.auth}`);
      else if (this.authType === 'bearer') this.request.set('Authorization', `Bearer ${this.auth}`);
      else if (this.authType === 'x-api-key') this.request.set('X-API-Key', this.auth);
      else this.request.set('Authorization', this.auth);
    }
  }

  private setCookies() {
    if (this.cookies !== undefined) this.request.set('Cookie', this.cookies);
  }

  private setHeaders() {
    this.request.set('Content-Type', 'application/json').timeout(this.timeout || 1500).retry(0);
    if (this.responseType !== undefined) this.request.set('Response', this.responseType);
    if (this.proxy !== undefined) this.request.auth['proxy'] = this.proxy;
    if (this.redirect !== undefined) this.request.redirects(this.redirect);
    if (this.accept !== undefined) this.request.set('Accept', this.accept);
    if (this.connection !== undefined) this.request.set('Connection', this.connection);
    if (this.cacheControl !== undefined) this.request.set('Cache Control', this.cacheControl);
  }


  /**
   * Send GET request
   * @param {string} endpoint end point to the base url 
   * @param {object} parameters Optional. parameters to be sent with the request 
   * @return {apiTest} An object containing config, request and response details
   */
  public async getRequest (endpoint: string, query?: object): Promise<apiTest> {
    const reqTime: string = moment().local().format('HH:mm:ss.SSS');
    // let response: superagentTypes.Response;

    try {
      this.request = superagent.get(`${this.baseUrl}/${endpoint}`);
      if (query) {
        for (const q in query) {
          this.request.query(`${q}=${query[q]}`);
        }
      }
      this.setAuth();
      this.setCookies();
      this.setHeaders();

      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(this.request).map(([key, value]) => {
        return [key, value];
      }));

      this.response = await this.request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(reqOrig, reqTime, respTime);
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

    try {
      this.request = superagent.post(`${this.baseUrl}/${endpoint}`);
      if (query !== undefined) {
        for (const q in query) {
          this.request.query(`${q}=${query[q]}`);
        }
      }
      if (body !== undefined) {
        this.request.send(body);
      }
      if (file !== undefined) {
        const filePath = path.resolve(...file);
        this.request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
      }
      this.setAuth();
      this.setCookies();
      this.setHeaders();
      
      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(this.request).map(([key, value]) => {
        return [key, value];
      }));

      this.response = await this.request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(reqOrig, reqTime, respTime);
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

    try {
      this.request = superagent.put(`${this.baseUrl}/${endpoint}`);
      if (query !== undefined) {
        for (const q in query) {
          this.request.query(`${q}=${query[q]}`);
        }
      }
      if (body !== undefined) {
        this.request.send(body);
      }
      if (file !== undefined) {
        const filePath = path.resolve(...file);

        this.request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
      }
      if (file !== undefined) {
        const filePath = path.resolve(...file);
        this.request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
      }
      this.setAuth();
      this.setCookies();
      this.setHeaders();
      
      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(this.request).map(([key, value]) => {
        return [key, value];
      }));

      this.response = await this.request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(reqOrig, reqTime, respTime);
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

    try {
      this.request = superagent.put(`${this.baseUrl}/${endpoint}`);
      if (query !== undefined) {
        for (const q in query) {
          this.request.query(`${q}=${query[q]}`);
        }
      }
      if (body !== undefined) {
        this.request.send(body);
      }
      this.setAuth();
      this.setCookies();
      this.setHeaders();
      
      // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
      const reqOrig = Object.fromEntries(Object.entries(this.request).map(([key, value]) => {
        return [key, value];
      }));

      this.response = await this.request.ok(res => res.status < 600);

      const respTime: string = moment().local().format('HH:mm:ss.SSS');

      return this.mapReqResp(reqOrig, reqTime, respTime);
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