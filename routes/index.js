/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', middleware.handlerDirectRequireAccount, routes.views.learn);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	app.get('/personal', routes.views.partial.personal);
	app.get('/charge', routes.views.charge);
	app.get('/tutorial', routes.views.tutorial);

	app.get('/code', routes.views.validate_code);
	app.all('/login', routes.views.web_login);
	app.all('/detect', routes.views.detect);
	app.all('/detect-result', routes.views.detect_result);
	app.all('/detect-api/check-account', [keystone.middleware.api], routes.api.detect.checkAccount);
	app.all('/detect-api/check-card', [keystone.middleware.api], routes.api.detect.checkCard);
	app.all('/detect-api/check-history-course', [keystone.middleware.api], routes.api.detect.checkHistoryCourse);
	app.all('/detect-api/check-course-score', [keystone.middleware.api], routes.api.detect.checkCourseScore);

	app.all('/learn', middleware.handlerDirectRequireAccount, routes.views.learn);
	app.get('/learn/majors/:level?/:majorId?', routes.views.partial.major_list);
	app.get('/learn/courses', routes.views.partial.course_list);
	app.get('/learn/course', routes.views.partial.course_item);
	app.get('/learn/chapters', routes.views.partial.chapter_list);
	app.get('/learn/titles', routes.views.partial.title_list);
	app.post('/learn/exam', [middleware.handlerAjaxRequireAccount, keystone.middleware.api], routes.api.course.study);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
