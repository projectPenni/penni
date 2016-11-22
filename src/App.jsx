import React from 'react';
import http from 'http';
import Message from 'Message';
import Loading from 'Loading';
import Granim from 'granim';

import "styles/main.scss";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogueEntries: [],
      loading: false,
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    var granimInstance = new Granim({
      element: '.canvas-basic',
      name: 'basic-gradient',
      direction: 'left-right',
      opacity: [1, 1],
      isPausedWhenNotInView: true,
      stateTransitionSpeed: 2000,
      states : {
          "default-state": {
              gradients: [
                  ['#f8edd1', '#ede1cc'],
                  ['#d1dfe7', '#cdebed'],
              ]
          }
      }
    });
  }

  // Maintain scroll at bottom of chat
  componentDidUpdate() {
    document.getElementsByClassName("scrolling-chat")[0].scrollTop = document.getElementsByClassName("scrolling-chat")[0].scrollHeight;
  }

  sendMessage(e) {
    e.preventDefault();
    const message = e.target.message.value;
    e.target.message.value = "";
    if (!message) {
      return;
    }
    this.setState({
      dialogueEntries: this.state.dialogueEntries.concat([(
        <Message
          text={message}
          key={this.state.dialogueEntries.length}
        />
      )]),
      loading: true,
    });
    http.get({
      host: "localhost",
      port: 3000,
      path: "/message?message="+message+"&_id="+this.props._id,
    }, (res) => {
      let replies = '';
      res.on('data', (chunk) => {
        replies += chunk;
      })

      res.on('end', () => {
        replies = replies.split('SPLITPOINT');

        replies = replies.map((reply, index) => {
          return (
            <Message
              text={reply}
              key={index+this.state.dialogueEntries.length}
              isBot
            />
          );
        });

        this.setState({
          dialogueEntries: this.state.dialogueEntries.concat(replies),
          loading: false,
        });
      })
    });
  }

  render() {
    let renderWelcome = () => {
      if ( this.state.dialogueEntries.length <= 0 ){
        return(
          <p className="welcome-message">
            Hey there! I'm Penni, your inflight personal assistant.
            Just type in the text box below or speak into your microphone.
          </p>
        );
      }
    }
    return (
      <div className="home-page">
        <canvas className="canvas-basic"></canvas>
        <div className="scrolling-chat">
          {this.state.dialogueEntries}
        {
          this.state.loading ? <Loading />
          : null
        }
        </div>
        <div>
          { renderWelcome() }
        </div>
        <div className="input">
          <form onSubmit={this.sendMessage}>
            <input type='text' name='message' placeholder="How can I help you?" autoFocus/>
          </form>
        </div>
      </div>
    );
  }
}
