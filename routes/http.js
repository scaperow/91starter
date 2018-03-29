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
    createManagerHttp: function (req, aspAuthoration, callback) {
        var request1 = function (callback) {
            request({
                url: 'http://zshy.91huayi.com/Project/GoProject',
                method: 'POST',
                json: true,
                form: {
                    id: "8722f9e9-8f75-43c6-93a6-9addd90878ea"
                },
                headers: {
                    'Cookie': generatorCookie(aspAuthoration)
                },
                jar: jar
            }, function (error, response, body) {
                var responseBody = JSON.parse(body);
                if (responseBody && responseBody.error === 0) {
                    //var aspAuthoration = jar.getCookieString('http://zshy.91huayi.com/Project/GoProject');
                    //req.session.cookieasp = cookieasp;
                    //req.session.save();

                    callback(null, responseBody.url);
                } else {
                    callback('发生了一点错误，请重新登录');
                }
            });
        };


        var request2 = function (tokenUrl, callback) {
            request({
                url: tokenUrl,
                method: 'GET',
                headers: {
                    'Cookie': generatorCookie(aspAuthoration)
                },
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
                    'Cookie': generatorCookie(aspAuthoration)
                },
                jar: jar
            }, function (error, response, body) {
                callback(null, jar.getCookieString(loginUrl));
            });
        }

        if (req.session.managerHttp) {
            callback(null, req.session.managerHttp);
        } else {
            async.waterfall([request1, request2, request3], function (error, result) {
                if (error) {
                    callback(error.message || '发生了一点错误');
                } else {
                    var http = new Http(this.aspAuthoration, result);
                    req.session.managerHttp = http;

                    req.session.save();
                }
            });
        }
    },

    createStarterHttp: function (req, aspAuthoration, callback) {

        var request1 = function (callback) {
            request({
                url: 'http://zshy.91huayi.com/Project/GoProject',

                json: true,
                method: 'POST',
                form: {
                    id: "8722f9e9-8f75-43c6-93a6-9addd90878ea"
                },
                headers: {
                    "androidversion_xyz": 13,
                    "appid_android": "39BF80FD3C68EED63FE07C6F44AD6102",
                    'Cookie': generatorCookie(aspAuthoration)
                },
                jar: jar
            }, function (error, response, body) {

                callback(null, body.url);
            });
        };


        var request2 = function (tokenUrl, callback) {
            request({
                url: tokenUrl,
                method: 'GET',
                headers: {
                    "androidversion_xyz": 13,
                    "appid_android": "39BF80FD3C68EED63FE07C6F44AD6102",
                },
                jar: jar
            }, function (error, response, body) {
                callback(null, jar.getCookieString(tokenUrl));
            });
        }

        var beforeRequest3 = function (sessionID, callback) {
            request({
                url: "http://cmeapp.91huayi.com/CMEAPP/scripts/js/maps/swiper.min.js.map",
                method: 'GET',
                headers: {
                    'Cookie': sessionID,
                },
                jar: jar
            }, function (error, response, body) {
                callback(null, sessionID);
            });
        }

        var request3 = function (sessionID, callback) {
            request({
                url: "http://cmeapp.91huayi.com/UserInfo/GetUrl",
                method: 'GET',
                headers: {
                    'Cookie': sessionID,
                    "androidversion_xyz": 13,
                    "appid_android": "39BF80FD3C68EED63FE07C6F44AD6102",
                },
                jar: jar
            }, function (error, response, body) {
                callback(null, sessionID);
            });
        }

        var request4 = function (sessionID, callback) {
            request({
                url: "http://cmeapp.91huayi.com/CMEAPP/",
                method: 'GET',
                headers: {
                    'Cookie': sessionID,
                },
                jar: jar
            }, function (error, response, body) {
                callback(null, sessionID);
            });
        }


        if (req.session.managerHttp) {
            callback(null, req.session.managerHttp);
        } else {
            async.waterfall([request1, request2, request3, request4], function (error, result) {
                if (error) {
                    callback(error.message || '发生了一点错误');
                } else {
                    var http = new Http(this.aspAuthoration, "ASP.NET_SessionId=axcavggo1o3c4fpp4rwbmjzv");
                    req.session.starterHttp = http;
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


