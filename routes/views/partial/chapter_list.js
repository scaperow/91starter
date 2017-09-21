var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    middleware.requestToCME(
        req,
        res,
        'http://cmeapp.91huayi.com/Course/GetCourseWareList?courseId=' + (req.query.courseId || ''),
        'GET',
        function (error, chapters) {
            if (error) {
                req.flash('error', error);
            } else {
                locals.chapters = chapters;
                view.render('chapter_list');
            }
        });
};
