'use strict';

var watson = require('watson-developer-cloud'),
    credentials = {};

credentials = require('../../config.js').text_to_speech.login;

module.exports = function (params, cb) {
  var textToSpeech;

  if (credentials) {
    textToSpeech = watson.text_to_speech({
      'username': credentials.username,
      'password': credentials.password,
      'url': credentials.url,
      version: 'v1',
    });

    textToSpeech.synthesize(params, cb);
  }
}
