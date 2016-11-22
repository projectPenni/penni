'use strict';

var fs = require('fs-extra');

var languageTranslation = require('./language-translation'),
    textToSpeech = require('./text-to-speech');

module.exports = function (output, res) {
  var params = {
    'text': output.speechToText.transcript,
    'source': output.formData.source.code,
    'target': output.formData.target.code
  };

  // Translate Text
  languageTranslation(params, function (err, response) {
    if (err) {
      res.send(500, {
        'error': err
      });
    }
    else {
      console.log(JSON.stringify(response, null, 4));
      output.languageTranslation = {
        'character_count': response.character_count,
        'word_count': response.word_count,
        'translation': response.translations[0].translation
      };

      params = {
        'text': output.languageTranslation.translation,
        'voice': output.formData.target.voice,
        'accept': 'audio/wav'
      };

      textToSpeech(params, function (err, response) {
        if (err) {
          res.send(500, {
            'error': err
          });
        }
        else {

          if (output.speechToText.file) {
            output.textToSpeech = '/responses/' + output.speechToText.file;
            fs.removeSync(output.speechToText.file);
            delete output.speechToText.file;
          }

          fs.outputFileSync('public' + output.textToSpeech, response);

          res.send(JSON.stringify(output));
        }
      });
    }
  });
}
