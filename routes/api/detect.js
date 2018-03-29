var async = require('async');
var keystone = require('keystone');
var request = require('request');
var _ = require('lodash');
var middleware = require('../middleware');
var Http = require('../http').Http;
var HttpFactory = require('../http').HttpFactory;
var h = require('../http');

var Account = keystone.list('Account');
var StudyHistory = keystone.list('StudyHistory');

/**
* 检测账户状态
*/
exports.checkAccount = function (req, res) {
    new HttpFactory().createStarterHttp(req, req.session.aspAuthoration, function (error, http) {
        http.post(middleware.Url.IS_LOGIN, null, function (error, account) {
            if (error) {
                res.apiResponse({
                    success: false,
                    message: error
                });
            } else {
                res.apiResponse({
                    success: false,
                    account: account
                });
            }
        });
    });
};

/**
 * 检测学习卡
 */
exports.checkCard = function (req, res) {
    new HttpFactory().createStarterHttp(req, req.session.aspAuthoration, function (error, http) {
        http.get(middleware.Url.IS_LOGIN, null, function (error, account) {
            if (error) {
                res.apiResponse({
                    success: false,
                    message: error
                });
            } else {
                res.apiResponse({
                    success: false,
                    account: account
                });
            }
        });
    });
}

/**
 * 检测往年的补修课
 */
exports.checkHistoryCourse = function (req, res) {
    new HttpFactory().createManagerHttp(req, req.session.aspAuthoration, function (error, http) {
        http.get(middleware.Url.LABEL_ALL, null, function (error, chapters) {
            if (error) {
                res.apiResponse({
                    success: false,
                    message: error
                });
            } else {
                res.apiResponse({
                    success: false,
                    chapters: chapters
                });
            }
        });
    });
}

/**
 * 检测最近三年的学分是否达标
 */
exports.checkCourseScore = function (req, res) {
    new HttpFactory().createManagerHttp(req, req.session.aspAuthoration, function (error, http) {
        if (error) {
            res.apiResponse({
                success: false,
                chapters: chapters
            });
        } else {
            var getScore = function (year, callback) {
                middleware.requestToAPP(
                    req,
                    res,
                    "http://app.kjpt.91huayi.com/handler/persondabiaoList.ashx?kindId=1&cmeyearId=" + year.cme_year_id,
                    'GET',
                    function (error, scores) {
                        if (error || !scores) {
                            callback(error || '获取分数时发生了错误');
                        } else {
                            callback(null, {
                                years: year.cme_year,
                                scores: scores
                            });
                        }
                    });
            }

            http.get(
                "http://app.kjpt.91huayi.com/handler/cmeYear.ashx",
                function (error, years) {
                    if (error || !years) {
                        res.apiResponse({
                            success: false,
                            message: error || "没有获取到年份信息"
                        });
                    }
                    else {
                        async.mapSeries(years, getScore, function (error, results) {
                            if (error) {
                                res.apiResponse({
                                    success: false,
                                    message: error
                                });
                            } else {
                                res.apiResponse({
                                    success: true,
                                    scores: results
                                });
                            }
                        });
                    }
                });
        }
    });

}