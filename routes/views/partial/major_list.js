var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');
var jar = request.jar();

var GET_VALIDATE_CODE_URL = 'http://cmeapp.91huayi.com/UserInfo/GetCode';
var LOGIN_URL = 'http://cmeapp.91huayi.com/UserInfo/Login';

var getMajors = function (req, res, next) {
    middleware.requestUserToCME(
        req,
        res,
        'http://cmeapp.91huayi.com/Course/GetMajorList?level=' + (req.query.level || 2) + '&parentId=' + (req.query.majorId || ''),
        'GET',
        function (error, res) {
            next(error, res);
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
