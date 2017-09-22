var keystone = require('keystone');
var request = require('request');
var middleware = require('../../middleware');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    view.render('personal');
};
