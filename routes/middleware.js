

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
var Http = require("./http").Http;
var HttpFactory = require("./http").HttpFactory;

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		/*
		{ label: '开始学习', key: 'learn', href: '/learn' },
		{ label: '余额充值', key: 'charge', href: '/charge' },
		{ label: '使用方法', key: 'tutorial', href: '/tutorial' },
		*/

		/*{ label: 'Blog', key: 'blog', href: '/blog' },	
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Contact', key: 'contact', href: '/	' },
		*/
	];
	// user for Keystone
	res.locals.user = req.user;
	// account for CME
	res.locals.account = req.session && req.session.account;
	// account for CME
	res.locals.userme = req.session && req.session.userme;
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

exports.theme = function (req, res, next) {
	res.locals.currentTheme = 'Lumen';
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

/**
 * 
 */
exports.requireAccount = function (req, res, next) {
	if (req.session.isLogin === true) {
		new HttpFactory().createStarterHttp(req, req.session.aspAuthoration,req.session.deviceID, function (error, http) {
			if (error) {
				req.flash('error', error);
			} else {
				http.get('http://cmeapp.91huayi.com/UserInfo/IsLogin',
					function (error, body) {
						if (body && body.Success && body.Data) {
							next();
						} else {
							next('请重新登陆到华医网');
						}
					}
				);
			}
		});
	} else {
		next('请登录');
	}
};

exports.handlerAjaxRequireAccount = function (req, res, next) {
	if (exports.requireAccount(req, res, function (error) {
		if (error) {
			res.status(401);
		} else {
			next();
		}
	}));
};

exports.handlerDirectRequireAccount = function (req, res, next) {
	if (exports.requireAccount(req, res, function (error) {
		if (error) {
			req.flash('error', '请重新登录');
			res.redirect('/login');
		} else {
			next();
		}
	}));
};

exports.Url = {
	// 登录时验证码的地址
	GET_VALIDATE_CODE_URL: 'http://cmeapp.91huayi.com/UserInfo/GetCode',
	// 登录
	LOGIN_URL: 'http://cmeapp.91huayi.com/UserInfo/Login',
	// 验证账户是否登录了
	IS_LOGIN: 'http://cmeapp.91huayi.com/UserInfo/IsLogin',
	// 获取所有学分卡
	ALL_CARD: 'http://cmeapp.91huayi.com/Card/GetAllCard',
	// 获取所有类目
	LABEL_ALL: "http://cmeapp.91huayi.com/Course/GetLableAll?parentid=",
	// 获取所有的应用
	ALL_YING_YONG: "http://zshy.91huayi.com/m/index.html#/yingyong",
	// 获取某一个应用
	GET_YINGYONG: "http://zshy.91huayi.com/Project/GoProject",
	// 获取某一年的学分情况
	COURSE_SUMMARY: "http://app.kjpt.91huayi.com/scorestat/personScoreList.htm?startDt=2018-01-01&endDt=2018-03-26&checkState=",
	// 查询某一年的学分达标情况
	COURSE_STATE: ""
}


