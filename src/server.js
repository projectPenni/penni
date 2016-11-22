import express from 'express';
import App from 'components/App';
import ReactDomServer from 'react-dom/server';
import React from 'react';
import ConversationV1 from 'watson-developer-cloud/conversation/v1';
import config from '../config';
import _ from 'lodash';
import formidable from 'formidable';
import fs from 'fs-extra';
import STT from 'lib/speech-to-text';
import TTS from 'lib/text-to-speech';

function getConversationReply(message, _id) {
  return new Promise((resolve, reject) => {
    let context = undefined;
    let lastResponse = undefined;
    if (dialogueContexts.hasOwnProperty(_id)) {
      context = dialogueContexts[_id];
    }
    if (dialogueResponses.hasOwnProperty(_id)) {
      lastResponse = dialogueResponses[_id];
    }
    conversation.message({
      input: {text: message},
      workspace_id: config.conversation.workspace_id,
      context: context,
    }, (err, response) => {
      if (err) {
        console.error(err);
        resolve("Sorry, we encountered an error");
      }
      else {
        if (response.context.actionNeeded) {
          if (response.intents[0].intent === "emergency") {
            requests.unshift({intents: response.intents, entities: response.entities, message: response.input.text});
          }
          else {
            requests.push({intents: response.intents, entities: response.entities, message: response.input.text});
          }
          delete response.context.actionNeeded;
          console.log(requests);
        }
        const data = {entities: response.entities, intents: response.intents};
        if (response.output.text.length === 0) {
          resolve("I don't know what to say...");
        }
        else if (_.isEqual(lastResponse, data)) {
          resolve("But... you already said that? :(");
        }
        else {
          const reply = response.output.text.join('SPLITPOINT');
          resolve(reply);
        }
        dialogueContexts[_id] = response.context;
        dialogueResponses[_id] = data;

        setTimeout(((data, id) => {
          if (data === dialogueResponses[id]) {
            dialogueResponses[id] = undefined;
          }
        }).bind(null, data, _id), TIMEOUT_CONSTANT);
      }
    });
  });
}

const app = express();

const conversation = new ConversationV1(config.conversation.login);
let id = 1;

const dialogueContexts = {};
const dialogueResponses = {};

const TIMEOUT_CONSTANT = 10*1000;

let fileName = 1;

const requests = [];

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Penni</title>
      </head>
      <body>
        <div id='main'>
        `
          + 'loading...' +
        `
        </div>
        <script>var _id = ` + id.toString() + `</script>
        <script src="/static/build/client.js"></script>
        <script src="/static/bower_components/Recorderjs/recorder.js"></script>
      </body>
  `);
  id++;
});

app.get('/admin', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Admin page</title>
      </head>
      <body>
        <div id='main'>
        `
          + 'loading...' +
        `
        </div>
        <script>var requests = ` + JSON.stringify(requests) + `;</script>
        <script src="/static/build/client2.js"></script>
      </body>
  `);
})

app.get('/message', (req, res) => {
  const message = req.query.message;
  const _id = req.query._id;
  if (!message) {
    res.status(200).send("Sorry, I don't understand that");
  }
  else if (!_id) {
    res.status(400).send("You did not supply your id");
  }
  else {
    getConversationReply(message, _id).then((text) => {
      res.status(200).send(text);
    });
  }
});

app.get('/clearDialogue', (req, res) => {
  const _id = req.query._id;
  dialogueContexts[_id] = undefined;
  dialogueResponses[_id] = undefined;
});

app.post('/translate', (req, res) => {
  const _id = req.query._id;
  const form = new formidable.IncomingForm();
  const result = {};

  form.encoding = 'utf-8';
  form.uploadDir = './tmp';

  form.on('error', (err) => {
    console.log(err);
  });

  form.on('field', (field, value) => {
    try {
      result[field] = JSON.parse(value);
    }
    catch (e) {
      result[field] = value;
    }
  });

  form.on('file', function (field, file) {
    if (field === 'audio') {
      var path = file.path,
          size = file.size / 1000;

      fs.renameSync(path, path + '.wav');
      path += '.wav';

      console.log(path);
      console.log(size);

      result.file = {
        'path': path,
        'size': size,
      }
    }
  });

  form.on('end', function () {
    const params = {
      audio: fs.createReadStream(result.file.path),
      content_type: 'audio/wav',
    }
    STT(params, (err, response) => {
      if (err) {
        res.send(500, {
          error: err,
        });
      }
      else {
        console.log(JSON.stringify(response, null, 4));
        if (response.results.length === 0) {
          res.status(500).send("What did you say?");
        }
        else {
          res.status(200).send({text: response.results[0].alternatives[0].transcript, path:result.file.path});
        }
      }
    })
  });

  form.parse(req);
});

app.get('/speak', (req, res) => {
  const reply = req.query.message.split('SPLITPOINT')[0];
  const params = {
    text: reply,
    voice: 'en-GB_KateVoice',
    accept: 'audio/wav',
  };
  TTS(params, (err, response) => {
    if (err) {
      res.status(500).send({'err': err});
    }
    else {
      const oldPath = req.query.path;
      const path = 'static/responses/' + oldPath;
      fs.removeSync(oldPath);
      fs.outputFileSync(path, response);

      res.send('/' + path);
    }
  });
})

app.get('*', (req, res) => {
  res.status(404).send("404 page not found");
});

app.listen(3000, () => {
  console.log('Penni is listening on port 3000');
})
