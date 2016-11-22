import React from 'react';
import http from 'http';
import Message from './Message';
import Loading from './Loading';

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
      recording: false,
      micReady: false,
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.toggleRecord = this.toggleRecord.bind(this);
    this.translateAudio = this.translateAudio.bind(this);
    this.appendMessage = this.appendMessage.bind(this);
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

  sendMessage(e, garbage, talk, path) {
    let message;
    if ((typeof e) === "string") {
      message = e;
    }
    else {
      e.preventDefault();
      message = e.target.message.value;
      e.target.message.value = "";
    }
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
        if (talk) {
          this.speak(replies, path);
        }
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

  speak(replies, path) {
    http.get({
      host: "localhost",
      port: 3000,
      path: "/speak?message="+replies+"&path="+path,
    }, (res) => {
      let path = '';
      res.on('data', (chunk) => {
        path += chunk;
      });

      res.on('end', () => {
        const player = new Audio();
        player.src = path;
        player.play();
      })
    })
  }

  toggleRecord() {
    if (!this.state.recording) {
      if (!this.state.micReady) {
        if (window.Recorder) {
          navigator.getUserMedia({'audio': true}, (stream) => {
            const context = new AudioContext();
            const mic = context.createMediaStreamSource(stream);

            console.log(window.Recorder);

            this.recorder = new Recorder(mic, {
              workerPath: 'bower_components/Recorderjs/recorderWorker.js',
              callback: this.translateAudio.bind(this, this),
            });
            this.recorder.record();
            this.setState({
              micReady: true,
              recording: true,
            });
          }, (err) => {console.log(err)})
        }
        else {
          window.alert("Not ready yet");
          return;
        }
      }
      else {
        this.recorder.record();
        this.setState({
          recording: true,
        })
      }
    }
    else {
      // Already recording
      this.recorder.stop();
      this.recorder.exportWAV();
      this.recorder.clear();
      this.setState({recording: false});
    }
  }

  translateAudio(that, blob) {
    var url = URL.createObjectURL(blob),
        request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'blob';
    request.onload = function () {
      var formData = new FormData(),
          xhr = new XMLHttpRequest(),
          blob,
          player;

      formData.append('audio', this.response);

      xhr.open('POST', 'translate', true);
      xhr.responseType = 'json';
      xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');

      xhr.onload = function () {
        const message = xhr.response.text;
        that.sendMessage(message, undefined, true, xhr.response.path);
      }

      xhr.send(formData);
    }
    request.send();
  }

  appendMessage(message, isBot) {
    this.setState({
      dialogueEntries: this.state.dialogueEntries.concat([(<Message
        text={message}
        key={this.state.dialogueEntries.length}
        isBot={isBot}
      />)]),
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
        <button
          style={{width: "200px", height: "200px", background: "purple"}}
          onClick={this.toggleRecord}
        >Toggle record</button>
        {this.state.recording ? "Recording..." : null}
      </div>
    );
  }
}
