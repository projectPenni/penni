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
  }

  render() {
    const requests = this.state.requests.map((req) => {
      return (
        <div key={req.message} className={"admin" + ' ' + req.intents[0].intent}>
          <p className={"seat-number" + " " + req.intents[0].intent}>{req.seat}</p>
          <p className={req.intents[0].intent}>{req.message}</p>
        </div>
      );
    });
    return (
      <div>
        <h1 className="title">Penni Admin Panel</h1>
        {requests}
      </div>
    );
  }
}
