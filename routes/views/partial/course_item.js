var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    middleware.requestToCME(
        req,
        res,
        'http://cmeapp.91huayi.com/Course/LoadCourseDetails?courseId=' + req.query.courseId,
        'GET',
        function (error, course) {
            if (error) {
                req.flash('error', error);
            } else {
                locals.course = course;
                view.render('course_item');
            }
        });
};
