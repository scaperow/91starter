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
            http.get('http://cmeapp.91huayi.com/Course/GetCourseWareList?courseId=' + (req.query.courseId || ''), function (error, chapters) {
                if (error) {
                    req.flash('error', error);
                } else {
                    locals.chapters = chapters;
                    view.render('chapter_list');
                }
            })
        }
    });

};
