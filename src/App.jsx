import React from 'react';
import http from 'http';
import Message from 'Message';
import Loading from 'Loading';

const TIMEOUT_CONSTANT = 30*1000;
const GOODBYE_TEXT = "See you later!";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogueEntries: [],
      loading: false,
      lastActive: new Date().getTime(),
      active: false,
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      const timeTaken = (new Date().getTime())-this.state.lastActive;
      if (timeTaken > TIMEOUT_CONSTANT && this.state.active) {
        this.goodbye();
      }
    }, 5*1000)
  }

  goodbye() {
    this.setState({
      dialogueEntries: this.state.dialogueEntries.concat([<Message
        text={GOODBYE_TEXT}
        key={this.state.dialogueEntries.length}
      />]),
      active: false,
    });
    http.get({
      host: "localhost",
      port: 3000,
      path: "/clearDialogue?_id="+this.props._id,
    });
  }

  sendMessage(e) {
    e.preventDefault();
    const message = e.target.message.value;
    e.target.message.value = "";
    if (!message) {
      return;
    }
    this.setState({
      dialogueEntries: this.state.dialogueEntries.concat([(<Message
        text={message}
        key={this.state.dialogueEntries.length}
      />)]),
      loading: true,
      lastActive: new Date().getTime(),
      active: true,
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
          return (<Message
            text={reply}
            key={index+this.state.dialogueEntries.length}
            isBot
          />);
        });

        this.setState({
          dialogueEntries: this.state.dialogueEntries.concat(replies),
          loading: false,
          lastActive: new Date().getTime(),
        });
      })
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.sendMessage}>
          <input type='text' name='message' />
        </form>
        {this.state.dialogueEntries}
        {
          this.state.loading ? <Loading />
          : null
        }
      </div>
    );
  }
}
