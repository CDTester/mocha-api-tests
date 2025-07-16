import type * as superagentTypes from 'superagent';
export interface apiConfig {
    baseUrl: string;
    headers: object;
    authType: string;
    auth: string;
    cookies: string[];
    responseType: string;
    proxy: object;
    timeout: number;
    redirect: number;
    config: string;
    accept: string;
    cacheControl: string;
    connection: string;
}
export interface apiTest {
    request: {
        time: string;
        method: string;
        protocol?: string;
        port?: number;
        host?: string;
        path?: string;
        url: string;
        cookies: any;
        files?: any;
        body: any;
        formData: any;
        queries?: object;
        redirects?: any;
        maxRedirects: number;
        headers: any;
    };
    response: {
        time: string;
        status: number;
        statusText: string | number;
        headers: any;
        buffered: boolean;
        redirects: string[];
        data: any;
        files: any;
    };
}
/**
 * A base class for API helper
 */
export default class apiHelper {
    protected instance: object;
    protected baseUrl: string;
    protected auth: string;
    protected authType: string;
    protected headers: object;
    protected cookies: string[];
    protected redirect: number;
    protected timeout: number;
    protected proxy: any;
    protected responseType: string;
    protected accept: string;
    protected cacheControl: string;
    protected connection: string;
    constructor(config: apiConfig);
    protected mapReqResp(input: superagentTypes.Request, inputOrig: object, output: superagentTypes.Response, requestTime: string, responseTime: string): Promise<apiTest>;
    /**
     * Send GET request
     * @param {string} endpoint end point to the base url
     * @param {object} parameters Optional. parameters to be sent with the request
     * @return {apiTest} An object containing config, request and response details
     */
    getRequest(endpoint: string, query?: object): Promise<apiTest>;
    /**
     * Send POST request
     * @param {string} endpoint end point to the base url
     * @param {object} query Optional. parameters to be sent with the request
     * @param {string} body end point to the base url
     * @param {string} file any attachments to be added to the request
     * @return {apiTest} An object containing config, request and response details
     */
    postRequest(endpoint: string, query?: object, body?: object | string | string[], file?: string[]): Promise<apiTest>;
    /**
     * Send PUT request
     * @param {string} endpoint end point to the base url
     * @param {object} query Optional. parameters to be sent with the request
     * @param {string} body end point to the base url
     * @param {string} file any attachments to be added to the request
     * @return {apiTest} An object containing config, request and response details
     */
    putRequest(endpoint: string, query?: object, body?: object | string | string[], file?: string[]): Promise<apiTest>;
    /**
     * Send DELETE request
     * @param {string} endpoint end point to the base url
     * @param {object} query Optional. parameters to be sent with the request
     * @param {string} body end point to the base url
     * @return {apiTest} An object containing config, request and response details
     */
    deleteRequest(endpoint: string, query?: object, body?: object | string | string[]): Promise<apiTest>;
}
//# sourceMappingURL=apiHelper.d.ts.map