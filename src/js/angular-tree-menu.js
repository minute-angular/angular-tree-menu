///<reference path="../../../minute/_all.d.ts"/>
var Directives;
(function (Directives) {
    var AngularTreeMenu = (function () {
        function AngularTreeMenu() {
            var _this = this;
            this.restrict = 'E';
            this.replace = true;
            this.scope = { items: '=', search: '@' };
            this.template = "\n            <div id=\"sideMenu\" ng-init=\"depth = 0\">\n                <script type=\"text/ng-template\" id=\"menuMaker\">\n                    <a href=\"\" ng-href=\"{{!item.children && item.href || '#'}}\" ng-click=\"item.open = !item.open\" class=\"left-pad-{{depth}}x\" target=\"{{item.target || '_self'}}\">\n                        <i class=\"fa fa-fw {{item.icon || 'fa-link'}}\"></i> <span>{{item.title}}</span>\n                        <i class=\"fa side-menu icon-open pull-right {{item.open && 'fa-angle-down' || 'fa-angle-right'}}\" ng-class=\"{toggled: item.open}\" ng-show=\"!!item.children\"></i></a>\n                    </a>\n    \n                    <ul class=\"nav nav-list tree sidebar-menu\" ng-if=\"item.children\" ng-show=\"item.open\">\n                        <li class=\"treeview\" ng-class=\"{active:isActive(item)}\" ng-repeat=\"item in item.children track by $index\" ng-show=\"item.visible\" ng-include=\"'menuMaker'\" ng-init=\"depth = depth + 1\"></li>\n                    </ul>\n                </script>\n            \n                <ul class=\"nav sidebar-menu\">                    \n                    <li class=\"treeview\" ng-class=\"{active:isActive(item) || item.open}\" ng-repeat=\"item in final track by $index\" ng-include=\"'menuMaker'\" ng-show=\"item.visible\"></li>\n                </ul>\n\n            </div>\n        ";
            this.insertAccordingToPriority = function (element, array) {
                var index = 0;
                while (array.length > index && array[index].priority <= element.priority) {
                    index += 1;
                }
                array.splice(index, 0, element);
            };
            this.createFinal = function (items, search) {
                var final = [];
                var original = angular.copy(items);
                var match = function (item) { return (!search || (new RegExp(search, 'i').test(item.title))); };
                for (var i in original) {
                    if (original.hasOwnProperty(i)) {
                        original[i].id = i;
                        original[i].visible = original[i].visible || match(original[i]);
                        if (original[i].parent && original[original[i].parent]) {
                            if (!original[original[i].parent].children)
                                original[original[i].parent].children = [];
                            _this.insertAccordingToPriority(original[i], original[original[i].parent].children);
                            if (_this.isActive(original[i])) {
                                original[original[i].parent].open = true;
                            }
                            if (!!search && (original[i].visible = match(original[i]))) {
                                original[original[i].parent].open = true;
                                original[original[i].parent].visible = true;
                            }
                        }
                        else
                            _this.insertAccordingToPriority(original[i], final);
                    }
                }
                return final;
            };
            this.isActive = function (item) {
                var path = location.pathname;
                var href = item.href || '';
                return (href && ((path == href) || ((path.indexOf(href) == 0) && ((href.match(/\//g) || []).length > 1))));
            };
            this.link = function (scope) {
                scope.isActive = _this.isActive;
                scope.$watch('items', function () { return scope.final = _this.createFinal(scope.items, scope.search); });
                scope.$watch('search', function () { return scope.final = _this.createFinal(scope.items, scope.search); });
            };
        }
        AngularTreeMenu.instance = function () {
            return new AngularTreeMenu;
        };
        return AngularTreeMenu;
    }());
    Directives.AngularTreeMenu = AngularTreeMenu;
    angular.module('AngularTreeMenu', [])
        .directive('angularTreeMenu', AngularTreeMenu.instance);
})(Directives || (Directives = {}));
