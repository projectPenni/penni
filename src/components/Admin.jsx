import React from 'react';
import http from 'http';

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
      return (<div key={req.message}>
        {req.intents[0].intent}<br/>
        {req.entities[0].entity}<br/>
        {req.message}<br/>
      </div>);
    });
    return <div>{requests}</div>;
  }
}
