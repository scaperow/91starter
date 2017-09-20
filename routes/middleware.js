/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var request = require('request');
var jar = request.jar();
var keystone = require('keystone');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: '首页', key: 'home', href: '/' },
		{ label: '学习', key: 'learn', href: '/learn' },

		/*{ label: 'Blog', key: 'blog', href: '/blog' },	
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Contact', key: 'contact', href: '/	' },
		*/
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

exports.requireUserCME = function (req, res, next) {
	if (req.cookies.cme) {
		request({
			url: 'http://cmeapp.91huayi.com/UserInfo/IsLogin',
			headers: {
				'Cookie': req.cookies.cme,
				'Content-Type': 'application/json; charset=utf-8'
			},
			json: true,
			method: 'GET',
			jar: jar
		}, function (error, response, body) {
			if (body && body.Success && body.Data) {
				next();
			} else {
				next('请重新登陆到华医网');
			}
		});
	} else {
		next('请登录到华医网');
	}
};

/**
 * 
 */
exports.requestToCME = function (req, res, url, method, next) {
	request({
		url: url,
		method: method || 'GET',
		json: true,
		jar: jar,
		headers: {
			'Cookie': req.cookies.cme
		}
	}, function (error, response, body) {
		if (error) {
			return next('服务器出现了问题');
		}

		if (body && body.hasOwnProperty('Success') && body.Success === false) {
			return next(body.Message || '后台出现了问题');
		}


		return next(null, body);
	});
};

/**
 * 
 */
exports.requestUserToCME = function (req, res, url, method, next) {
	var self = this;

	this.requireUserCME(req, res, function (error) {
		if (error) {
			req.flash('error', error);
			res.redirect('login');
		} else {
			self.requestToCME(req, res, url, method, next);
		}
	});
};

