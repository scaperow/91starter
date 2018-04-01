var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();
exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };

    view.render('detect-result', {
        title: '华医网账号检测系统'
    });
};