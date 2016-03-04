title: AngularJS动态加载Controller
date: 2016-03-04 00:19:47
tags: angularjs
categories: technology

---

AngularJS原生并不支持动态加载Controller的方法，但是却提供注册Controller的方法。接下来就来看下如何实现动态加载Controller。

<!-- more -->

我们把实现动态加载Controller方法封装到一个通用的模块里面，并命名这个模块为`ngCommon`。

```javascript
(function (angular) {'use strict';
    var CommonApp = angular.module('ngCommon');
    ...
})(angular);
```

接下来我们实现一个动态加载js的方法`$require`。

```javascript
/* 记录已加载的js */
var loaded = {};
/* 检测是否加载 */
var checkLoaded = function (url) {
    return !url || !angular.isString(url) || loaded[url];
};

CommonApp.factory('$require', ['$document', '$q', '$rootScope', function ($document, $q, $rootScope) {
    return function (url) {
        var script = null;
        var onload = null;
        var doc = $document[0];
        var body = doc.body;
        var deferred = $q.defer();
        if (checkLoaded(url)) {
            deferred.resolve();
        } else {
            script = doc.createElement('script');
            onload = function (info) {
                if (info === 1) {
                    deferred.reject();
                } else {
                    loaded[url] = 1;
                    /* AngularJS < 1.2.x 请使用$timeout */
                    $rootScope.$evalAsync(function () {
                        deferred.resolve();
                    });
                }
                script.onload = script.onerror = null;
                body.removeChild(script);
                script = null;
            };
            script.onload = onload;
            script.onerror = function () {
                onload(1);
            };
            script.async = true;
            script.src = url;
            body.appendChild(script);
        }
        return deferred.promise;
    };
}]);
```

然后重点来了，通过`$routeProvider route`的`resolve`功能来实现动态加载Controller。

```javascript
CommonApp.provider('$routeResolver', function () {
    this.$get = function () {
        return this;
    };
    this.route = function (routeCnf) {
        var controller = routeCnf.controller;
        var controllerUrl = routeCnf.controllerUrl;
        if (controllerUrl) {
            routeCnf.reloadOnSearch = routeCnf.reloadOnSearch || false;
            routeCnf.resolve = {
                load: ['$route', '$require', 'ControllerChecker',
                    function ($route, $require, ControllerChecker) {
                        var controllerName = angular.isFunction(controller) ? controller($route.current.params) : controller;
                        var url = angular.isFunction(controllerUrl) ? controllerUrl($route.current.params) : controllerUrl;
                        if (checkLoaded(url) || (controllerName && ControllerChecker.exists(controllerName))) {
                            loaded[url] = true;
                            return;
                        }
                        return $require(url);
                }]
            };
        }
        return routeCnf;
    };
})
```

看上面的代码中还注入了一个叫`ControllerChecker`的，这个是用来检测当前Controller是否已经注册了，如果未注册，那么我们就加载相关js注册新的Controller。代码如下：

```javascript
CommonApp.service('ControllerChecker', ['$controller', function ($controller) {
    return {
        exists: function (controllerName) {
            if (angular.isFunction(window[controllerName])) {
                return true;
            }
            try {
                $controller(controllerName, {}, true);
                return true;
            } catch (e) {
                return false;
            }
        }
    };
}]);
```

最后我们来添加一个注动态册的方法。

```javascript
CommonApp.setupRegister = function (module) {
    module.config([
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
            module.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service,
                value: $provide.value,
                constant: $provide.constant
            };
        }
    ]);
};
```


到此已经基本完成了，如何使用呢？

```javascript
var DemoApp = angular.module('DemoApp',['ngRoute','ngCommon']);
/* 调用动态注册方法，为当前模块添加动态注册方法 */
angular.module('ngCommon').setupRegister(DemoApp);
DemoApp.config(['$routeProvider', '$routeResolverProvider', function ($routeProvider, $routeResolverProvider) {
    var route = $routeResolverProvider.route;
    $routeProvider.when('/index', route({
        templateUrl: './view/index.html'),
        controller: 'IndexController', /* 在此申明了controller就不需要再html里面申明ng-controller了 */
        controllerUrl: './controller/index.js')
    }))
    .otherwise('/index');

/* ./controller/index.js */
DemoApp.register.controller('IndexController', ['$scope', '$require', function($scope, $require) {
    ...
    /* 动态加载某个js文件 */
    $require(url).then(function () {
        ...
    });
}]);
```