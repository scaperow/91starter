var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    middleware.requestToCME(
        req,
        res,
        'http://cmeapp.91huayi.com/Course/LoadCourseList?assign_type_id=&deptid=' + (req.query.majorId || '') + '&indexpage=' + (req.query.pageIndex || 1) + '&kind=2&order_by=&pageSize=' + (req.query.pageSize || 20) + ' &titleId=' + (req.query.titleId || ''),
        'GET',
        function (error, courses) {
            if (error) {
                req.flash('error', error);
            } else {
                locals.courses = courses;
                view.render('course_list');
            }
        });
};
