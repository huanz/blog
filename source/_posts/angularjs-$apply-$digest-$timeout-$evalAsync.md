title: AngularJS $apply vs $timeout vs $digest vs $evalAsync
date: 2016-02-04 21:06:26
tags: angularjs
categories: technology
---

AngularJS提供很多自带的方法，如：`$apply`, `$timeout`, `$digest` 和 `$evalAsync`。这四个方法虽然很常见，但对于他们的差别以及如何正确使用有时候我们会感到有些困惑，因此我决定深入分析一下它们。

<!-- more -->

## $apply

这个核心方法可以让你显式启动`$digest`循环。这意味着所有的watcher将会被检测；整个应用启动$digest循环。在内部会执行一个可选的方法之后，会调用`$rootScope.$digest()`;。`$apply()`对机器来说是一个困难的处理过程，在绑定过多的时候可能会引发性能问题。

`$apply()`方法有两种调用形式。第一种会接受一个function作为参数，执行该function并且触发一轮`$digest`循环。第二种会不接受任何参数，只是触发一轮`$digest`循环。需要记住的是你总是应该使用接受一个function作为参数的`$apply()`方法。这是因为当你传入一个function到`$apply()`中的时候，这个function会被包装到一个`try…catch`块中，所以一旦有异常发生，该异常会被`$exceptionHandler` service处理。

那我们在什么情况下应该使用`$apply()`方法呢？

下面的例子中，第一段代码并不会更新ui上绑定的`message`变量，因为`setTimeout`并不是AngularJS原生的方法。


```javascript
function MyCtrl($scope) {
    $scope.message = "Hi";
      setTimeout(function () {
          $scope.message = "Hello!";
          // AngularJS unaware of update to $scope
      }, 2000);
}
function MyCtrl($scope) {
    $scope.message = "Hello";
      setTimeout(function () {
          $scope.$apply(function () {
              $scope.message = "Hi";
          });
      }, 2000);
}
```

在AngularJS中几乎你的所有代码都会包在$scope.$apply()中，Events像是ng-click, controller initialization, $http callbacks全部都是被`$scope.$apply()`给包住的。所以你不需要自己去调用`$scope.$apply()`。而且在`$scope.$apply()`中调用`$scope.$apply()`会出现错误。

所以真正会用到`$scope.$apply()`的情況是浏览器DOM events, setTimeout, XHR（XMLHttpREquest）或是第三方组件。

如果我们在应用中频繁调用`$apply`，可能会出现`$digest already in progress`的错误。这是因为一次`$digest`循环可能需要一段时间。我们可以通过`$timeout`或`$evalAsync`来解决这个问题。

## $digest

负责检查models和views之间的改变，然后同步更新UI和Model。

当一个`$digest`循环运行时，watchers会被执行来检查scope中的models是否发生了变化。如果发生了变化，那么相应的listener函数就会被执行。这涉及到一个重要的问题。如果listener函数本身会修改一个scope model呢？AngularJS会怎么处理这种情况？

答案是`$digest`循环不会只运行一次。在当前的一次循环结束后，它会再执行一次循环用来检查是否有models发生了变化。这就是脏检查(Dirty Checking)，它用来处理在listener函数被执行时可能引起的model变化。因此，`$digest`循环会持续运行直到model不再发生变化，或者`$digest`循环的次数达到了10次。因此，尽可能地不要在listener函数中修改model。

`$digest`循环最少也会运行两次，即使在listener函数中并没有改变任何model，它也会多运行一次来确保models没有变化。

当我们直接调用`$digest`方法时，它会在当前作用域和它的子项启动`$digest`循环。你需要注意他的父作用域将不会被检测也不会被影响。

所以如果你只需要更新当前的作用域或者它的子项的话，使用$digest，而且要防止在整个应用里运行新的`$digest`循环。这在性能上的好处是显而易见的。

## $timeout

如果你正在使用AngularJS 1.2.X之前的版本的话，那么`$timeout()`是用来处理Angular环境之外的代码更新scope绑定最简单有效的方法。

它是对`window.setTimeout`的包装，用来延迟执行一个函数。当我们在Controller中更改了数据模型时，此时DOM还没有得到更新（`$digest`循环还没开始）。如果我们希望DOM刷新后执行某些操作，就可以使用`$timeout`。

而且当`$timeout`异步完成后，AngularJS会自动触发`$apply`，当然你也可以在调用`$timeout`方法的时候传入第三个参数`false`不执行`$apply()`

调用`$timeout`并不会出现`$digest already in progress`的错误因为它会告知AngularJS当前`$digest`循环执行完毕之后有一个timeout在等待，以此确保`$digest`循环不会发生碰撞，因此`$timeout`将会开启一次新的`$digest`循环。

## $evalAsync

`$evalAsync()`方法是AngularJS 1.2.X之后加入的一个新方法，在我看来它就是更加灵活的`$timeout()`。调用`$evalAsync()`方法将在当前循环或下一个循环执行表达式。

假设你调用了多次`$evalAsync`，然后任一`$digest`循环都可能在同一时间执行。来自`$evalAsync`的表达式将会被加入到一个队列中去，这些表达式都将会是当前`$digest`循环的一部分，因此并不会有新的`$digest`循环执行。这就是为何`$evalAsync`更加高效，它把之前可能创建多次`$digest`循环的操作降低到了一次`$digest`循环处理。如果当前并没有`$digest`循环在执行的话，它就相当于`$timeout`，会创建一个默认`10ms`后执行的回调函数，`10ms`之后便会执行`$rootScope.$digest()`。

因此如果你正使用大于AngularJS 1.2.X版本，使用$evalAsync，这将提高你的应用的性能。