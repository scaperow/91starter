var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();

var GET_VALIDATE_CODE_URL = 'http://cmeapp.91huayi.com/UserInfo/GetCode';
var LOGIN_URL = 'http://cmeapp.91huayi.com/UserInfo/Login';

var getMajors = function (req, res, next) {
    middleware.requestToCME(
        req,
        res,
        'http://cmeapp.91huayi.com/Course/GetMajorList?level=' + (req.query.level || 2) + '&parentId=' + (req.query.parentId || ''),
        'GET',
        function (error, res) {
            next(error, res);
        });
};

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.on('init', function (next) {
        getMajors(req, res, function (error, majors) {
            if (error) {
                req.flash('error', error);
            } else {
                locals.major_level = 2;
                locals.majors = majors;
            }

            next();
        });
    });

    view.on('init', function (next) {
        middleware.requestToCME(
            req,
            res,
            'http://cmeapp.91huayi.com/Course/GetLableAll?parentid=',
            'GET',
            function (error, titles) {
                if (error) {
                    req.flash('error', error);
                } else {
                    locals.titles = titles;
                }

                next();
            });
    });

    view.on('init', function (next) {
        middleware.requestToCME(
            req,
            res,
            'http://cmeapp.91huayi.com/Course/LoadCourseList?assign_type_id=&deptid=&indexpage=1&kind=2&order_by=&pageSize=5&titleId=',
            'GET',
            function (error, courses) {
                if (error) {
                    req.flash('error', error);
                } else {
                    locals.courses = courses;
                }

                next();
            });
    });

    view.render('learn');

};
