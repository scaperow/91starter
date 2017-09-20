var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    middleware.requestUserToCME(
        req,
        res,
        'http://cmeapp.91huayi.com/Course/GetLableAll?parentid=' + (req.query.titleId || ''),
        'GET',
        function (error, titles) {
            if (error) {
                req.flash('error', error);
            } else {
                locals.titles = titles;
                view.render('title_list');
            }
        });
};
