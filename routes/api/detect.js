var async = require('async');
var keystone = require('keystone');
var request = require('request');
var _ = require('lodash');
var middleware = require('../middleware');

var Account = keystone.list('Account');
var StudyHistory = keystone.list('StudyHistory');

/**
* 检测账户状态
*/
exports.checkAccount = function (req, res) {
    middleware.requestToAPP(
        req,
        res,
        "http://zshy.91huayi.com/Account/myinfo",
        'POST',
        function (error, account) {
            res.apiResponse(account);
        });
};

/**
 * 检测学习卡
 */
exports.checkCard = function (req, res) {
    middleware.requestToAPP(
        req,
        res,
        middleware.Url.IS_LOGIN,
        'GET',
        function (error, account) {
            res.apiResponse(account);
        });
}

/**
 * 检测往年的补修课
 */
exports.checkHistoryCourse = function (req, res) {
    middleware.requestToAPP(
        req,
        res,
        middleware.Url.LABEL_ALL,
        'GET',
        function (error, chapters) {
            res.apiResponse(chapters);
        });
}

/**
 * 检测最近三年的学分是否达标
 */
exports.checkCourseScore = function(req, res) {
    // 获取所有的年份和对应的 id
    var getYears = function (callback) {
        middleware.requestToAPP(
            req,
            res,
            "http://app.kjpt.91huayi.com/handler/cmeYear.ashx?rd=0.034686032458067784",
            'GET',
            function (error, years) {
                if (error || !years) {
                    callback(error || "没有获取到年份信息");
                }
                else {
                    callback(null, years.slice(0, 2));
                }

            });
    }

    var getScore = function (year, callback) {
        middleware.requestToAPP(
            req,
            res,
            "http://app.kjpt.91huayi.com/scorestat/persondabiaoList.htm?years="+year.cme_year+"&cmeyearId="+year.cme_year_id+"&cme_year_message="+year.yearmessage,
            'GET',
            function (error, scores) {
                if (error || !scores) {
                    callback(error || '获取分数时发生了错误');
                } else {
                    callback(scores);
                }
            });
    }

    getYears(function (error, years) {
        if (error) {
            res.apiResponse({
                success: false,
                message: error
            });
        } else {
            async.map(years, getScore, function (error, results) {
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
    })


}