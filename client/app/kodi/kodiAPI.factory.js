(function(){
  'use strict';
  /*jshint latedef: nofunc */

  angular
    .module('twitchGuiApp')
    .factory('KodiAPI', kodiApiFactory);

  kodiApiFactory.$inject = ['$http', '$q', 'cookieSettingsFactory', 'KODI_QUALITIES'];

  function kodiApiFactory($http, $q, cookieSettingsFactory, KODI_QUALITIES) {
    let factory = {
      playStream : playStream
    };
    return factory;

    function playStream(stream) {
      let kodiAddress = cookieSettingsFactory.getKodiAddress();
      let playbackQuality = cookieSettingsFactory.getPlaybackQuality() || KODI_QUALITIES.SETTINGS_DEFAULT;
      let deferred = $q.defer();

      if(kodiAddressIsValid(kodiAddress)) {
        pushPlay(stream, kodiAddress, playbackQuality, deferred);
      } else {
        deferred.reject('Address to Kodi RPC is not correctly defined. Go to Settings and set it.');
      }

      return deferred.promise;
    }

    function kodiAddressIsValid(kodiAddress) {
      let isValid = true;

      if(kodiAddress === undefined) {
        isValid = false;
      }

      if(kodiAddress === '') {
        isValid = false;
      }

      return isValid;
    }

    function pushPlay(stream, kodiAddress, playbackQuality, deferred) {
      let playStreamPath = `plugin://plugin.video.twitch/?mode=play&channel_id=${stream.channelId}&name=${stream.name}`;
      let playVideoRequestData = {
        'jsonrpc': '2.0',
        'method': 'Player.Open',
        'params':{'item':{'file' : playStreamPath }},
        'id': 1
      };

      $http.post('/api/kodi',{query: playVideoRequestData, kodi: kodiAddress})
        .then((res) => {
          if(responseFromKodiIsValid(res.data)) {
            deferred.resolve();
          } else {
            deferred.reject("Response from Kodi was invalid");
          }
        })
        .catch((errorMsg) => deferred.reject(errorMsg));
    }

    function responseFromKodiIsValid(res) {

      if(angular.isUndefined(res.id)) {
        return false;
      }

      if(res.id !== 1) {
        return false;
      }

      if(angular.isUndefined(res.jsonrpc)) {
        return false;
      }

      if(angular.isUndefined(res.result)) {
        return false;
      }

      if(res.result !== "OK") {
        return false;
      }

      return true;
    }
  }
})();
