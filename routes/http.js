var _ = require('lodash');
var request = require('request');
var jar = request.jar();
var keystone = require('keystone');
var async = require('async');

var generatorCookie = function (aspAuthoration, aspSessionID) {
    return aspAuthoration + ";" + (aspSessionID || '');
}

/**
 * 创建 http 请求器
 */
function HttpFactory() {
}


HttpFactory.prototype = {
    constructor: HttpFactory,
    createManagerHttp: function (req, aspAuthoration, httpCallback) {
        var request1 = function (callback) {
            request({
                url: 'http://zshy.91huayi.com/Project/GoProject',
                method: 'POST',
                json: true,
                json: {
                    id: "7b163987-de4e-4bae-a054-2b12c8bf0d84"
                },
                headers: {
                    "androidversion_xyz": 13,
                    "appid_android": "39BF80FD3C68EED63FE07C6F44AD6102",
                    'Cookie': generatorCookie(aspAuthoration)
                },
                jar: jar
            }, function (error, response, body) {
                if (body && body.error === 0) {
                    callback(null, body.url);
                } else {
                    callback('发生了一点错误，请重新登录');
                }
            });
        };


        var request2 = function (tokenUrl, callback) {
            request({
                url: tokenUrl,
                method: 'GET',
                jar: jar
            }, function (error, response, body) {
                callback(null, tokenUrl);
            });
        }

        var request3 = function (tokenUrl, callback) {
            var loginUrl = "http://app.kjpt.91huayi.com/handler/appuserlogin.ashx?para=" + tokenUrl.split('?para=')[1];
            request({
                url: loginUrl,
                method: 'GET',
                headers: {
                    "Cookie": aspAuthoration
                },
                jar: jar,
            }, function (error, response, body) {
                callback(null, jar.getCookieString(tokenUrl));
            });
        }

        if (req.session.aspAuthoration && req.session.aspManageressionID) {
            var http = new Http(req.session.aspAuthoration, req.session.aspManageressionID);
            req.session.save();

            httpCallback(null, http);
        } else {
            async.waterfall([request1, request2, request3], function (error, aspManageressionID) {
                if (error) {
                    httpCallback(error.message || '发生了一点错误');
                } else {
                    var http = new Http(aspAuthoration, aspManageressionID);
                    req.session.aspAuthoration = aspAuthoration;
                    req.session.aspManageressionID = aspManageressionID;

                    req.session.save();
                    httpCallback(null, http);
                }
            });
        }

    },

    createStarterHttp: function (req, aspAuthoration, deviceID, callback) {
        request1 = function (callback) {
            request({
                url: 'http://zshy.91huayi.com/Home/androidversion?version=13&appid=' + deviceID,
                json: true,
                method: 'GET',
                forever: true,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "androidversion_xyz": 13,
                    "appid_android": deviceID,
                    'Cookie': generatorCookie(aspAuthoration)
                },
                jar: jar
            }, function (error, response, body) {
                callback(null);
            });
        }


        var request2 = function (callback) {
            request({
                url: 'http://zshy.91huayi.com/Project/GoProject',
                json: true,
                method: 'POST',
                forever: true,
                json: {
                    id: "8722f9e9-8f75-43c6-93a6-9addd90878ea"
                },
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "androidversion_xyz": 13,
                    "appid_android": deviceID,
                    'Cookie': generatorCookie(aspAuthoration)
                },
                jar: jar
            }, function (error, response, body) {
                callback(null, body.url);
            });
        };


        var request3 = function (tokenUrl, callback) {
            request({
                url: tokenUrl,
                method: 'GET',
                headers: {
                    "androidversion_xyz": 13,
                    "appid_android": deviceID,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4",
                    "X-Requested-With": "com.huayi.cme",
                    "Accept-Language": "zh-CN,en-US;q=0.8"
                },
                jar: jar
            }, function (error, response, body) {
                callback(null, jar.getCookieString(tokenUrl));
            });
        }


        if (req.session.aspAuthoration && req.session.aspStarterSessionID) {
            var http = new Http(req.session.aspAuthoration, req.session.aspStarterSessionID);
            req.session.save();

            callback(null, http);
        } else {
            async.waterfall([request1, request2, request3], function (error, aspStarterSessionID) {
                if (error) {
                    callback(error.message || '发生了一点错误');
                } else {
                    var http = new Http(aspAuthoration, aspStarterSessionID);
                    req.session.aspAuthoration = aspAuthoration;
                    req.session.aspStarterSessionID = aspStarterSessionID;
                    req.session.save();

                    callback(null, http);
                }
            });
        }
    }
}

exports.HttpFactory = HttpFactory;

function Http(aspAuthoration, aspSessionID) {
    this.aspAuthoration = aspAuthoration;
    this.aspSessionID = aspSessionID;
}

Http.prototype = {
    get: function (url, callback) {
        request({
            url: url,
            method: 'GET',
            json: true,
            headers: {
                'Cookie': this.aspSessionID
            }
        }, function (error, response, body) {
            if (error) {
                return next('服务器出现了问题');
            }

            if (body && body.hasOwnProperty('Success') && body.Success === false) {
                return callback(body.Message || '后台出现了问题');
            }

            return callback(null, body);
        });
    },

    post: function (url, formData, callback) {
        request({
            url: url,
            method: 'POST',
            json: true,
            headers: {
                'Cookie': this.aspSessionID
            }
        }, function (error, response, body) {
            if (error) {
                return next('服务器出现了问题');
            }

            if (body && body.hasOwnProperty('Success') && body.Success === false) {
                return callback(body.Message || '后台出现了问题');
            }


            return callback(null, body);
        });

    }
}

exports.Http = Http;


