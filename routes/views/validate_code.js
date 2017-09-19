var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();
var GET_VALIDATE_CODE_URL = 'http://cmeapp.91huayi.com/UserInfo/GetCode';

exports = module.exports = function (req, res) {
    middleware.requireUser(req, res, function () {
        request({
            url: GET_VALIDATE_CODE_URL,
            encoding: null,
            headers: {
                'Cookie': req.cookies.cme_tmp
            }
        }, function (error, response, body) {
            res.set('Content-Type', 'image/png');
            res.send(body);
        });
    });
};
