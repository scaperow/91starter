var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');
var Http = require('../../http').Http;
var HttpFactory = require('../../http').HttpFactory;

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    new HttpFactory().createStarterHttp(req, req.session.aspAuthoration, req.session.deviceID,function (error, http) {
        if (error) {
            req.flash('error', error);
        } else {
            http.get('http://cmeapp.91huayi.com/Course/LoadCourseList?assign_type_id=&deptid=' + (req.query.majorId || '') + '&indexpage=' + (req.query.pageIndex || 1) + '&kind=2&order_by=&pageSize=' + (req.query.pageSize || 20) + ' &titleId=' + (req.query.titleId || ''),
                function (error, courses) {
                    if (error) {
                        req.flash('error', error);
                    } else {
                        locals.courses = courses;
                        view.render('course_list');
                    }
                }
            );
        }
    });
};
