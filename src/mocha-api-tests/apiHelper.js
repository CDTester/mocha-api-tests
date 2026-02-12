"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var superagent = require('superagent');
var moment = require('moment');
var path = require('path');
/**
 * A base class for API helper
 */
var apiHelper = /** @class */ (function () {
    function apiHelper(config) {
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
    apiHelper.prototype.mapReqResp = function (inputOrig, requestTime, responseTime) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                request = {
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
                response = {
                    time: responseTime,
                    headers: this.response.headers,
                    buffered: this.response['buffered'],
                    redirects: this.response.redirects,
                    status: this.response.status,
                    statusText: this.response['res']['statusMessage'],
                    data: this.response.body,
                    files: this.response.files
                };
                return [2 /*return*/, { request: request, response: response }];
            });
        });
    };
    apiHelper.prototype.setAuth = function () {
        if (this.authType !== undefined) {
            if (this.authType === 'basic')
                this.request.set('Authorization', "Basic ".concat(this.auth));
            else if (this.authType === 'bearer')
                this.request.set('Authorization', "Bearer ".concat(this.auth));
            else if (this.authType === 'x-api-key')
                this.request.set('X-API-Key', this.auth);
            else
                this.request.set('Authorization', this.auth);
        }
    };
    apiHelper.prototype.setCookies = function () {
        if (this.cookies !== undefined)
            this.request.set('Cookie', this.cookies);
    };
    apiHelper.prototype.setHeaders = function () {
        this.request.set('Content-Type', 'application/json').timeout(this.timeout || 1500).retry(0);
        if (this.responseType !== undefined)
            this.request.set('Response', this.responseType);
        if (this.proxy !== undefined)
            this.request.auth['proxy'] = this.proxy;
        if (this.redirect !== undefined)
            this.request.redirects(this.redirect);
        if (this.accept !== undefined)
            this.request.set('Accept', this.accept);
        if (this.connection !== undefined)
            this.request.set('Connection', this.connection);
        if (this.cacheControl !== undefined)
            this.request.set('Cache Control', this.cacheControl);
    };
    /**
     * Send GET request
     * @param {string} endpoint end point to the base url
     * @param {object} parameters Optional. parameters to be sent with the request
     * @return {apiTest} An object containing config, request and response details
     */
    apiHelper.prototype.getRequest = function (endpoint, query) {
        return __awaiter(this, void 0, void 0, function () {
            var reqTime, q, reqOrig, _a, respTime, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reqTime = moment().local().format('HH:mm:ss.SSS');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.request = superagent.get("".concat(this.baseUrl, "/").concat(endpoint));
                        if (query) {
                            for (q in query) {
                                this.request.query("".concat(q, "=").concat(query[q]));
                            }
                        }
                        this.setAuth();
                        this.setCookies();
                        this.setHeaders();
                        reqOrig = Object.fromEntries(Object.entries(this.request).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return [key, value];
                        }));
                        _a = this;
                        return [4 /*yield*/, this.request.ok(function (res) { return res.status < 600; })];
                    case 2:
                        _a.response = _b.sent();
                        respTime = moment().local().format('HH:mm:ss.SSS');
                        return [2 /*return*/, this.mapReqResp(reqOrig, reqTime, respTime)];
                    case 3:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error)
                            console.error("ERROR: GET Request - ".concat(error_1.message));
                        else
                            console.error("ERROR: GET Request - ".concat(error_1));
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send POST request
     * @param {string} endpoint end point to the base url
     * @param {object} query Optional. parameters to be sent with the request
     * @param {string} body end point to the base url
     * @param {string} file any attachments to be added to the request
     * @return {apiTest} An object containing config, request and response details
     */
    apiHelper.prototype.postRequest = function (endpoint, query, body, file) {
        return __awaiter(this, void 0, void 0, function () {
            var reqTime, q, filePath, reqOrig, _a, respTime, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reqTime = moment().local().format('HH:mm:ss.SSS');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.request = superagent.post("".concat(this.baseUrl, "/").concat(endpoint));
                        if (query !== undefined) {
                            for (q in query) {
                                this.request.query("".concat(q, "=").concat(query[q]));
                            }
                        }
                        if (body !== undefined) {
                            this.request.send(body);
                        }
                        if (file !== undefined) {
                            filePath = path.resolve.apply(path, file);
                            this.request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
                        }
                        this.setAuth();
                        this.setCookies();
                        this.setHeaders();
                        reqOrig = Object.fromEntries(Object.entries(this.request).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return [key, value];
                        }));
                        _a = this;
                        return [4 /*yield*/, this.request.ok(function (res) { return res.status < 600; })];
                    case 2:
                        _a.response = _b.sent();
                        respTime = moment().local().format('HH:mm:ss.SSS');
                        return [2 /*return*/, this.mapReqResp(reqOrig, reqTime, respTime)];
                    case 3:
                        error_2 = _b.sent();
                        if (error_2 instanceof Error)
                            console.error("ERROR: POST Request - ".concat(error_2.message));
                        else
                            console.error("ERROR: POST Request - ".concat(error_2));
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send PUT request
     * @param {string} endpoint end point to the base url
     * @param {object} query Optional. parameters to be sent with the request
     * @param {string} body end point to the base url
     * @param {string} file any attachments to be added to the request
     * @return {apiTest} An object containing config, request and response details
     */
    apiHelper.prototype.putRequest = function (endpoint, query, body, file) {
        return __awaiter(this, void 0, void 0, function () {
            var reqTime, q, filePath, filePath, reqOrig, _a, respTime, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reqTime = moment().local().format('HH:mm:ss.SSS');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.request = superagent.put("".concat(this.baseUrl, "/").concat(endpoint));
                        if (query !== undefined) {
                            for (q in query) {
                                this.request.query("".concat(q, "=").concat(query[q]));
                            }
                        }
                        if (body !== undefined) {
                            this.request.send(body);
                        }
                        if (file !== undefined) {
                            filePath = path.resolve.apply(path, file);
                            this.request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
                        }
                        if (file !== undefined) {
                            filePath = path.resolve.apply(path, file);
                            this.request.set('Content-Type', 'multipart/form-data').attach('file', filePath);
                        }
                        this.setAuth();
                        this.setCookies();
                        this.setHeaders();
                        reqOrig = Object.fromEntries(Object.entries(this.request).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return [key, value];
                        }));
                        _a = this;
                        return [4 /*yield*/, this.request.ok(function (res) { return res.status < 600; })];
                    case 2:
                        _a.response = _b.sent();
                        respTime = moment().local().format('HH:mm:ss.SSS');
                        return [2 /*return*/, this.mapReqResp(reqOrig, reqTime, respTime)];
                    case 3:
                        error_3 = _b.sent();
                        if (error_3 instanceof Error) {
                            console.error("ERROR: POST Request - ".concat(error_3.message));
                        }
                        else {
                            console.error("ERROR: POST Request - ".concat(error_3));
                        }
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send DELETE request
     * @param {string} endpoint end point to the base url
     * @param {object} query Optional. parameters to be sent with the request
     * @param {string} body end point to the base url
     * @return {apiTest} An object containing config, request and response details
     */
    apiHelper.prototype.deleteRequest = function (endpoint, query, body) {
        return __awaiter(this, void 0, void 0, function () {
            var reqTime, q, reqOrig, _a, respTime, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reqTime = moment().local().format('HH:mm:ss.SSS');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.request = superagent.put("".concat(this.baseUrl, "/").concat(endpoint));
                        if (query !== undefined) {
                            for (q in query) {
                                this.request.query("".concat(q, "=").concat(query[q]));
                            }
                        }
                        if (body !== undefined) {
                            this.request.send(body);
                        }
                        this.setAuth();
                        this.setCookies();
                        this.setHeaders();
                        reqOrig = Object.fromEntries(Object.entries(this.request).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return [key, value];
                        }));
                        _a = this;
                        return [4 /*yield*/, this.request.ok(function (res) { return res.status < 600; })];
                    case 2:
                        _a.response = _b.sent();
                        respTime = moment().local().format('HH:mm:ss.SSS');
                        return [2 /*return*/, this.mapReqResp(reqOrig, reqTime, respTime)];
                    case 3:
                        error_4 = _b.sent();
                        if (error_4 instanceof Error) {
                            console.error("ERROR: POST Request - ".concat(error_4.message));
                        }
                        else {
                            console.error("ERROR: POST Request - ".concat(error_4));
                        }
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return apiHelper;
}());
exports.default = apiHelper;
