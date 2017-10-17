var async = require('async');
var keystone = require('keystone');
var request = require('request');
var _ = require('lodash');
var middleware = require('../middleware');

var Account = keystone.list('Account');
var StudyHistory = keystone.list('StudyHistory');

/**
*
*/
exports.study = function (req, res) {
    var self = this;
    var courseId = req.body.courseId || '';
    var fetchCourseDetail = function (callback) {
        middleware.requestToCME(
            req,
            res,
            'http://cmeapp.91huayi.com/Course/LoadCourseDetails?courseId=' + courseId,
            'GET',
            function (error, course) {
                if (error || !course) {
                    callback(error || '当前课程存在问题,请联系售后解决');
                } else {
                    callback(error, course);
                }
            });
    };
    var canStudyCourse = function (results, callback) {
        Account.model.findById(req.session.account._id).exec(function (error, account) {
            if (error) {
                callback(error);
            } else {
                if (account) {
                    var assignNumber = parseInt(results.fetchCourseDetail.Assign_Num || 0);

                    if (account.balance <= assignNumber) {
                        callback('抱歉, 不能学习，您还需要充值' + (assignNumber - account.cost) + '学分');
                    } else {
                        callback(null, account);
                    }
                } else {
                    callback('您的账户存在问题');
                }
            }
        });
    };
    var fechAllChapters = function (callback) {
        middleware.requestToCME(
            req,
            res,
            'http://cmeapp.91huayi.com/Course/GetCourseWareList?courseId=' + courseId,
            'GET',
            function (error, chapters) {
                callback(error, chapters);
            });
    };
    var studyAllChapters = function (results, callback) {
        var chapters = results.fechAllChapters;
        var examIds = _.map(chapters, 'Relation_Id');

        async.map(examIds, function (examId, subCallback) {
            function action(examId, subCallback) {
                setTimeout(function () {
                    request({
                        url: 'http://cmeapp.91huayi.com/Course/GetStudyCourseWareData?courseWareid=' + examId + '&deptId=',
                        method: 'GET',
                        json: true,
                        headers: {
                            'Cookie': req.session.cookieme
                        }
                    }, function (error, response, body) {
                        if (error) {
                            return subCallback('服务器出现了问题');
                        }

                        if (body && body.hasOwnProperty('Success') && body.Success === false) {
                            return subCallback('服务器出现了问题');
                        }

                        return subCallback();
                    });
                }, 1500);
            }

            action(examId, subCallback);
        }, function (error, result) {
            callback(error, result);
        });
    };
    var takeOffBalance = function (results, callback) {
        var assignNumber = parseInt(results.fetchCourseDetail.Assign_Num || 0);
        results.canStudyCourse.balance = results.canStudyCourse.balance - assignNumber;
        results.canStudyCourse.save(function (error) {
            callback(error);
        });
    };
    var saveHistory = function (results, callback) {
        var model = StudyHistory.model({
            course: JSON.stringify(results.fetchCourseDetail),
            account: results.canStudyCourse.id,
            studyTime: new Date()
        });

        model.save(function (error) {
            callback(error);
        });
    };

    middleware.requireAccount(req, res, function () {
        var tasks = {};

        if (req.session.account) {
            tasks = {
                fetchCourseDetail: fetchCourseDetail,
                canStudyCourse: ['fetchCourseDetail', canStudyCourse],
                fechAllChapters: [fechAllChapters],
                studyAllChapters: ['fechAllChapters', studyAllChapters],
                takeOffBalance: req.session.user ? [] : ['canStudyCourse', 'fetchCourseDetail', takeOffBalance],
                saveHistory: ['fetchCourseDetail', 'canStudyCourse', saveHistory]
            };
        } else if (!req.session.account && req.session.user) {
            tasks = {
                fetchCourseDetail: fetchCourseDetail,
                fechAllChapters: [fechAllChapters],
                studyAllChapters: ['fechAllChapters', studyAllChapters]
            };
        } else {
            return res.apiResponse({
                success: false,
                message: '尚未登录'
            });
        }

        async.auto(tasks, function (error, results) {
            if (error) {
                res.apiResponse({
                    success: false,
                    message: error || '发生了一点错误'
                });
            } else {
                req.session.account = results.canStudyCourse;
                req.session.save();

                res.apiResponse({
                    success: true,
                    account: _.pick(results.canStudyCourse, 'balance')
                });
            }
        });

    });
};