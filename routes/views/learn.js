var keystone = require('keystone');
var middleware = require('../middleware');
var Http = require('../http').Http;
var HttpFactory = require('../http').HttpFactory;
var async = require('async');
exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var httpClient = null;

    var getMajors = function (callback) {
        httpClient.get('http://cmeapp.91huayi.com/Course/GetMajorList?level=' + (req.query.level || 2) + '&parentId=' + (req.query.parentId || ''), function (error, majors) {
            if (error) {
                req.flash('error', error);
            } else {
                locals.major_level = 2;
                locals.majors = majors;
                callback();
            }
        });
    };

    var getTitles = function (callback) {
        httpClient.get('http://cmeapp.91huayi.com/Course/GetLableAll?parentid=', function (error, titles) {
            if (error) {
                //req.flash('error', error);
                callback(error);
            } else {
                locals.titles = titles;
                callback();
            }
        });
    }

    var getCourses = function (callback) {
        httpClient.get('http://cmeapp.91huayi.com/Course/LoadCourseList?assign_type_id=&deptid=&indexpage=1&kind=2&order_by=&pageSize=5&titleId=', function (error, courses) {
            if (error) {
                //req.flash('error', error);
                callback(error);
            } else {
                if (error) {
                    req.flash('error', error);
                } else {
                    locals.courses = courses;
                    callback();
                }
            }
        });
    }

    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.on('init', function (next) {
        new HttpFactory().createStarterHttp(req, req.session.aspAuthoration, req.session.deviceID,function (error, http) {
            httpClient = http;
            if (error) {
                res.apiResponse({
                    success: false,
                    error: error || '错误'
                });
            } else {
                async.series([getMajors, getTitles, getCourses], function (error) {
                    if (error) {
                        res.apiResponse({
                            success: false,
                            error: error || '错误'
                        });
                    } else {
                        next();
                    }
                })
            }
        });
    });

    view.render('learn');
};
