var async = require('async');
var keystone = require('keystone');
var request = require('request');
var _ = require('lodash');
var middleware = require('../middleware');
var jar = request.jar();


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
        var Account = keystone.list('Account');
        Account.model.findById(req.session.account.id).exec(function (error, account) {
            if (error) {
                callback(error);
            } else {

                var assignNumber = parseInt(results.fetchCourseDetail.Assign_Num || 0);

                if (account.balance <= assignNumber) {
                    callback('抱歉, 不能学习，您还需要充值' + (assignNumber - account.cost) + '学分');
                } else {
                    callback(null, account);
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
                            'Cookie': req.session.account.cookie
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
        var StudyHistory = keystone.list('StudyHistory');
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
        async.auto({
            fetchCourseDetail: fetchCourseDetail,
            canStudyCourse: ['fetchCourseDetail', canStudyCourse],
            fechAllChapters: [fechAllChapters],
            studyAllChapters: ['fechAllChapters', studyAllChapters],
            takeOffBalance: ['canStudyCourse', 'fetchCourseDetail', takeOffBalance],
            saveHistory: ['fetchCourseDetail', 'canStudyCourse', saveHistory]
        }, function (error, results) {
            if (error) {
                res.apiResponse({
                    success: false,
                    message: error || '发生了一点错误'
                });
            } else {
                res.apiResponse({
                    success: true,
                    account: _.pick(results.canStudyCourse, 'balance')
                });
            }
        });
    });
};