'use strict';

angular.module('twitchguiApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/game/:game', {
        templateUrl: 'app/streams/streams.template.html',
        controller: 'StreamsCtrl',
        controllerAs: 'vm'
      });
  });
