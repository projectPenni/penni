import React from 'react';
import http from 'http';
import Message from 'Message';
import Loading from 'Loading';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogueEntries: [],
      loading: false,
    };
    this.sendMessage = this.sendMessage.bind(this);
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
          />);
        });

        this.setState({
          dialogueEntries: this.state.dialogueEntries.concat(replies),
          loading: false,
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
