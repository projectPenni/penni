import React from 'react';
import http from 'http';
import Granim from 'granim';

export default class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      requests: [],
    };
  }

  componentDidMount() {
    this.setState({
      requests: this.props.requests,
    });
    setInterval(() => {
      console.log("refreshing");
      http.get({
        host: "localhost",
        port: 3000,
        path: "/refreshAdmin",
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          this.setState({
            requests: JSON.parse(data),
          });
        });
      });
    }, 5*1000);

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

// {req.intents[0].intent}<br/>
  render() {
    const requests = this.state.requests.map((req) => {
      return (
        <div key={req.message} className="admin">
          <p className={req.intents[0].intent}>{req.message}</p>
        </div>
      );
    });
    return (
      <div>
        <h1 className="title">Penni Admin Panel</h1>
        <canvas className="canvas-basic"></canvas>
        {requests}
      </div>
    );
  }
}
