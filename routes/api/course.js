var async = require('async');
var keystone = require('keystone');
var request = require('request');
var _ = require('lodash');
var middleware = require('../middleware');

var HttpFactory = require('../http').HttpFactory;
var Http = require('../http').Http;

/**
*
*/
exports.study = function (req, res) {
    var self = this;
    var courseId = req.body.courseId || '';
    var httpClient = null;
    var http = null;

    var fetchCourseDetail = function (callback) {
        httpClient.get('http://cmeapp.91huayi.com/Course/LoadCourseDetails?courseId=' + courseId, function (error, course) {
            if (error || !course) {
                callback(error || '当前课程存在问题,请联系售后解决');
            } else {
                callback(error, course);
            }
        });
    };
    var fechAllChapters = function (callback) {
        httpClient.get('http://cmeapp.91huayi.com/Course/GetCourseWareList?courseId=' + courseId, function (error, chapters) {
            callback(error, chapters);
        });
    };
    var studyAllChapters = function (results, callback) {
        var chapters = results.fechAllChapters;
        var examIds = _.map(chapters, 'Relation_Id');

        async.map(examIds, function (examId, subCallback) {
            function action(examId, subCallback) {
                httpClient.get('http://cmeapp.91huayi.com/Course/GetStudyCourseWareData?courseWareid=' + examId + '&deptId=', function (error, response, body) {
                    if (error) {
                        return subCallback('服务器出现了问题');
                    }

                    if (body && body.hasOwnProperty('Success') && body.Success === false) {
                        return subCallback('服务器出现了问题');
                    }

                    return subCallback();
                });
            }

            action(examId, subCallback);
        }, function (error, result) {
            callback(error, result);
        });
    };
    middleware.requireAccount(req, res, function () {
        var tasks = {};
        new HttpFactory().createStarterHttp(req, req.session.aspAuthoration, req.session.deviceID,function (error, http) {
            httpClient = http;
            if (error) {
                res.apiResponse({
                    success: false,
                    message: error
                });
            } else {
                httpClient = http;

                var tasks = {
                    fetchCourseDetail: fetchCourseDetail,
                    fechAllChapters: [fechAllChapters],
                    studyAllChapters: ['fechAllChapters', studyAllChapters]
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
            }
        });
    });
};