import axios from 'axios';
import moment from 'moment';
//import addContext from 'mochawesome/addContext';


interface apiConfig {
  baseUrl: string,
  headers?: object,
  authType?: string,
  auth?: string,
  responseType?: string,
  proxy?: object,
  timeout?: number
}

interface apiTest {
  request:{
    time: string,
    method: string,
    host: string,
    path: string,
    protocol: string,
    headers: any,
    chunkedEncoding: boolean,
    shouldKeepAlive: boolean,
    maxRequestsOnConnectionReached: boolean
  },
  response: {
    time: string,
    status: number,
    statusText: string,
    headers: any,
    data: any
  }
}

/**
 * A base class for API helper
 */

export default class apiHelper {
  protected instance: object;
  protected api: axios.AxiosInstance;
  protected reportContext: {
    context: Mocha.Context,
    section: string
  };


  constructor(config:apiConfig) {
    this.instance = {
      baseURL: config.baseUrl
    };

    if (config.timeout) this.instance['timeout'] = config.timeout;
    if (config.headers) this.instance['headers'] = config.headers;
    if (config.authType === 'basic') this.instance['auth'] = config.auth;
    if (config.authType === 'bearer') this.instance['Authorization'] = config.auth;
    if (config.responseType) this.instance['responseType'] = config.responseType;
    if (config.proxy) this.instance['proxy'] = config.proxy;

    this.api = axios.create(this.instance);
  }

  protected mapResponse (output: axios.AxiosResponse, requestTime: string, responseTime: string): apiTest {
    const request:apiTest['request'] = {
      time: requestTime,
      method: output.request.method,
      host: output.request.host,
      path: output.request.path,
      protocol: output.request.protocol,
      headers: JSON.parse(JSON.stringify(output.request._headers)),
      chunkedEncoding: output.request.chunkedEncoding,
      shouldKeepAlive: output.request.shouldKeepAlive,
      maxRequestsOnConnectionReached: output.request.maxRequestsOnConnectionReached
    };

    const response:apiTest['response'] = {
      time: responseTime,
      status: output.status,
      statusText: output.statusText,
      headers: JSON.parse(JSON.stringify(output.headers)),
      data: output.data
    };

    return {request, response};
  }


  /**
   * Send GET request
   * @param {string} endpoint end point to the base url 
   * @param {object} parameters Optional. parameters to be sent with the request 
   * @return {apiTest} An object containing request and response details
   */
  public async getRequest (endpoint: string, parameters?:object ): Promise<apiTest> {
    const reqTime: string = moment().local().format('HH:mm:ss.SSS');
    let response: axios.AxiosResponse;
    try {
      if (parameters) {
          response = await this.api({
          method: 'get',
          url: endpoint,
          params: parameters
        });
      }
      else{
        response = await this.api({
          method: 'get',
          url: endpoint
        });
      };
      const respTime: string = moment().local().format('HH:mm:ss.SSS');
      console.log(response)
      return this.mapResponse(response, reqTime, respTime);
    }
    catch (error) {
      if (error instanceof Error) {
        console.error(`ERROR: GET Request - ${error.message}`);
      }
      else {
        console.error(`ERROR: GET Request - ${error}`);
      }
      throw error;
    }
    finally {
      console.log(`Request completed at ${reqTime}`);
    }
  }


  /**
   * Send POST request
   * @param {string} endpoint end point to the base url
   * @param {string} body end point to the base url
   * @param {object} parameters Optional. parameters to be sent with the request 
   * @return {apiTest} An object containing request and response details
   */
  public async postRequest (endpoint: string, body?: object|string|string[], parameters?:object ): Promise<apiTest> {
    const reqTime: string = moment().local().format('HH:mm:ss.SSS');
    let response: axios.AxiosResponse;
    try {
      if (parameters) {
          response = await this.api({
          method: 'post',
          url: endpoint,
          params: parameters,
          data: body
        });
      }
      else{
        response = await this.api({
          method: 'post',
          url: endpoint,
          data: body
        });
      };
      const respTime: string = moment().local().format('HH:mm:ss.SSS');
      console.log(response)
      return this.mapResponse(response, reqTime, respTime);
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
    finally {
      console.log(`Request completed at ${reqTime}`);
    }
  }


}