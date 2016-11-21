'use strict';

let ConversationV1 = require('watson-developer-cloud/conversation/v1');
let config = require('./config.js');

let conversation = new ConversationV1(config.login);

conversation.message({
  input: {text: 'Get me a beer'},
  workspace_id: config.workspace_id,
}, (err, response) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.stringify(response, null, 4));
  }
});
