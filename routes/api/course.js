var async = require('async');
var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();

/**
*
*/
exports.study = function (req, res) {
    var self = this;

    middleware.requireUserCME(req, res, function (error) {
        if (error) {
            res.flash('error', error);
            res.redirect('login');
        } else {
            request({
                url: 'http://cmeapp.91huayi.com/Exam/IsShowQuestion',
                data: {
                    relationId: req.body.chapterId
                },
                form: {
                    relationId: req.body.chapterId
                },
                method: 'POST',
                json: true,
                headers: {
                    'Cookie': req.cookies.cme,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                jar: jar,
            }, function (error, response, body) {
                res.cookie('cme', jar.getCookieString('http://cmeapp.91huayi.com/Exam/IsShowQuestion'));
                
                request({
                    url: 'http://cmeapp.91huayi.com/Exam/IsExamResult?score=1',
                    method: 'GET',
                    json: true,
                    headers: {
                        'Cookie': req.cookies.cme
                    }
                }, function (error, response, body) {
                    if (error) {
                        return res.apiResponse({ success: false, message: '服务器出现了问题' });
                    }

                    if (body && body.hasOwnProperty('Success') && body.Success === false) {
                        return res.apiResponse({ success: false, message: body.Message || '后台出现了问题' });
                    }

                    return res.apiResponse({ success: true });
                });
            });
        }
    });
};