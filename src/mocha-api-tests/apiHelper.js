"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const superagent = require('superagent');
const moment = require('moment');
const path = require('path');
/**
 * A base class for API helper
 */
class apiHelper {
    instance;
    baseUrl;
    auth;
    authType;
    headers;
    cookies;
    redirect;
    timeout;
    proxy;
    responseType;
    accept;
    cacheControl;
    connection;
    constructor(config) {
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
    async mapReqResp(input, inputOrig, output, requestTime, responseTime) {
        const request = {
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
        const response = {
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
    async getRequest(endpoint, query) {
        const reqTime = moment().local().format('HH:mm:ss.SSS');
        let request;
        let response;
        try {
            request = superagent.get(`${this.baseUrl}/${endpoint}`);
            if (query) {
                for (const q in query) {
                    request.query(`${q}=${query[q]}`);
                }
            }
            request.set('Content-Type', 'application/json').timeout(this.timeout || 1500).retry(0);
            if (this.authType !== undefined) {
                if (this.authType === 'basic')
                    request.set('Authorization', `Basic ${this.auth}`);
                else if (this.authType === 'bearer')
                    request.set('Authorization', `Bearer ${this.auth}`);
                else if (this.authType === 'x-api-key')
                    request.set('X-API-Key', this.auth);
                else
                    request.set('Authorization', this.auth);
            }
            if (this.cookies !== undefined)
                request.set('Cookie', this.cookies);
            if (this.responseType !== undefined)
                request.set('Response', this.responseType);
            if (this.proxy !== undefined)
                request.auth['proxy'] = this.proxy;
            if (this.redirect !== undefined)
                request.redirects(this.redirect);
            if (this.accept !== undefined)
                request.set('Accept', this.accept);
            if (this.connection !== undefined)
                request.set('Connection', this.connection);
            if (this.cacheControl !== undefined)
                request.set('Cache Control', this.cacheControl);
            // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
            const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
                return [key, value];
            }));
            response = await request.ok(res => res.status < 600);
            const respTime = moment().local().format('HH:mm:ss.SSS');
            return this.mapReqResp(request, reqOrig, response, reqTime, respTime);
        }
        catch (error) {
            if (error instanceof Error)
                console.error(`ERROR: GET Request - ${error.message}`);
            else
                console.error(`ERROR: GET Request - ${error}`);
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
    async postRequest(endpoint, query, body, file) {
        const reqTime = moment().local().format('HH:mm:ss.SSS');
        let request;
        let response;
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
                if (this.authType === 'basic')
                    request.set('Authorization', `Basic ${this.auth}`);
                else if (this.authType === 'bearer')
                    request.set('Authorization', `Bearer ${this.auth}`);
                else if (this.authType === 'x-api-key')
                    request.set('X-API-Key', this.auth);
                else
                    request.set('Authorization', this.auth);
            }
            if (this.cookies !== undefined)
                request.set('Cookie', this.cookies);
            if (this.responseType !== undefined)
                request.set('Response', this.responseType);
            if (this.proxy !== undefined)
                request.auth['proxy'] = this.proxy;
            if (this.redirect !== undefined)
                request.redirects(this.redirect);
            if (this.accept !== undefined)
                request.set('Accept', this.accept);
            if (this.connection !== undefined)
                request.set('Connection', this.connection);
            if (this.cacheControl !== undefined)
                request.set('Cache Control', this.cacheControl);
            // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
            const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
                return [key, value];
            }));
            response = await request.ok(res => res.status < 600);
            const respTime = moment().local().format('HH:mm:ss.SSS');
            return this.mapReqResp(request, reqOrig, response, reqTime, respTime);
        }
        catch (error) {
            if (error instanceof Error)
                console.error(`ERROR: POST Request - ${error.message}`);
            else
                console.error(`ERROR: POST Request - ${error}`);
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
    async putRequest(endpoint, query, body, file) {
        const reqTime = moment().local().format('HH:mm:ss.SSS');
        let request;
        let response;
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
                if (this.authType === 'basic')
                    request.set('Authorization', `Basic ${this.auth}`);
                else if (this.authType === 'bearer')
                    request.set('Authorization', `Bearer ${this.auth}`);
                else if (this.authType === 'x-api-key')
                    request.set('X-API-Key', this.auth);
                else
                    request.set('Authorization', this.auth);
            }
            if (this.cookies !== undefined)
                request.set('Cookie', this.cookies);
            if (this.responseType !== undefined)
                request.set('Response', this.responseType);
            if (this.proxy !== undefined)
                request.auth['proxy'] = this.proxy;
            if (this.redirect !== undefined)
                request.redirects(this.redirect);
            if (this.accept !== undefined)
                request.set('Accept', this.accept);
            if (this.connection !== undefined)
                request.set('Connection', this.connection);
            if (this.cacheControl !== undefined)
                request.set('Cache Control', this.cacheControl);
            // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
            const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
                return [key, value];
            }));
            response = await request.ok(res => res.status < 600);
            const respTime = moment().local().format('HH:mm:ss.SSS');
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
    async deleteRequest(endpoint, query, body) {
        const reqTime = moment().local().format('HH:mm:ss.SSS');
        let request;
        let response;
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
                if (this.authType === 'basic')
                    request.set('Authorization', `Basic ${this.auth}`);
                else if (this.authType === 'bearer')
                    request.set('Authorization', `Bearer ${this.auth}`);
                else if (this.authType === 'x-api-key')
                    request.set('X-API-Key', this.auth);
                else
                    request.set('Authorization', this.auth);
            }
            if (this.cookies !== undefined)
                request.set('Cookie', this.cookies);
            if (this.responseType !== undefined)
                request.set('Response', this.responseType);
            if (this.proxy !== undefined)
                request.auth['proxy'] = this.proxy;
            if (this.redirect !== undefined)
                request.redirects(this.redirect);
            if (this.accept !== undefined)
                request.set('Accept', this.accept);
            if (this.connection !== undefined)
                request.set('Connection', this.connection);
            if (this.cacheControl !== undefined)
                request.set('Cache Control', this.cacheControl);
            // hack to show queries in mapReqResp output. Once request is submitted, this value is cleared out
            const reqOrig = Object.fromEntries(Object.entries(request).map(([key, value]) => {
                return [key, value];
            }));
            response = await request.ok(res => res.status < 600);
            const respTime = moment().local().format('HH:mm:ss.SSS');
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
exports.default = apiHelper;
