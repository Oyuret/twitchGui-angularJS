(function(){
  'use strict';

  angular
    .module('twitchguiApp')
    .factory('TwitchAPI', twitchApiFactory);

  twitchApiFactory.$inject = ['$http', '$q'];

  function twitchApiFactory($http, $q) {
    var factory = {
      getGames : getGames,
      getStreams : getStreams,
      getChannel : getChannel
    };
    return factory;

    function getGames(next) {
      var deferred = $q.defer();
      var url = next === '' ? 'https://api.twitch.tv/kraken/games/top?limit=10&offset=0' : next;

      $http.post('/twitch', {url : url})
        .success(function(games){
          deferred.resolve(games);
        })
        .error(function(){
          deferred.resolve("Failed to fetch streams");
        });

      return deferred.promise;

    }

    function getStreams(game, next) {
      var deferred = $q.defer();
      var url = next === '' ? 'https://api.twitch.tv/kraken/streams?limit=10&offset=0&game='+game : next;

      $http.post('/twitch', {url : url})
        .success(function(channels){
          deferred.resolve(channels);
        })
        .error(function(){
          deferred.resolve("Failed to fetch streams");
        });

      return deferred.promise;
    }

    function getChannel(channel) {

    }
  }
})();