import express from 'express';
import App from 'App';
import ReactDomServer from 'react-dom/server';
import React from 'react';
import ConversationV1 from 'watson-developer-cloud/conversation/v1';
import config from '../config';

const app = express();

const conversation = new ConversationV1(config.login);
let id = 1;

const dialogueContexts = {};

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
      </body>
  `)
  id++;
});

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
    let context = undefined;
    if (dialogueContexts.hasOwnProperty(_id)) {
      context = dialogueContexts[_id];
    }
    conversation.message({
      input: {text: message},
      workspace_id: config.workspace_id,
      context: context,
    }, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).send("Sorry, we encountered an error");
      }
      else {
        if (response.output.text.length === 0) {
          res.status(200).send("I don't know what to say...");
        }
        else {
          const reply = response.output.text.join('SPLITPOINT');
          res.status(200).send(reply);
        }
        dialogueContexts[_id] = response.context;
      }
    });
  }
})

app.get('*', (req, res) => {
  res.status(404).send("404 page not found");
});

app.listen(3000, () => {
  console.log('Penni is listening on port 3000');
})
