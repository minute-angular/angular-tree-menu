///<reference path="../../../minute/_all.d.ts"/>

module Directives {
    export class AngularTreeMenu implements ng.IDirective {
        restrict = 'E';
        replace = true;
        scope = {items: '=', search: '@'};
        template:string = `
            <div id="sideMenu" ng-init="depth = 0">
                <script type="text/ng-template" id="menuMaker">
                    <a href="" ng-href="{{!item.children && item.href || '#'}}" ng-click="item.open = !item.open" class="left-pad-{{depth}}x" target="{{item.target || '_self'}}">
                        <i class="fa fa-fw {{item.icon || 'fa-link'}}"></i> <span>{{item.title}}</span>
                        <i class="fa side-menu icon-open pull-right {{item.open && 'fa-angle-down' || 'fa-angle-right'}}" ng-class="{toggled: item.open}" ng-show="!!item.children"></i></a>
                    </a>
    
                    <ul class="nav nav-list tree sidebar-menu" ng-if="item.children" ng-show="item.open">
                        <li class="treeview" ng-class="{active:isActive(item)}" ng-repeat="item in item.children track by $index" ng-show="item.visible" ng-include="'menuMaker'" ng-init="depth = depth + 1"></li>
                    </ul>
                </script>
            
                <ul class="nav sidebar-menu">                    
                    <li class="treeview" ng-class="{active:isActive(item) || item.open}" ng-repeat="item in final track by $index" ng-include="'menuMaker'" ng-show="item.visible"></li>
                </ul>

            </div>
        `;

        static instance():ng.IDirective {
            return new AngularTreeMenu;
        }

        private insertAccordingToPriority = (element, array) => {
            var index = 0;
            while (array.length > index && array[index].priority <= element.priority) {
                index += 1;
            }
            array.splice(index, 0, element);
        };

        private createFinal = (items, search) => {
            var final = [];
            var original = angular.copy(items);
            var match = (item) => (!search || (new RegExp(search, 'i').test(item.title)));

            for (var i in original) {
                if (original.hasOwnProperty(i)) {
                    original[i].id = i;
                    original[i].visible = original[i].visible || match(original[i]);

                    if (original[i].parent && original[original[i].parent]) {
                        if (!original[original[i].parent].children) original[original[i].parent].children = [];
                        this.insertAccordingToPriority(original[i], original[original[i].parent].children);

                        if (this.isActive(original[i])) {
                            original[original[i].parent].open = true;
                        }

                        if (!!search && (original[i].visible = match(original[i]))) {
                            original[original[i].parent].open = true;
                            original[original[i].parent].visible = true;
                        }
                    } else this.insertAccordingToPriority(original[i], final);
                }
            }

            return final;
        };


        private isActive = (item:any) => {
            var path = location.pathname;
            var href = item.href || '';

            return (href && ((path == href) || ((path.indexOf(href) == 0) && ((href.match(/\//g) || []).length > 1))));
        };

        link = (scope:any) => {
            scope.isActive = this.isActive;

            scope.$watch('items', () => scope.final = this.createFinal(scope.items, scope.search));
            scope.$watch('search', () => scope.final = this.createFinal(scope.items, scope.search));
        };
    }

    angular.module('AngularTreeMenu', [])
        .directive('angularTreeMenu', AngularTreeMenu.instance);
}