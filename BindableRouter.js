var Marionette = require('backbone.marionette');
var _ = require('lodash');

var bindingParam = /(\(\?)?\@\w+/g;
var allParams = /((\(\?)?\@\w+)|((\(\?)?:\w+)|((\(\?)?\*\w+)/g;

module.exports = Marionette.AppRouter.extend({

	_routeToRegExp: function(route) {
		route = Marionette.AppRouter.prototype._routeToRegExp.call(this, route).source;
		route = route.replace(bindingParam, function(match, optional) {
			return optional ? match : '([^/?]+)';
		});
		return new RegExp(route);
	},

	_registerRouteParams: function(route) {
		_.map(route.match(allParams), _.bind(this._registerRouteParam, this, route));
	},

	_registerRouteParam: function(route, param, i) {
		this.params = this.params || {};
		this.params[route] = this.params[route] || {};
		var paramMethod = param.slice(1);
		if (bindingParam.test(param) && _.isFunction(this.controller[paramMethod])) {
			this.params[route][i] = this.controller[paramMethod];
		}
	},

	route: function(route, name, callback) {
		if (!_.isRegExp(route)) this._registerRouteParams(route);
		Marionette.AppRouter.prototype.route.call(this, route, name, callback);
		return this;
	},

	_mapParam: function(route, param, i) {
		if (!_.isNull(param) && _.isFunction(this.params[route][i])) {
			return this.params[route][i](param);
		}
		return param;
	},

	execute: function(callback, args, name) {
		var route = _.invert(this.appRoutes)[name];
		args = _.map(args, _.bind(this._mapParam, this, route));
		Marionette.AppRouter.prototype.execute.call(this, callback, args, name);
	}

});