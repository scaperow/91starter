var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');
var Http = require('../../http').Http;
var HttpFactory = require('../../http').HttpFactory;

var getMajors = function (req, res, next) {
    new HttpFactory().createStarterHttp(req, req.session.aspAuthoration, req.session.deviceID,function (error, http) {
        if (error) {
            req.flash('error', error);
        } else {
            http.get('http://cmeapp.91huayi.com/Course/GetMajorList?level=' + (req.query.level || 2) + '&parentId=' + (req.query.majorId || ''),
                function (error, res) {
                    next(error, res);
                }
            );
        }
    });
};


exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    getMajors(req, res, function (error, majors) {
        if (error) {
            res.send('发生错误');
        } else {
            locals.majors = majors;
            locals.major_level = 3;
            view.render('major_list');
        }
    });
};
