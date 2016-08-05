import angular from 'angular';
import app from './todoApp';

angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name],{
        strictDi: true
    });
});